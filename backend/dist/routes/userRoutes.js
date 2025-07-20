"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// All user routes 
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Route to register or login user
router.post('/auth', userController_1.registerOrLoginUser);
// Route to get user profile
router.get('/profile/:phoneNumber', userController_1.getUserProfile);
// Route to update user profile
router.put('/profile', userController_1.updateUserProfile);
exports.default = router;
