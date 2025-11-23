import { Star } from "lucide-react";
import { getActiveTestimonials } from "@/app/actions/testimonials";
import Image from "next/image";

export default async function Testimonials() {
    const testimonials = await getActiveTestimonials();

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                        What They Say
                    </h2>
                </div>

                {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="bg-secondary/10 p-8 rounded-2xl border border-border"
                            >
                                <div className="flex gap-1 mb-4 text-primary">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-current" />
                                    ))}
                                </div>
                                <p className="text-lg text-foreground mb-6 italic">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center gap-3">
                                    {testimonial.imageUrl && (
                                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-secondary/20">
                                            <Image
                                                src={testimonial.imageUrl}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-primary">{testimonial.name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.role}
                                            {testimonial.company && ` • ${testimonial.company}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground text-lg">
                            No testimonials yet. Check back soon for customer reviews!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
