import { TestimonialForm } from "@/components/admin/testimonial-form";

export default function NewTestimonialPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">New Testimonial</h1>
                <p className="text-muted-foreground">
                    Add a new customer testimonial to showcase on your website.
                </p>
            </div>

            <TestimonialForm />
        </div>
    );
}