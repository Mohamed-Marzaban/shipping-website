import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import TrackingSection from '@/components/home/TrackingSection'
import ServicesSection from '@/components/home/ServicesSection'
import CTASection from '@/components/home/CTASection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <TrackingSection />
      <ServicesSection />
      <CTASection />
    </main>
  )
}
