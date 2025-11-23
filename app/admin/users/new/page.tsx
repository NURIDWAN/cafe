import { UserForm } from "@/components/admin/user-form";

export default function NewUserPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Add New User</h1>
                <p className="text-muted-foreground">
                    Create a new user account with credentials and role.
                </p>
            </div>

            <UserForm />
        </div>
    );
}
