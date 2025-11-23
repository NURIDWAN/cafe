import { auth } from "../lib/auth";

async function seed() {
    console.log("🌱 Seeding database with Better Auth...");

    try {
        // Check if admin user already exists
        const existingUser = await auth.api.getUser({
            query: {
                email: "admin@cafeasthetica.com",
            },
        });

        if (existingUser) {
            console.log("✅ Admin user already exists");
            console.log("📧 Email: admin@cafeasthetica.com");
            console.log("👤 Username: admin");
            console.log("🔑 Password: admin123");
            return;
        }

        // Create admin user using Better Auth API
        const newUser = await auth.api.signUpEmail({
            body: {
                email: "admin@cafeasthetica.com",
                password: "admin123",
                name: "Admin",
            },
        });

        if (newUser) {
            console.log("✅ Admin user created successfully!");
            console.log("📧 Email: admin@cafeasthetica.com");
            console.log("👤 Username: admin (you can set this in database)");
            console.log("🔑 Password: admin123");
            console.log("⚠️  Please change the password after first login!");
        }
    } catch (error: any) {
        console.error("❌ Seed failed:", error.message);
        throw error;
    }
}

seed()
    .then(() => {
        console.log("✅ Seeding completed");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Fatal error:", error);
        process.exit(1);
    });
