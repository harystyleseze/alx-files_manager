import redisClient from './utils/redis';

(async () => {
  console.log(redisClient.isAlive()); // Should print true if Redis is connected

  console.log(await redisClient.get('myKey')); // Should print null (key doesn't exist)

  await redisClient.set('myKey', 'Hello, Redis!', 5); // Set a key with a value and 5-second expiration
  console.log(await redisClient.get('myKey')); // Should print "Hello, Redis!"

  setTimeout(async () => {
    console.log(await redisClient.get('myKey')); // Should print null (key expired)
  }, 10000);
})();
