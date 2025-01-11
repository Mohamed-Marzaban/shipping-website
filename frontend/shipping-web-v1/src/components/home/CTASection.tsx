import { Button } from '@/components/ui/Button'

export default function CTASection() {
  return (
    <section className="bg-blue-600">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to streamline your shipping?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-blue-100">
            Join thousands of businesses that trust us with their shipping
            needs. Get started today and experience the difference.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Get started
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="bg-blue-600 text-white border-white hover:bg-blue-700"
            >
              Contact sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
