"use client";

import { getAllContactMessages, updateMessageStatus, deleteMessage, markAllAsRead } from "@/app/actions/contact";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Check, X, Trash2, Mail, MailOpen, Reply, Archive } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    status: "unread" | "read" | "replied";
    createdAt: Date;
}

export function MessagesList() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getAllContactMessages();
                setMessages(data);
            } catch (error) {
                toast.error("Failed to fetch messages");
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const handleStatusUpdate = async (messageId: string, newStatus: string) => {
        try {
            const result = await updateMessageStatus(messageId, newStatus);
            if (result.success) {
                toast.success(result.message);
                setMessages(prev => prev.map(msg =>
                    msg.id === messageId ? { ...msg, status: newStatus as any } : msg
                ));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to update message status");
        }
    };

    const handleDelete = async (messageId: string, messageName?: string) => {
        if (!confirm(`Are you sure you want to delete this message from ${messageName || 'this sender'}?`)) return;

        try {
            const result = await deleteMessage(messageId);
            if (result.success) {
                toast.success(result.message);
                setMessages(prev => prev.filter(msg => msg.id !== messageId));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    const handleMarkAllAsRead = async () => {
        const unreadCount = messages.filter(msg => msg.status === "unread").length;
        if (unreadCount === 0) {
            toast.info("No unread messages");
            return;
        }

        if (!confirm(`Are you sure you want to mark all ${unreadCount} unread messages as read?`)) return;

        try {
            const result = await markAllAsRead();
            if (result.success) {
                toast.success(result.message);
                setMessages(prev => prev.map(msg =>
                    msg.status === "unread" ? { ...msg, status: "read" } : msg
                ));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to mark all as read");
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            unread: "destructive",
            read: "secondary",
            replied: "default"
        };

        const icons = {
            unread: <Mail className="h-3 w-3 mr-1" />,
            read: <MailOpen className="h-3 w-3 mr-1" />,
            replied: <Reply className="h-3 w-3 mr-1" />
        };

        return (
            <Badge variant={variants[status] || "secondary"}>
                {icons[status as keyof typeof icons]}
                {status}
            </Badge>
        );
    };

    const handleReply = (email: string, name: string) => {
        window.location.href = `mailto:${email}?subject=Re: Your message from our website&body=Hi ${name},\n\nThank you for contacting us. We have received your message and will get back to you soon.\n\nBest regards,\nThe Team`;
    };

    if (loading) {
        return <div className="text-center py-8">Loading messages...</div>;
    }

    const unreadCount = messages.filter(msg => msg.status === "unread").length;

    return (
        <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Contact Messages</h2>
                    <p className="text-muted-foreground">
                        {messages.length} total messages • {unreadCount} unread
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        <Archive className="h-4 w-4 mr-2" />
                        Mark All as Read
                    </Button>
                </div>
            </div>

            {/* Messages Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sender</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No messages found
                                </TableCell>
                            </TableRow>
                        ) : (
                            messages.map((message) => (
                                <TableRow key={message.id} className={message.status === "unread" ? "bg-blue-50/50" : ""}>
                                    <TableCell>
                                        <div className="font-medium">{message.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {message.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-md">
                                            <p className="text-sm line-clamp-2">
                                                {message.message}
                                            </p>
                                            {message.message.length > 100 && (
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="p-0 h-auto text-xs"
                                                    onClick={() => alert(message.message)}
                                                >
                                                    Read more
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(message.status)}
                                            <Select
                                                value={message.status}
                                                onValueChange={(value) => handleStatusUpdate(message.id, value)}
                                            >
                                                <SelectTrigger className="w-28 h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unread">Unread</SelectItem>
                                                    <SelectItem value="read">Read</SelectItem>
                                                    <SelectItem value="replied">Replied</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(message.createdAt), "MMM dd, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleReply(message.email, message.name)}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                title="Reply via email"
                                            >
                                                <Reply className="h-4 w-4" />
                                            </Button>
                                            {message.status === "unread" && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleStatusUpdate(message.id, "read")}
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    title="Mark as read"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(message.id, message.name)}
                                                title="Delete message"
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

            {/* Message Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold">{messages.length}</div>
                    <div className="text-sm text-muted-foreground">Total Messages</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
                    <div className="text-sm text-muted-foreground">Unread</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">
                        {messages.filter(m => m.status === "read").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Read</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">
                        {messages.filter(m => m.status === "replied").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Replied</div>
                </div>
            </div>
        </div>
    );
}