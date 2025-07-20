import axios from 'axios';
import { Request, Response } from 'express';

const getMatches = async (req: Request, res: Response) => {
    const sportKey = req.query.sport as string || 'americanfootball_nfl';
    const ODDS_API_KEY = process.env.ODDS_API_KEY;
    try {
        const apiRes = await axios.get(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds`, {
            params: {
                apiKey: ODDS_API_KEY,
                regions: 'us',
                markets: 'h2h'
            },
        });
        res.status(200).json(apiRes.data);
        console.log('Matches:', apiRes.data);
    } catch (err) {
        console.error('Odds API error:', err);
        res.status(500).json({ message: 'Failed to fetch matches' });
    }
};  

export default getMatches;