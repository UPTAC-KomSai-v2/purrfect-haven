import express from 'express';
import {
  createCommunityPost,
  getCommunityPosts,
  getCommunityPostById
} from '../controllers/communityController.js';

const router = express.Router();

// POST /api/community
router.post('/', createCommunityPost);

// GET /api/community
router.get('/', getCommunityPosts);

// GET /api/community/:id
router.get('/:id', getCommunityPostById);

export default router;