import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
   * Handle GET /status
   * Responds with the status of Redis and MongoDB
   */
  static getStatus(request, response) {
    response.status(200).json({ 
      redis: redisClient.isAlive(), 
      db: dbClient.isAlive() 
    });
  }

  /**
   * Handle GET /stats
   * Responds with the number of users and files in MongoDB
   */
  static async getStats(request, response) {
    try {
      const usersNum = await dbClient.nbUsers();
      const filesNum = await dbClient.nbFiles();
      response.status(200).json({ users: usersNum, files: filesNum });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Unable to retrieve statistics' });
    }
  }
}

export default AppController;
