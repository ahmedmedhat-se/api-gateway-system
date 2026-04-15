import Log from '../models/Log.js';

export const logRequest = async (req, res, apiKeyId, responseTime) => {
  const logData = {
    apiKeyId: apiKeyId || null,
    endpoint: req.originalUrl,
    method: req.method,
    statusCode: res.statusCode,
    responseTime: responseTime,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'] || null
  };
  
  await Log.create(logData);
};

export const getRequestStats = async (apiKeyId, startDate, endDate) => {
  return await Log.getStats(apiKeyId, startDate, endDate);
};