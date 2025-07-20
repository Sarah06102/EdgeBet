import express from 'express';
import getMatches from '../controllers/oddsController';

const router = express.Router();

router.get('/matches', getMatches);

export default router;
