import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "../db/schema";

config({ path: ".env" });

const db = drizzle(process.env.DATABASE_URL!, { schema });

async function runMigration() {
  try {
    // Create testimonials table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "testimonials" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "role" text,
        "company" text,
        "content" text NOT NULL,
        "rating" integer NOT NULL,
        "imageUrl" text,
        "isActive" boolean DEFAULT true NOT NULL,
        "order" integer DEFAULT 0 NOT NULL,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
      );
    `);

    // Create team table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "team" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "role" text NOT NULL,
        "bio" text,
        "imageUrl" text,
        "isActive" boolean DEFAULT true NOT NULL,
        "order" integer DEFAULT 0 NOT NULL,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
      );
    `);

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();