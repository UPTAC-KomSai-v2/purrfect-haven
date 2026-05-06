import express from 'express';
import { getProfile, updateProfile } from '../controllers/usersController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Usage of requireAuth middleware
router.get('/dashboard', requireAuth, getProfile);
router.put('/dashboard', requireAuth, updateProfile);

export default router;