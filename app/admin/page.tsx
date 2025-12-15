export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db/drizzle";
import { orders, products, reservations } from "@/db/schema";
import { count } from "drizzle-orm";
import { Calendar, Coffee, DollarSign, ShoppingBag } from "lucide-react";

export default async function AdminDashboard() {
    const [productsCount] = await db.select({ count: count() }).from(products);
    const [ordersCount] = await db.select({ count: count() }).from(orders);
    const [reservationsCount] = await db.select({ count: count() }).from(reservations);

    const stats = [
        {
            label: "Total Products",
            value: productsCount.count,
            icon: Coffee,
            description: "Active menu items",
        },
        {
            label: "Total Orders",
            value: ordersCount.count,
            icon: ShoppingBag,
            description: "Lifetime orders",
        },
        {
            label: "Reservations",
            value: reservationsCount.count,
            icon: Calendar,
            description: "Upcoming bookings",
        },
        {
            label: "Revenue",
            value: "$0.00", // Placeholder until payments are implemented
            icon: DollarSign,
            description: "Total earnings",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back to your cafe management overview.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
