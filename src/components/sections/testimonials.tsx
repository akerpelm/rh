import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const TESTIMONIALS = [
  {
    name: 'Sarah J.',
    club: 'Brooklyn Road Runners',
    text: "NYC Running Hub helped me find my running community after moving to the city. I've made incredible friends and improved my running.",
  },
  {
    name: 'Michael T.',
    club: 'Harlem Run',
    text: 'The event calendar keeps me informed of all the best races and group runs. I never miss a chance to run with fellow NYC runners now.',
  },
  {
    name: 'Jessica L.',
    club: 'Queens Distance Runners',
    text: 'As a run club leader, this platform has helped us grow our community and connect with runners we would never have reached otherwise.',
  },
]

export default function Testimonials() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">What Runners Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, i) => (
            <Card key={i} className="relative">
              <CardContent className="p-8">
                <div className="absolute -top-6 left-8">
                  <Avatar className="h-12 w-12 border-4 border-background">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {testimonial.name.split(' ')[0][0]}
                      {testimonial.name.split(' ')[1][0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="pt-6">
                  <p className="italic mb-4">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.club}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
