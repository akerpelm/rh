import Link from 'next/link'
import { Calendar, MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function HeroSection() {
  return (
    <div>
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        </div>

        <div className="relative z-10 text-center max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Unite with NYC's Running Community
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover clubs, events, and resources tailored for every runner.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/run-clubs">
                <MapPin className="w-5 h-5" />
                Find a Run Club
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/events">
                <Calendar className="w-5 h-5" />
                Explore Events
              </Link>
            </Button>
          </div>

          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for clubs, events, or stores..."
              className="pl-10 py-6 rounded-full"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
