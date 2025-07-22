"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Route to send code to user's phone number and register
router.post('/send-code-register', userController_1.sendCodeRegister);
// Route to send code to user's phone number and login
router.post('/send-code-login', userController_1.sendCodeLogin);
// Route to verify code sent to phone when registering
router.post('/verify-code-register', userController_1.verifyCodeRegister);
// Route to verify code sent to phone when logging in
router.post('/verify-code-login', userController_1.verifyCodeLogin);
// Route to fetch user profile by JWT token
router.get('/profile', auth_1.authenticateToken, userController_1.getUserProfile);
// Route to update user profile details
router.put('/profile', userController_1.updateUserProfile);
// Route to delete user account and details
router.delete('/users', auth_1.authenticateToken, userController_1.deleteUser);
// Route to log user out of account
router.post('/logout', auth_1.authenticateToken, userController_1.logoutUser);
// Route to log user out of account with expired token
router.post('/logout', auth_1.authenticateTokenAllowExpired, userController_1.logoutUser);
exports.default = router;
