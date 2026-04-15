import { db_config } from '../../config/database.js';

class RateLimitService {
  constructor(windowMs = 60000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  async checkLimit(apiKeyId) {
    const windowStart = new Date(Date.now() - this.windowMs);
    
    const [rows] = await db_config.execute(
      `SELECT COUNT(*) as request_count 
       FROM request_logs 
       WHERE api_key_id = ? 
         AND created_at > ?`,
      [apiKeyId, windowStart]
    );
    
    const currentCount = rows[0].request_count;
    
    if (currentCount >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(Date.now() + this.windowMs)
      };
    }
    
    return {
      allowed: true,
      remaining: this.maxRequests - currentCount - 1,
      resetTime: new Date(Date.now() + this.windowMs)
    };
  }
}

export default RateLimitService;