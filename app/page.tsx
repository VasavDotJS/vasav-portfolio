import { Hero } from '@/components/hero/Hero'
import { IndexSection } from '@/components/index/IndexSection'
import { StackSection } from '@/components/stack/StackSection'
import { Desktop } from '@/components/work/Desktop'
import { WorkSection } from '@/components/work/WorkSection'
import { ContactSection } from '@/components/contact/ContactSection'

// GitHub "last push" data in the footer refreshes every 6 hours
export const revalidate = 21600

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <IndexSection />
      <WorkSection />
      <Desktop />
      <StackSection />
      <ContactSection />
    </main>
  )
}
