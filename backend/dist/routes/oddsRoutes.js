"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const oddsController_1 = __importDefault(require("../controllers/oddsController"));
const router = express_1.default.Router();
// Route to get the matches
router.get('/matches', oddsController_1.default);
exports.default = router;
