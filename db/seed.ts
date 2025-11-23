import { db } from "./drizzle";
import { categories, products } from "./schema";
import { nanoid } from "nanoid";

async function seed() {
    console.log("🌱 Seeding database...");

    try {
        // Categories
        const coffeeId = nanoid();
        const pastryId = nanoid();
        const foodId = nanoid();

        await db.insert(categories).values([
            { id: coffeeId, name: "Coffee", slug: "coffee" },
            { id: pastryId, name: "Pastry", slug: "pastry" },
            { id: foodId, name: "Food", slug: "food" },
        ]).onConflictDoNothing();

        console.log("✅ Categories seeded");

        // Products
        await db.insert(products).values([
            {
                id: nanoid(),
                name: "Signature Latte",
                description: "Espresso with steamed milk and house-made vanilla syrup.",
                price: 550, // Stored in cents
                imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1937&auto=format&fit=crop",
                categoryId: coffeeId,
                isAvailable: true,
            },
            {
                id: nanoid(),
                name: "Cappuccino",
                description: "Equal parts espresso, steamed milk, and milk foam.",
                price: 450,
                imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=2035&auto=format&fit=crop",
                categoryId: coffeeId,
                isAvailable: true,
            },
            {
                id: nanoid(),
                name: "Almond Croissant",
                description: "Buttery croissant filled with almond cream and topped with sliced almonds.",
                price: 475,
                imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1926&auto=format&fit=crop",
                categoryId: pastryId,
                isAvailable: true,
            },
            {
                id: nanoid(),
                name: "Pain au Chocolat",
                description: "Flaky pastry filled with dark chocolate.",
                price: 425,
                imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=1932&auto=format&fit=crop",
                categoryId: pastryId,
                isAvailable: true,
            },
            {
                id: nanoid(),
                name: "Avocado Toast",
                description: "Sourdough toast topped with smashed avocado, radish, and microgreens.",
                price: 1200,
                imageUrl: "https://images.unsplash.com/photo-1588137372309-8b6f913b9315?q=80&w=2070&auto=format&fit=crop",
                categoryId: foodId,
                isAvailable: true,
            },
        ]).onConflictDoNothing();

        console.log("✅ Products seeded");
        console.log("🎉 Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
