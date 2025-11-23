import { TestimonialForm } from "@/components/admin/testimonial-form";
import { getTestimonialById } from "@/app/actions/testimonials";
import { notFound } from "next/navigation";

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
    const testimonial = await getTestimonialById(params.id);

    if (!testimonial) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Edit Testimonial</h1>
                <p className="text-muted-foreground">
                    Update testimonial details for {testimonial.name}.
                </p>
            </div>

            <TestimonialForm testimonial={testimonial} />
        </div>
    );
}