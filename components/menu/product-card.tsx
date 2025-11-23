import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
    };
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <div className="relative h-48 w-full bg-secondary/20">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="font-serif text-lg">{product.name}</CardTitle>
                    <span className="font-medium text-primary whitespace-nowrap">
                        {formatPrice(product.price)}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                </p>
            </CardContent>
            <CardFooter>
                <Button className="w-full" disabled={!product.isAvailable}>
                    {product.isAvailable ? "Add to Cart" : "Sold Out"}
                </Button>
            </CardFooter>
        </Card>
    );
}
