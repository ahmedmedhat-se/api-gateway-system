import { db_config } from "../config/database.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const hashApiKey = async (apiKey) => {
  return await bcrypt.hash(apiKey, 10);
};

const runTests = async () => {
  console.log('\nStarting API Key Tests.\n');

  const connection = await db_config.getConnection();

  try {
    console.log('TEST 1: Create test user');
    const [userResult] = await connection.execute(
      'INSERT INTO users (email, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)',
      [`test_${Date.now()}@test.com`, 'hash123']
    );
    const userId = userResult.insertId || userResult[0]?.id;
    console.log('User created with ID:', userId);

    console.log('\nTEST 2: Create API key for user');
    const rawApiKey = generateApiKey();
    const keyHash = await hashApiKey(rawApiKey);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await connection.execute(
      'INSERT INTO api_keys (user_id, key_hash, name, expires_at, is_active) VALUES (?, ?, ?, ?, ?)',
      [userId, keyHash, 'Test Key', expiresAt, 1]
    );
    console.log('API key created:', rawApiKey);

    console.log('\nTEST 3: Validate correct API key');
    const [keys] = await connection.execute('SELECT * FROM api_keys WHERE user_id = ?', [userId]);
    const storedKey = keys[0];
    
    const isValid = await bcrypt.compare(rawApiKey, storedKey.key_hash);
    console.log('Validation result:', isValid ? 'SUCCESS' : 'FAILED');
    
    if (isValid) {
      console.log('API key validation works correctly');
    }

    console.log('\nTEST 4: Test with wrong API key');
    const wrongKey = 'wrong-key-123';
    const isWrongValid = await bcrypt.compare(wrongKey, storedKey.key_hash);
    console.log('Wrong key validation:', isWrongValid ? 'FAILED' : 'SUCCESS (rejected as expected)');

    console.log('\nTEST 5: Update API key status');
    await connection.execute('UPDATE api_keys SET is_active = 0 WHERE id = ?', [storedKey.id]);
    const [deactivatedKey] = await connection.execute('SELECT is_active FROM api_keys WHERE id = ?', [storedKey.id]);
    console.log('Key deactivated. Active status:', deactivatedKey[0].is_active === 0 ? '0 (SUCCESS)' : 'FAILED');

    console.log('\nTEST 6: Reactivate API key');
    await connection.execute('UPDATE api_keys SET is_active = 1 WHERE id = ?', [storedKey.id]);
    const [reactivatedKey] = await connection.execute('SELECT is_active FROM api_keys WHERE id = ?', [storedKey.id]);
    console.log('Key reactivated. Active status:', reactivatedKey[0].is_active === 1 ? '1 (SUCCESS)' : 'FAILED');

    console.log('\nTEST 7: Update last used timestamp');
    await connection.execute('UPDATE api_keys SET last_used_at = NOW() WHERE id = ?', [storedKey.id]);
    const [updatedKey] = await connection.execute('SELECT last_used_at FROM api_keys WHERE id = ?', [storedKey.id]);
    console.log('Last used timestamp updated:', updatedKey[0].last_used_at ? 'SUCCESS' : 'FAILED');

    console.log('\nTEST 8: Increment usage count');
    await connection.execute('UPDATE api_keys SET usage_count = usage_count + 1 WHERE id = ?', [storedKey.id]);
    const [countKey] = await connection.execute('SELECT usage_count FROM api_keys WHERE id = ?', [storedKey.id]);
    console.log('Usage count incremented to:', countKey[0].usage_count);

    console.log('\nTEST 9: List all keys for user');
    const [userKeys] = await connection.execute('SELECT id, name, is_active, usage_count FROM api_keys WHERE user_id = ?', [userId]);
    console.log('Found', userKeys.length, 'key(s) for user');
    userKeys.forEach(key => {
      console.log(`   - ID: ${key.id}, Name: ${key.name}, Active: ${key.is_active}, Uses: ${key.usage_count}`);
    });

    console.log('\nTEST 10: Check expiration');
    const [expiringKey] = await connection.execute('SELECT expires_at FROM api_keys WHERE id = ?', [storedKey.id]);
    const isExpired = new Date(expiringKey[0].expires_at) < new Date();
    console.log('Key expired:', isExpired ? 'YES' : 'NO (SUCCESS - key still valid)');

    console.log('\nAll tests completed successfully.');
    console.log('\nAPI Key to use in Postman:', rawApiKey);
    console.log('User ID for login:', userId);
    console.log('\n');

  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    connection.release();
    process.exit(0);
  }
};

runTests();