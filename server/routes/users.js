import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getProfile, updateProfile, changePassword } from '../controllers/usersController.js';

const router = express.Router();

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.put('/change-password', requireAuth, changePassword);

export default router;