import { Pool } from "pg";
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

// Export the pool instance
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
