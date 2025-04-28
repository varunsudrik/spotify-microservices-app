import { Pool } from "pg";
let pool = null;

export const dbConnect = async () => {
  if (pool) {
    // If pool is already initialized, skip reinitialization
    return;
  }

  try {
    pool = new Pool({
      host: process.env.PGHOST || "localhost",
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "",
      database: process.env.PGDATABASE || "my_database",
      port: parseInt(process.env.DB_PORT || "5432", 10),
      max: 30, // Equivalent to connectionLimit
      ssl: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });

    // Test the connection
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database successfully");
    client.release();
  } catch (err) {
    console.error("Error initializing PostgreSQL connection:", err);
    throw err;
  }
};

export const executeQuery = async (query, params = []) => {
  try {
    if (!pool) {
      await dbConnect(); // Establish database connection
    }

    const client = await pool.connect();
    try {
      const res = await client.query(query, params);
      return res.rows;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error executing PostgreSQL query:", error);
    throw error;
  }
};
