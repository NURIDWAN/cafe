import { OrdersList } from "@/components/admin/orders-list";
import { getOrderStats } from "@/app/actions/orders";

export default async function AdminOrdersPage() {
    const stats = await getOrderStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Orders</h1>
                <p className="text-muted-foreground">
                    Manage customer orders and track fulfillment status.
                </p>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">${stats.totalRevenue.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
            </div>

            {/* Orders List */}
            <OrdersList />
        </div>
    );
}