import express from 'express';
import authController from '../controllers/authController';
import { authenticateToken, authenticateTokenAdmin } from '../middleware/authMiddleware';



const router = express();

router.post('/login', authController.login);
router.post('/register', authController.register);

export default router