import { Suspense } from 'react'
import HeroSection from '@/components/sections/hero-section'
import WeeklySchedule from '@/components/sections/weekly-schedule'
import LocalCommunity from '@/components/sections/local-community'
import PopularClubs from '@/components/sections/popular-clubs'
import Testimonials from '@/components/sections/testimonials'
import Newsletter from '@/components/sections/newsletter'
import PartnerLogos from '@/components/sections/partner-logos'
import {
  WeeklyScheduleSkeleton,
  LocalCommunitySkeleton,
  PopularClubsSkeleton,
} from '@/components/skeletons'
import { FadeInSection } from '@/components/animations/fade-in-section'

export default function HomePage() {
  return (
    <>
      <FadeInSection>
        <HeroSection />
      </FadeInSection>

      <FadeInSection>
        <Suspense fallback={<WeeklyScheduleSkeleton />}>
          <WeeklySchedule />
        </Suspense>
      </FadeInSection>

      <FadeInSection>
        <Suspense fallback={<LocalCommunitySkeleton />}>
          <LocalCommunity />
        </Suspense>
      </FadeInSection>

      <FadeInSection>
        <Suspense fallback={<PopularClubsSkeleton />}>
          <PopularClubs />
        </Suspense>
      </FadeInSection>

      <FadeInSection>
        <Testimonials />
        <Newsletter />
        <PartnerLogos />
      </FadeInSection>
    </>
  )
}
