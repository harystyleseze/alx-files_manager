import sha1 from 'sha1';
import { ObjectID } from 'mongodb';
import Queue from 'bull';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

class UsersController {
  // POST /users - Create a new user
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const users = dbClient.db.collection('users');

      // Check if user already exists
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash password and insert new user
      const hashedPassword = sha1(password);
      const result = await users.insertOne({ email, password: hashedPassword });

      // Add task to queue
      try {
        await userQueue.add({ userId: result.insertedId });
      } catch (queueError) {
        console.error('Failed to add user to queue:', queueError);
      }

      // Respond with new user details
      return res.status(201).json({ id: result.insertedId, email });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /users/me - Retrieve the authenticated user's information
  static async getMe(req, res) {
    const token = req.header('X-Token');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const users = dbClient.db.collection('users');
      const user = await users.findOne({ _id: new ObjectID(userId) });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      return res.status(200).json({ id: userId, email: user.email });
    } catch (error) {
      console.error('Error retrieving user information:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UsersController;

