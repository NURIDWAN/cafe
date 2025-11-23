import { MenuInterface } from "@/components/menu/menu-interface";
import { db } from "@/db/drizzle";
import { categories, products } from "@/db/schema";
import { desc } from "drizzle-orm";

export const metadata = {
    title: "Menu | Cafe Aesthetica",
    description: "Explore our curated selection of coffee, pastries, and more.",
};

export default async function MenuPage() {
    const [allCategories, allProducts] = await Promise.all([
        db.select().from(categories),
        db.select().from(products).orderBy(desc(products.createdAt)),
    ]);

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary py-16 text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                        Our Menu
                    </h1>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto">
                        Carefully curated flavors, crafted with passion and precision.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                <div className="bg-card rounded-xl shadow-xl p-6 md:p-8">
                    <MenuInterface categories={allCategories} products={allProducts} />
                </div>
            </div>
        </div>
    );
}
