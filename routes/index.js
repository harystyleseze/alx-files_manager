import { Router } from 'express';
import AppController from '../controllers/AppController';

const router = Router();

// Route to check the health status of Redis and MongoDB
router.get('/status', AppController.getStatus);

// Route to fetch statistics for users and files
router.get('/stats', AppController.getStats);

export default router;

