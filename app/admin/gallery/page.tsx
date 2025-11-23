import { deleteGalleryItem } from "@/app/actions/admin";
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
import { gallery } from "@/db/schema";
import { asc } from "drizzle-orm";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AdminGalleryPage() {
    const galleryItems = await db
        .select()
        .from(gallery)
        .orderBy(asc(gallery.order), asc(gallery.createdAt));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold">Gallery</h1>
                    <p className="text-muted-foreground">
                        Manage your gallery images and categories.
                    </p>
                </div>
                <Link href="/admin/gallery/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Image
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {galleryItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-secondary/20">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell className="capitalize">{item.category}</TableCell>
                                <TableCell>{item.order}</TableCell>
                                <TableCell className="text-right">
                                    <form
                                        action={async () => {
                                            "use server";
                                            await deleteGalleryItem(item.id);
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
