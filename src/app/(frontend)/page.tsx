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

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <Suspense fallback={<WeeklyScheduleSkeleton />}>
        <WeeklySchedule />
      </Suspense>

      <Suspense fallback={<LocalCommunitySkeleton />}>
        <LocalCommunity />
      </Suspense>

      <Suspense fallback={<PopularClubsSkeleton />}>
        <PopularClubs />
      </Suspense>

      <Testimonials />
      <Newsletter />
      <PartnerLogos />
    </>
  )
}
