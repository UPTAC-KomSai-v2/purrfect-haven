import express from 'express';
import { getProfile } from '../controllers/usersController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Usage of requireAuth middleware
router.get('/profile', requireAuth, getProfile);

export default router;