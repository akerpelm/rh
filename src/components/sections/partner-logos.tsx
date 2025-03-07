import Image from 'next/image'

// You might want to create a collection for partners in Payload CMS
const TEMP_PARTNERS = [
  { name: 'Partner 1', logo: '/placeholder.png' },
  { name: 'Partner 2', logo: '/placeholder.png' },
  { name: 'Partner 3', logo: '/placeholder.png' },
  { name: 'Partner 4', logo: '/placeholder.png' },
  { name: 'Partner 5', logo: '/placeholder.png' },
]

export default function PartnerLogos() {
  return (
    <section className="py-12 border-t">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-lg font-medium text-muted-foreground mb-8">
          Trusted by NYC's Running Community
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {TEMP_PARTNERS.map((partner, i) => (
            <div key={i} className="h-12 w-24 bg-muted/50 rounded relative">
              {/* Uncomment when you have actual partner logos */}
              {/* <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain"
              /> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
