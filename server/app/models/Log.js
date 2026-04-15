import { db_config } from '../../config/database.js';

class Log {
  static async create(logData) {
    const [result] = await db_config.execute(
      `INSERT INTO request_logs 
      (api_key_id, endpoint, method, status_code, response_time, ip_address, user_agent) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        logData.apiKeyId,
        logData.endpoint,
        logData.method,
        logData.statusCode,
        logData.responseTime,
        logData.ipAddress,
        logData.userAgent
      ]
    );
    return result.insertId;
  }

  static async getStats(apiKeyId, startDate, endDate) {
    const [rows] = await db_config.execute(
      `SELECT 
        COUNT(*) as total_requests,
        AVG(response_time) as avg_response_time,
        MAX(response_time) as max_response_time,
        MIN(response_time) as min_response_time,
        status_code
      FROM request_logs 
      WHERE api_key_id = ? 
        AND created_at BETWEEN ? AND ?
      GROUP BY status_code`,
      [apiKeyId, startDate, endDate]
    );
    return rows;
  }
}

export default Log;