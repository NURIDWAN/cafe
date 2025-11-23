import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Image Placeholder - In production use next/image with a real image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Savor the Moment
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Experience the perfect blend of artisanal coffee and exquisite pastries
          in a space designed for tranquility and inspiration.
        </p>
        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link href="/menu">
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              View Menu
            </Button>
          </Link>
          <Link href="/reservation">
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
              Book a Table
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
