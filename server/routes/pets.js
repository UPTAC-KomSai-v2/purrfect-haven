import express from 'express';
import { getPets, getPetById, getAdoptedPets } from '../controllers/petsController.js';

const router = express.Router();

router.get('/', getPets);
router.get('/adopted', getAdoptedPets);  // must be before /:id
router.get('/:id', getPetById);

 
export default router;