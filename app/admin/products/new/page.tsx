import { ProductForm } from "@/components/admin/product-form";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";

export default async function NewProductPage() {
    const allCategories = await db.select().from(categories);

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Add New Product</h1>
                <p className="text-muted-foreground">
                    Create a new item for your menu.
                </p>
            </div>

            <ProductForm categories={allCategories} />
        </div>
    );
}
