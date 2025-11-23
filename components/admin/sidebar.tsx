"use client";

import { cn } from "@/lib/utils";
import {
    BarChart,
    Calendar,
    Coffee,
    FileText,
    LayoutDashboard,
    Settings,
    Users,
    MessageSquare,
    UserCheck,
    ShoppingCart,
    Tags,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/admin",
    },
    {
        icon: Tags,
        label: "Categories",
        href: "/admin/categories",
    },
    {
        icon: Coffee,
        label: "Products",
        href: "/admin/products",
    },
    {
        icon: ShoppingCart,
        label: "Orders",
        href: "/admin/orders",
    },
    {
        icon: Calendar,
        label: "Reservations",
        href: "/admin/reservations",
    },
    {
        icon: BarChart,
        label: "Gallery",
        href: "/admin/gallery",
    },
    {
        icon: MessageSquare,
        label: "Testimonials",
        href: "/admin/testimonials",
    },
    {
        icon: UserCheck,
        label: "Team",
        href: "/admin/team",
    },
    {
        icon: FileText,
        label: "Messages",
        href: "/admin/messages",
    },
    {
        icon: Users,
        label: "Users",
        href: "/admin/users",
    },
    {
        icon: FileText,
        label: "CMS",
        href: "/admin/cms",
    },
    {
        icon: Settings,
        label: "Settings",
        href: "/admin/settings",
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-card min-h-screen p-6">
            <div className="flex items-center gap-2 mb-8">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <Coffee className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-serif text-xl font-bold">Admin Panel</span>
            </div>

            <nav className="space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
