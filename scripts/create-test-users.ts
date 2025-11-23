import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { nanoid } from "nanoid";

async function createTestUsers() {
  try {
    const testUsers = [
      {
        name: "John Doe",
        email: "john@customer.com",
        username: "johndoe",
      },
      {
        name: "Jane Smith",
        email: "jane@customer.com",
        username: "janesmith",
      },
      {
        name: "Mike Wilson",
        email: "mike@customer.com",
        username: "mikewilson",
      },
    ];

    console.log("🔄 Creating test users...");

    for (const testUser of testUsers) {
      // Check if user already exists
      const existingUser = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.email, testUser.email),
      });

      if (existingUser) {
        console.log(`⚠️  User ${testUser.email} already exists, skipping...`);
        continue;
      }

      // Create test user
      await db.insert(user).values({
        id: nanoid(),
        name: testUser.name,
        email: testUser.email,
        username: testUser.username,
        emailVerified: Math.random() > 0.5, // Random verification status
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Created user: ${testUser.email}`);
    }

    console.log("\n📋 Test User Accounts:");
    console.log("1️⃣ John Doe: john@customer.com");
    console.log("2️⃣ Jane Smith: jane@customer.com");
    console.log("3️⃣ Mike Wilson: mike@customer.com");
    console.log("\n💡 Note: Passwords will need to be set via the forgot password flow");

  } catch (error) {
    console.error("❌ Error creating test users:", error);
  }
}

// Run the script
createTestUsers();