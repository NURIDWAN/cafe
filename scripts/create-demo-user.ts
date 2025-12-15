import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

config({ path: ".env" });

const db = drizzle(process.env.DATABASE_URL!, { schema });

async function createUser() {
    const email = "demo@cafe.com";
    const password = "demo123";
    const name = "Demo User";

    console.log("🔄 Creating demo user...");

    try {
        // First, check if user exists
        const existingUser = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.email, email),
        });

        if (existingUser) {
            console.log("⚠️  User already exists, deleting...");
            // Delete related accounts first
            await db.delete(schema.account).where(eq(schema.account.userId, existingUser.id));
            await db.delete(schema.session).where(eq(schema.session.userId, existingUser.id));
            await db.delete(schema.user).where(eq(schema.user.id, existingUser.id));
            console.log("✅ Old user deleted");
        }

        // Generate a random user ID
        const userId = crypto.randomUUID().replace(/-/g, "").substring(0, 32);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        await db.insert(schema.user).values({
            id: userId,
            name: name,
            email: email,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Create the credential account with hashed password
        const accountId = crypto.randomUUID().replace(/-/g, "").substring(0, 32);
        await db.insert(schema.account).values({
            id: accountId,
            accountId: email,
            providerId: "credential",
            userId: userId,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log("✅ Demo user created successfully!");
        console.log("");
        console.log("📋 Login Details:");
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log("");
        console.log("🌐 You can now login at: http://localhost:3000/login");

    } catch (error: any) {
        console.error("❌ Error:", error.message);
        throw error;
    }
}

createUser()
    .then(() => {
        console.log("✅ Done");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Fatal error:", error);
        process.exit(1);
    });
