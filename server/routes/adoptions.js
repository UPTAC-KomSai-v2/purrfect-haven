import express from 'express';
import {
  submitApplication,
  getMyApplications,
  getAllAdoptions,
  updateAdoptionStatus,
} from '../controllers/adoptionsController.js';
import { requireAuth }  from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();

// regular user routes (kailangan naka-login lang)
router.post('/',   requireAuth,  submitApplication);
router.get('/me',  requireAuth,  getMyApplications);

// admin-only routes (kailangan is_admin = 1)
router.get('/',              requireAdmin, getAllAdoptions);
router.put('/:id/status',    requireAdmin, updateAdoptionStatus);

export default router;