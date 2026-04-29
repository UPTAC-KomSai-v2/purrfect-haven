import express from 'express';
import {
  submitRescueReport,
  getRescueReports,
  getRescueReportById,
} from '../controllers/rescueController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// POST /api/rescue — submit a rescue report (requires login)
router.post('/', requireAuth, submitRescueReport);

// GET /api/rescue/me — current user's reports (must be before /:id)
router.get('/me', requireAuth, (req, res) => {
  req.query.mine = 'true';
  getRescueReports(req, res);
});

// GET /api/rescue — get all rescue reports (admin view)
router.get('/', getRescueReports);

// GET /api/rescue/:id — get a specific rescue report
router.get('/:id', getRescueReportById);

export default router;
