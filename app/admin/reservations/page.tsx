import { updateReservationStatus } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { db } from "@/db/drizzle";
import { reservations } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Check, X } from "lucide-react";

export default async function AdminReservationsPage() {
    const allReservations = await db
        .select()
        .from(reservations)
        .orderBy(desc(reservations.createdAt));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Reservations</h1>
                <p className="text-muted-foreground">
                    Manage table bookings and requests.
                </p>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Guests</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allReservations.map((reservation) => (
                            <TableRow key={reservation.id}>
                                <TableCell>
                                    <div className="font-medium">{reservation.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {reservation.email}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {reservation.date} at {reservation.time}
                                </TableCell>
                                <TableCell>{reservation.pax}</TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${reservation.status === "confirmed"
                                                ? "bg-green-100 text-green-800"
                                                : reservation.status === "rejected"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {reservation.status}
                                    </span>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                    {reservation.notes || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    {reservation.status === "pending" && (
                                        <div className="flex justify-end gap-2">
                                            <form
                                                action={async () => {
                                                    "use server";
                                                    await updateReservationStatus(
                                                        reservation.id,
                                                        "confirmed"
                                                    );
                                                }}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    title="Confirm"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            </form>
                                            <form
                                                action={async () => {
                                                    "use server";
                                                    await updateReservationStatus(
                                                        reservation.id,
                                                        "rejected"
                                                    );
                                                }}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    title="Reject"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
