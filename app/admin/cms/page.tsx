export const dynamic = 'force-dynamic';

import { deleteContent } from "@/app/actions/admin";
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
import { content } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Edit2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AdminCMSPage() {
    const allContent = await db
        .select()
        .from(content)
        .orderBy(desc(content.updatedAt));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold">Content Management</h1>
                    <p className="text-muted-foreground">
                        Manage all website content with flexible JSON structure.
                    </p>
                </div>
                <Link href="/admin/cms/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Content
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Key</TableHead>
                            <TableHead>Preview</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allContent.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    No content found. Create your first content entry.
                                </TableCell>
                            </TableRow>
                        ) : (
                            allContent.map((item) => {
                                const dataPreview = JSON.stringify(item.data).substring(0, 80);
                                const formattedCreated = new Date(item.createdAt).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                });
                                const formattedUpdated = new Date(item.updatedAt).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                });

                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium font-mono text-sm">
                                            {item.key}
                                        </TableCell>
                                        <TableCell className="max-w-md">
                                            <code className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                                                {dataPreview}
                                                {JSON.stringify(item.data).length > 80 && "..."}
                                            </code>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formattedCreated}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formattedUpdated}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/cms/${item.key}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <form
                                                    action={async () => {
                                                        "use server";
                                                        await deleteContent(item.id);
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
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
