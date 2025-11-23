import { ContactForm } from "@/components/contact/contact-form";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
    title: "Contact | Cafe Aesthetica",
    description: "Get in touch with us. Drop by for a coffee or send us a message.",
};

export default function ContactPage() {
    const contactInfo = [
        {
            icon: MapPin,
            label: "Address",
            value: "123 Coffee Lane, Baristaville, CA 90210",
        },
        {
            icon: Phone,
            label: "Phone",
            value: "(555) 123-4567",
        },
        {
            icon: Mail,
            label: "The Café",
            value: "hello@thecafee.com",
        },
        {
            icon: Clock,
            label: "Opening Hours",
            value: "Mon - Fri: 7am - 6pm\nSat - Sun: 8am - 5pm",
        },
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary py-16 text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto">
                        We'd love to hear from you. Drop by for a coffee or send us a message.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="font-serif text-3xl font-bold mb-8">Our Info</h2>
                            <div className="space-y-6">
                                {contactInfo.map((info) => (
                                    <div key={info.label} className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                                            <info.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-1">{info.label}</h3>
                                            <p className="text-muted-foreground whitespace-pre-line">
                                                {info.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-secondary/20 rounded-lg h-64 flex items-center justify-center">
                            <p className="text-muted-foreground">Map Placeholder (300x300)</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h2 className="font-serif text-3xl font-bold mb-8">
                            Send a Message
                        </h2>
                        <div className="bg-card p-8 rounded-xl border shadow-md">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
