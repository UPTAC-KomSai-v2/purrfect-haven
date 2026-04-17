import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create database if it doesn't exist
async function initializeDatabase() {
  const tempPool = mysql.createPool({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    const connection = await tempPool.getConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    connection.release();
    console.log(`✓ Database '${process.env.DB_NAME}' ready`);
  } catch (err) {
    console.error('Failed to create database:', err.message);
    throw err;
  } finally {
    await tempPool.end();
  }
}

// Initialize database on import
await initializeDatabase();

// connection pool for multiple API reqs.
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;