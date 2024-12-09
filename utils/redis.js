import { createClient } from 'redis';
import { promisify } from 'util';


// Class to define methods for commonly used Redis commands
class RedisClient {
  constructor() {
    // Create the Redis client
    this.client = createClient();

    // Log connection success
    this.client.on('ready', () => {
      console.log('Redis client connected to the server');
    });

    // Handle connection errors
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error}`);
    });
  }

  /**
   * Checks if the Redis client is connected.
   * @returns {boolean} true if connected, false otherwise
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Gets the value of a key in Redis.
   * @param {string} key - The key to fetch the value for
   * @returns {Promise<string|null>} The value of the key or null if not found
   */
  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    return redisGet(key);
  }

  /**
   * Sets a value in Redis with an expiration.
   * @param {string} key - The key to set
   * @param {string|number} value - The value to store
   * @param {number} time - Expiration time in seconds
   * @returns {Promise<void>}
   */
  async set(key, value, time) {
    const redisSetex = promisify(this.client.setex).bind(this.client);
    await redisSetex(key, time, value);
  }

  /**
   * Deletes a key in Redis.
   * @param {string} key - The key to delete
   * @returns {Promise<void>}
   */
  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

// Create and export a single instance of RedisClient
const redisClient = new RedisClient();

export default redisClient;
