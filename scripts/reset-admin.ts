import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

config({ path: ".env" });

const db = drizzle(process.env.DATABASE_URL!, { schema });

async function resetAdmin() {
    console.log("🗑️  Deleting old admin user...");

    try {
        // Delete old user and related data
        await db.delete(schema.user).where(eq(schema.user.email, "admin@cafeasthetica.com"));

        console.log("✅ Old admin deleted");
        console.log("");
        console.log("Now run this curl command to create new admin:");
        console.log("");
        console.log('curl -X POST http://localhost:3001/api/auth/sign-up/email -H "Content-Type: application/json" -d \'{"email":"admin@cafeasthetica.com","password":"admin123","name":"Admin"}\'');
        console.log("");
    } catch (error: any) {
        console.error("❌ Error:", error.message);
        throw error;
    }
}

resetAdmin()
    .then(() => {
        console.log("✅ Done");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Fatal error:", error);
        process.exit(1);
    });
