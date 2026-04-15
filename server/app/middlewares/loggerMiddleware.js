import { logRequest } from '../services/loggingService.js';

export const requestLogger = async (req, res, next) => {
  const startTime = Date.now();
  
  const originalJson = res.json;
  res.json = function(data) {
    res.responseData = data;
    return originalJson.call(this, data);
  };
  
  res.on('finish', async () => {
    const responseTime = Date.now() - startTime;
    const apiKeyId = req.apiKey ? req.apiKey.id : null;
    
    await logRequest(req, res, apiKeyId, responseTime);
  });
  
  next();
};