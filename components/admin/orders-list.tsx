"use client";

import { getAllOrders, updateOrderStatus, deleteOrder } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Check, Trash2, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Order {
    id: string;
    userId: string;
    status: "pending" | "paid" | "completed" | "cancelled";
    totalAmount: number;
    paymentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
}

export function OrdersList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getAllOrders();
                setOrders(data);
            } catch (error) {
                toast.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const result = await updateOrderStatus(orderId, newStatus);
            if (result.success) {
                toast.success(result.message);
                setOrders(prev => prev.map(order =>
                    order.id === orderId ? { ...order, status: newStatus as any } : order
                ));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to update order status");
        }
    };

    const handleDelete = async (orderId: string) => {
        if (!confirm("Are you sure you want to delete this order?")) return;

        try {
            const result = await deleteOrder(orderId);
            if (result.success) {
                toast.success(result.message);
                setOrders(prev => prev.filter(order => order.id !== orderId));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to delete order");
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            pending: "secondary",
            paid: "default",
            completed: "default",
            cancelled: "destructive"
        };

        return (
            <Badge variant={variants[status] || "secondary"} className="capitalize">
                {status}
            </Badge>
        );
    };

    if (loading) {
        return <div className="text-center py-8">Loading orders...</div>;
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No orders found
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>
                                    <div className="font-medium">
                                        {order.user?.name || "Unknown"}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {order.user?.email}
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                    {order.id.slice(0, 8)}...
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-4 w-4" />
                                        {(order.totalAmount / 100).toFixed(2)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(order.status)}
                                        <Select
                                            value={order.status}
                                            onValueChange={(value) => handleStatusUpdate(order.id, value)}
                                        >
                                            <SelectTrigger className="w-32 h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="paid">Paid</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {order.status === "pending" && (
                                            <form
                                                action={async () => {
                                                    await handleStatusUpdate(order.id, "paid");
                                                }}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    title="Mark as Paid"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(order.id)}
                                            title="Delete Order"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}