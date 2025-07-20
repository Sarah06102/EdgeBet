"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const getMatches = async (req, res) => {
    const sportKey = req.query.sport || 'americanfootball_nfl';
    const ODDS_API_KEY = process.env.ODDS_API_KEY;
    try {
        const apiRes = await axios_1.default.get(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds`, {
            params: {
                apiKey: ODDS_API_KEY,
                regions: 'us',
                markets: 'h2h'
            },
        });
        res.status(200).json(apiRes.data);
        console.log('Matches:', apiRes.data);
    }
    catch (err) {
        console.error('Odds API error:', err);
        res.status(500).json({ message: 'Failed to fetch matches' });
    }
};
exports.default = getMatches;
