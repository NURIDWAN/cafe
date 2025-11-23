import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const featuredItems = [
    {
        id: 1,
        name: "Signature Latte",
        price: "$5.50",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1937&auto=format&fit=crop",
        description: "Espresso with steamed milk and house-made vanilla syrup.",
    },
    {
        id: 2,
        name: "Almond Croissant",
        price: "$4.75",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1926&auto=format&fit=crop",
        description: "Buttery croissant filled with almond cream and topped with sliced almonds.",
    },
    {
        id: 3,
        name: "Avocado Toast",
        price: "$12.00",
        image: "https://images.unsplash.com/photo-1588137372309-8b6f913b9315?q=80&w=2070&auto=format&fit=crop",
        description: "Sourdough toast topped with smashed avocado, radish, and microgreens.",
    },
];

export default function FeaturedMenu() {
    return (
        <section className="py-24 bg-secondary/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                        Our Favorites
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Discover the tastes that define us. Handpicked selections from our
                        menu that our customers love the most.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="relative h-64 w-full">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="font-serif text-xl">{item.name}</CardTitle>
                                    <span className="font-medium text-primary">{item.price}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{item.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">Add to Cart</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/menu">
                        <Button size="lg" variant="default">View Full Menu</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
