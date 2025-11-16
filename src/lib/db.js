import mysql from 'mysql2/promise';

// Database connection configuration
// TODO: Use environment variables for these values
const dbConfig = {
  host: 'localhost',
  user: 'sluser',
  password: 'root1234',
  database: 'skolens',
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Export the pool to be used in other modules
export default pool;
