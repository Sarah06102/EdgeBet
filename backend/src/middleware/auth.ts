// Custom authentication
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Load secret key for JWT verification
const jwtSecret = process.env.JWT_SECRET!;


// Middleware to authenticate requests using JWT. It rejects if token is missing, malformed, invalid, or expired.
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware that allows expired tokens. This is useful for flows like logout or account deletion.
export const authenticateTokenAllowExpired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    (req as any).user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      next();
    } else {
      return res.status(403).json({ message: 'Invalid token' });
    }
  }
};

