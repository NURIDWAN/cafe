import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-secondary/30 border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-serif text-xl font-bold text-primary">
                            Cafe Aesthetica
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Crafting moments of joy through exceptional coffee and artisanal
                            pastries since 2024.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/menu" className="hover:text-primary transition-colors">
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link href="/reservation" className="hover:text-primary transition-colors">
                                    Reservations
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-primary transition-colors">
                                    Our Story
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>123 Coffee Street</li>
                            <li>Jakarta, Indonesia 12345</li>
                            <li>hello@cafeaesthetica.com</li>
                            <li>+62 812 3456 7890</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Cafe Aesthetica. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
