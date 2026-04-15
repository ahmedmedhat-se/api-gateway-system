import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD", "DB_PORT"];
requiredEnvVars.forEach((varName) => {
    if(!process.env[varName]){
        throw new Error(`Missing required environment variable: ${varName}`);
    };
});

export const db_config = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});