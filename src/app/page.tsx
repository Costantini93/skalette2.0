import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import MenuPreview from '@/components/sections/MenuPreview'
import About from '@/components/sections/About'
import Gallery from '@/components/sections/Gallery'
import Testimonials from '@/components/sections/Testimonials'
import ReservationAdvanced from '@/components/sections/ReservationAdvanced'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <MenuPreview />
      <About />
      <Gallery />
      <Testimonials />
      <ReservationAdvanced />
    </>
  )
}
