import express from 'express';
import {
  sendCodeRegister,
  sendCodeLogin,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  logoutUser,
  verifyCode
} from '../controllers/userController';
import { authenticateToken, authenticateTokenAllowExpired } from '../middleware/auth';

const router = express.Router();

// Route to send code to user's phone number and register
router.post('/send-code-register', sendCodeRegister);

// Route to send code to user's phone number and login
router.post('/send-code-login', sendCodeLogin);

// Route to verify code sent to phone
router.post('/verify-code', verifyCode);

// Route to fetch user profile by phone number
router.get('/profile/:phoneNumber', getUserProfile);

// Route to update user profile details
router.put('/profile', updateUserProfile);

// Route to delete user account and details
router.delete('/users', authenticateToken, deleteUser);

// Route to log user out of account
router.post('/logout', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// Route to log user out of account with expired token
router.post('/logout', authenticateTokenAllowExpired, logoutUser);

export default router;
