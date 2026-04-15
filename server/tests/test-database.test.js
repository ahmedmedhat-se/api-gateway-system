import { db_config } from "../config/database.js";

export const testDatabaseConnection = async () => {
    console.log("Testing Database Connection.");
    let connection;
    try {
        connection = await db_config.getConnection();
        await connection.ping();
        console.log("Database Connected Successfully.");
        process.exit(0);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    };
};

testDatabaseConnection();