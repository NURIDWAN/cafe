import { MessagesList } from "@/components/admin/messages-list";
import { getUnreadMessageCount } from "@/app/actions/contact";

export default async function AdminMessagesPage() {
    const unreadCount = await getUnreadMessageCount();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Contact Messages</h1>
                <p className="text-muted-foreground">
                    View and manage messages from your contact form.
                </p>
            </div>

            {/* Messages List with all functionality */}
            <MessagesList />
        </div>
    );
}
