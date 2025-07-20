// All user routes 
import express from 'express';
import { registerOrLoginUser, updateUserProfile, getUserProfile } from '../controllers/userController';

const router = express.Router();

// Route to register or login user
router.post('/auth', registerOrLoginUser); 

// Route to get user profile
router.get('/profile/:phoneNumber', getUserProfile);

// Route to update user profile
router.put('/profile', updateUserProfile);

export default router;