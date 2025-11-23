import { CategoryForm } from "@/components/admin/category-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewCategoryPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/categories">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="font-serif text-3xl font-bold">New Category</h1>
                    <p className="text-muted-foreground">
                        Create a new category for your menu items.
                    </p>
                </div>
            </div>

            <CategoryForm />
        </div>
    );
}