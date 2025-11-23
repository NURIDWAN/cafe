import Image from "next/image";

export default function OurStory() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">
                            Crafted with Passion
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Founded in 2024, Cafe Aesthetica began with a simple mission: to
                            create a sanctuary where coffee culture meets modern design. We
                            believe that every cup tells a story, from the ethically sourced
                            beans to the precise pour.
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Our pastries are baked fresh daily, using traditional French
                            techniques with a modern twist. Whether you're here for a morning
                            espresso or a leisurely afternoon tea, we invite you to slow down
                            and savor the moment.
                        </p>
                    </div>
                    <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop"
                            alt="Barista pouring coffee"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
