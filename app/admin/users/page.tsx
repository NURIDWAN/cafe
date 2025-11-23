import { UsersList } from "@/components/admin/users-list";
import { getUserStats } from "@/app/actions/users";

export default async function AdminUsersPage() {
    const stats = await getUserStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">
                    Manage users and their roles.
                </p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
                    <div className="text-sm text-muted-foreground">Verified Emails</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-orange-600">{stats.unverified}</div>
                    <div className="text-sm text-muted-foreground">Unverified Emails</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-purple-600">{stats.admin}</div>
                    <div className="text-sm text-muted-foreground">Admins</div>
                </div>
            </div>

            {/* Users List */}
            <UsersList />
        </div>
    );
}
