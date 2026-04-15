import { db_config } from '../../config/database.js';

class User {
  static async create(email, passwordHash) {
    const [result] = await db_config.execute(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );
    return result.insertId;
  };

  static async findByEmail(email) {
    const [rows] = await db_config.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  };

  static async findById(id) {
    const [rows] = await db_config.execute(
      'SELECT id, email, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }
};

export default User;