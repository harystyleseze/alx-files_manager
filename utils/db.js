import { MongoClient } from 'mongodb';

const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || 27017;
const DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${HOST}:${PORT}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
    this.client.connect()
      .then(() => {
        this.db = this.client.db(DATABASE);
        console.log(`Connected to MongoDB database: ${DATABASE}`);
      })
      .catch((err) => {
        console.error(`Failed to connect to MongoDB: ${err.message}`);
      });
  }

  isAlive() {
    return this.client && this.client.isConnected();
  }

  async nbUsers() {
    try {
      const usersCollection = this.db.collection('users');
      return await usersCollection.countDocuments();
    } catch (error) {
      console.error(`Error counting users: ${error.message}`);
      return 0;
    }
  }

  async nbFiles() {
    try {
      const filesCollection = this.db.collection('files');
      return await filesCollection.countDocuments();
    } catch (error) {
      console.error(`Error counting files: ${error.message}`);
      return 0;
    }
  }
}

const dbClient = new DBClient();

export default dbClient;
