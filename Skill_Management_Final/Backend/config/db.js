require('dotenv').config();

const { Pool } = require("pg");


console.log("Attempting to connect to DB at host:", 'localhost');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  console.log(`Database Credentials: Host=${pool.host}, User=${pool.user}, Password=${pool.password}, Database=${pool.database}`);

  pool.connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("❌ Failed to connect to PostgreSQL:", err.message);
  });
  
module.exports = pool;