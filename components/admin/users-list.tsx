"use client";

import { getAllUsers, verifyUserEmail, deleteUser, unverifyUserEmail } from "@/app/actions/users";
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
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Check, X, Trash2, Search, Shield, UserCheck, UserX } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: string;
}

export function UsersList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers(search);
                setUsers(data);
            } catch (error) {
                toast.error("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleVerifyEmail = async (userId: string, verify: boolean) => {
        try {
            const result = verify ? await verifyUserEmail(userId) : await unverifyUserEmail(userId);
            if (result.success) {
                toast.success(result.message);
                setUsers(prev => prev.map(user =>
                    user.id === userId ? { ...user, emailVerified: verify } : user
                ));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to update email verification");
        }
    };

    const handleDelete = async (userId: string, userName?: string) => {
        if (!confirm(`Are you sure you want to delete ${userName || 'this user'}?`)) return;

        try {
            const result = await deleteUser(userId);
            if (result.success) {
                toast.success(result.message);
                setUsers(prev => prev.filter(user => user.id !== userId));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const getRoleBadge = (role: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            admin: "destructive",
            user: "secondary"
        };

        return (
            <Badge variant={variants[role] || "secondary"} className="capitalize">
                {role === "admin" ? (
                    <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Admin
                    </span>
                ) : (
                    role
                )}
            </Badge>
        );
    };

    if (loading) {
        return <div className="text-center py-8">Loading users...</div>;
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Email Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    {search ? "No users found matching your search" : "No users found"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                {user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={user.name || ""}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        {user.name?.charAt(0).toUpperCase() || "U"}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {user.name || "Unnamed User"}
                                                </div>
                                                {user.username && (
                                                    <div className="text-sm text-muted-foreground">
                                                        @{user.username}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {user.emailVerified ? (
                                                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                                    <UserCheck className="h-3 w-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    <UserX className="h-3 w-3 mr-1" />
                                                    Unverified
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {user.emailVerified ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleVerifyEmail(user.id, false)}
                                                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                    title="Revoke email verification"
                                                >
                                                    <UserX className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleVerifyEmail(user.id, true)}
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    title="Verify email"
                                                >
                                                    <UserCheck className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(user.id, user.name || undefined)}
                                                title="Delete user"
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

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold">{users.length}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">
                        {users.filter(u => u.emailVerified).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Verified Emails</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-orange-600">
                        {users.filter(u => !u.emailVerified).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Unverified Emails</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-red-600">
                        {users.filter(u => u.role === 'admin').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Admins</div>
                </div>
            </div>
        </div>
    );
}