import "dotenv/config";
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const migrationsDirectory = resolve(projectRoot, "migrations");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run migrations");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const migrationFiles = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    const alreadyApplied = await client.query(
      "SELECT 1 FROM schema_migrations WHERE name = $1",
      [file],
    );

    if (alreadyApplied.rowCount > 0) {
      console.log(`Skipping ${file} (already applied)`);
      continue;
    }

    const sql = await readFile(resolve(migrationsDirectory, file), "utf8");

    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [
        file,
      ]);
      await client.query("COMMIT");
      console.log(`Applied ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
} finally {
  client.release();
  await pool.end();
}
