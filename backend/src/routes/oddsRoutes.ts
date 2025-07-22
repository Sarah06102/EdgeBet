import express from 'express';
import getMatches from '../controllers/oddsController';

const router = express.Router();

// Route to get the matches
router.get('/matches', getMatches);

export default router;
