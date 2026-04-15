import { db_config } from '../../config/database.js';

class ApiKey {
  static async create(userId, keyHash, name, expiresAt) {
    const [result] = await db_config.execute(
      'INSERT INTO api_keys (user_id, key_hash, name, expires_at, is_active) VALUES (?, ?, ?, ?, 1)',
      [userId, keyHash, name, expiresAt]
    );
    return result.insertId;
  };

  static async findByKeyHash(keyHash) {
    const [rows] = await db_config.execute(
      'SELECT * FROM api_keys WHERE key_hash = ?',
      [keyHash]
    );
    return rows[0];
  };

  static async findByUser(userId) {
    const [rows] = await db_config.execute(
      'SELECT id, name, created_at, expires_at, is_active, last_used_at FROM api_keys WHERE user_id = ?',
      [userId]
    );
    return rows;
  };

  static async updateStatus(id, isActive) {
    const [result] = await db_config.execute(
      'UPDATE api_keys SET is_active = ? WHERE id = ?',
      [isActive, id]
    );
    return result.affectedRows;
  };

  static async updateLastUsed(id) {
    await db_config.execute(
      'UPDATE api_keys SET last_used_at = NOW() WHERE id = ?',
      [id]
    );
  };

  static async incrementUsageCount(id) {
    await db_config.execute(
      'UPDATE api_keys SET usage_count = usage_count + 1 WHERE id = ?',
      [id]
    );
  };
};

export default ApiKey;