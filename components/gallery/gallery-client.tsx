"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

interface GalleryItem {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    category: string;
}

interface GalleryPageClientProps {
    items: GalleryItem[];
}

export function GalleryPageClient({ items }: GalleryPageClientProps) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

    // Extract unique categories from items and add "All" option
    const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
    const categories = [
        { value: "all", label: "All Images" },
        ...uniqueCategories.map(category => ({
            value: category,
            label: category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")
        }))
    ];

    const filteredItems = items.filter(
        (item) => selectedCategory === "all" || item.category === selectedCategory
    );

    const openLightbox = (item: GalleryItem) => {
        setSelectedImage(item);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = "auto";
    };

    return (
        <div className="space-y-8">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 justify-center sticky top-16 z-40 bg-background/95 backdrop-blur py-4 border-b">
                {categories.map((category) => (
                    <Button
                        key={category.value}
                        variant={selectedCategory === category.value ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category.value)}
                        className="rounded-full"
                    >
                        {category.label}
                        <Badge variant="secondary" className="ml-2 px-2 py-0 text-xs">
                            {category.value === "all"
                                ? items.length
                                : items.filter(item => item.category === category.value).length
                            }
                        </Badge>
                    </Button>
                ))}
            </div>

            {/* Gallery Stats */}
            <div className="text-center">
                <p className="text-muted-foreground">
                    Showing {filteredItems.length} of {items.length} images
                </p>
            </div>

            {/* Gallery Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <Card
                            key={item.id}
                            className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                            onClick={() => openLightbox(item)}
                        >
                            <div className="relative h-64 bg-secondary/20">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                    <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <Badge
                                    className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                                    variant="secondary"
                                >
                                    {categories.find(c => c.value === item.category)?.label}
                                </Badge>
                            </div>
                            {item.title && (
                                <div className="p-4">
                                    <h3 className="font-medium group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    {item.description && (
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">
                        No images found in this category.
                    </p>
                    <Button
                        variant="link"
                        onClick={() => setSelectedCategory("all")}
                        className="mt-2"
                    >
                        View all images
                    </Button>
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <div className="relative max-w-6xl max-h-full">
                        <button
                            onClick={closeLightbox}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                            aria-label="Close lightbox"
                        >
                            <X className="h-8 w-8" />
                        </button>

                        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                            <div className="relative max-w-4xl max-h-[70vh]">
                                <Image
                                    src={selectedImage.imageUrl}
                                    alt={selectedImage.title}
                                    width={1200}
                                    height={800}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                            {selectedImage.title && (
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
                                        <Badge variant="outline">
                                            {categories.find(c => c.value === selectedImage.category)?.label}
                                        </Badge>
                                    </div>
                                    {selectedImage.description && (
                                        <p className="text-gray-600">{selectedImage.description}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
