import { ReservationForm } from "@/components/reservation/reservation-form";

export const metadata = {
    title: "Reservation | Cafe Aesthetica",
    description: "Book a table for an unforgettable dining experience.",
};

export default function ReservationPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary py-16 text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                        Book a Table
                    </h1>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto">
                        Reserve your spot and let us take care of the rest.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                <div className="max-w-3xl mx-auto">
                    <ReservationForm />
                </div>
            </div>
        </div>
    );
}
