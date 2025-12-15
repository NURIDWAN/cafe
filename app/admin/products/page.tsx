export const dynamic = 'force-dynamic';

import { deleteProduct } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { db } from "@/db/drizzle";
import { categories, products } from "@/db/schema";
import { formatPrice } from "@/lib/utils";
import { desc, eq } from "drizzle-orm";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AdminProductsPage() {
    const allProducts = await db
        .select({
            id: products.id,
            name: products.name,
            price: products.price,
            imageUrl: products.imageUrl,
            isAvailable: products.isAvailable,
            categoryName: categories.name,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .orderBy(desc(products.createdAt));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your menu items and prices.
                    </p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-secondary/20">
                                        {product.imageUrl && (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.categoryName || "Uncategorized"}</TableCell>
                                <TableCell>{formatPrice(product.price)}</TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.isAvailable
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {product.isAvailable ? "Available" : "Unavailable"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <form
                                        action={async () => {
                                            "use server";
                                            await deleteProduct(product.id);
                                        }}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive/90"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
