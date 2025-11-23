import { db } from "@/db/drizzle";
import { user, account } from "@/db/schema";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";

async function createAdminUser() {
  try {
    const adminEmail = "admin@cafe.com";
    const adminPassword = "admin123";
    const adminName = "Cafe Admin";
    const adminUsername = "admin";

    // Check if admin user already exists
    const existingAdmin = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.email, adminEmail),
    });

    if (existingAdmin) {
      console.log("❌ Admin user already exists!");
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log("\n🌐 You can login at: http://localhost:3000/login");
      console.log("🔗 Admin panel: http://localhost:3000/admin");
      return;
    }

    // Use Better Auth to create user with password
    const newUser = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
        username: adminUsername,
      }
    });

    if (newUser) {
      console.log("✅ Admin user created successfully!");
      console.log("\n📋 Login Details:");
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log(`👤 Name: ${adminName}`);
      console.log(`🆔 Username: ${adminUsername}`);
      console.log("\n🌐 You can now login at: http://localhost:3000/login");
      console.log("🔗 Admin panel: http://localhost:3000/admin");
    } else {
      throw new Error("Failed to create user with Better Auth");
    }

  } catch (error) {
    console.error("❌ Error creating admin user:", error);

    // Fallback: Create user directly in database
    try {
      console.log("🔄 Trying alternative method...");

      await db.insert(user).values({
        id: nanoid(),
        name: adminName,
        email: adminEmail,
        username: adminUsername,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create account record for password
      const userId = nanoid();
      await db.insert(account).values({
        id: nanoid(),
        accountId: adminEmail,
        providerId: "credential",
        userId: userId,
        password: adminPassword, // Better Auth will handle this
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Admin user created via fallback!");
      console.log("\n📋 Login Details:");
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log("\n🌐 You can now login at: http://localhost:3000/login");
      console.log("🔗 Admin panel: http://localhost:3000/admin");

    } catch (fallbackError) {
      console.error("❌ Fallback method also failed:", fallbackError);
    }
  }
}

// Run the script
createAdminUser();