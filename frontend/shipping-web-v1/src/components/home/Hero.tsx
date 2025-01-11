import { Button } from '../ui/Button'

export default function Hero() {
  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Modern Shipping Solutions for Your Business
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Streamline your shipping operations with our comprehensive platform.
            Real-time tracking, route optimization, and seamless integration.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
