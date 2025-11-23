import { getAllCategories } from "@/app/actions/categories";
import { CategoryForm } from "@/components/admin/category-form";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash2, Package } from "lucide-react";
import Link from "next/link";

export default async function AdminCategoriesPage() {
    const categories = await getAllCategories();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold">Categories</h1>
                    <p className="text-muted-foreground">
                        Manage menu categories for your products.
                    </p>
                </div>
                <Link href="/admin/categories/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                </Link>
            </div>

            {/* Categories Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold">{categories.length}</div>
                    <div className="text-sm text-muted-foreground">Total Categories</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">
                        {categories.filter(c => c.name.toLowerCase().includes('coffee')).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Coffee Categories</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">
                        {categories.filter(c => c.name.toLowerCase().includes('food')).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Food Categories</div>
                </div>
            </div>

            {/* Categories Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No categories found
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                            {category.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="px-2 py-1 bg-muted rounded text-sm">
                                            {category.slug}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/admin/categories/${category.id}/edit`}>
                                            <Button variant="ghost" size="icon" title="Edit Category">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <form
                                            action={async () => {
                                                "use server";
                                                const { deleteCategory } = await import("@/app/actions/categories");
                                                await deleteCategory(category.id);
                                            }}
                                            className="inline"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive/90"
                                                title="Delete Category"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}