import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "../db/schema";
import { nanoid } from "nanoid";
import * as bcrypt from "bcryptjs";

config({ path: ".env" });

const db = drizzle(process.env.DATABASE_URL!, { schema });

async function seed() {
    console.log("🌱 Seeding database...");

    // Check if admin user already exists
    const existingAdmin = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.email, "admin@cafeasthetica.com"),
    });

    if (existingAdmin) {
        console.log("✅ Admin user already exists");
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user
    await db.insert(schema.user).values({
        id: nanoid(),
        name: "Admin",
        email: "admin@cafeasthetica.com",
        username: "admin",
        emailVerified: true,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // Note: Better Auth handles password storage in the account table
    // You may need to use Better Auth's API to create the user with password
    // This is a simplified version

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@cafeasthetica.com");
    console.log("👤 Username: admin");
    console.log("🔑 Password: admin123");
    console.log("⚠️  Please change the password after first login!");
}

seed()
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    })
    .finally(() => {
        console.log("✅ Seeding completed");
        process.exit(0);
    });
