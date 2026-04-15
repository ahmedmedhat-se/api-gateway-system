import RateLimitService from '../services/rateLimitService.js';
import { errorResponse } from '../../utils/response.js';
import dotenv from 'dotenv';

dotenv.config();

const rateLimitService = new RateLimitService(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
);

export const rateLimiter = async (req, res, next) => {
  if (!req.apiKey) {
    return next();
  };
  
  const { allowed, remaining, resetTime } = await rateLimitService.checkLimit(req.apiKey.id);
  
  res.setHeader('X-RateLimit-Limit', rateLimitService.maxRequests);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', resetTime.getTime());
  
  if (!allowed) {
    return errorResponse(res, 'Rate limit exceeded. Please try again later.', 429);
  };
  
  next();
};