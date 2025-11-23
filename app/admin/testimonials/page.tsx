import { deleteTestimonial, getTestimonials } from "@/app/actions/testimonials";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, StarOff, Trash2, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AdminTestimonialsPage() {
    const testimonials = await getTestimonials();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold">Testimonials</h1>
                    <p className="text-muted-foreground">
                        Manage customer testimonials and reviews.
                    </p>
                </div>
                <Link href="/admin/testimonials/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Role/Company</TableHead>
                            <TableHead>Content Preview</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {testimonials.map((testimonial) => (
                            <TableRow key={testimonial.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {testimonial.imageUrl ? (
                                            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-secondary/20">
                                                <Image
                                                    src={testimonial.imageUrl}
                                                    alt={testimonial.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                                                <span className="text-sm font-medium">
                                                    {testimonial.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium">{testimonial.name}</div>
                                            {testimonial.role && (
                                                <div className="text-sm text-muted-foreground">
                                                    {testimonial.role}
                                                    {testimonial.company && ` • ${testimonial.company}`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i < testimonial.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm font-medium">
                                            {testimonial.rating}.0
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                    {testimonial.company || testimonial.role || "-"}
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                                        {testimonial.content}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={testimonial.isActive ? "default" : "secondary"}>
                                        {testimonial.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{testimonial.order}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <form
                                            action={async () => {
                                                "use server";
                                                await deleteTestimonial(testimonial.id);
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
                        ))}
                    </TableBody>
                </Table>

                {testimonials.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            No testimonials yet. Add your first customer testimonial!
                        </p>
                        <Link href="/admin/testimonials/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}