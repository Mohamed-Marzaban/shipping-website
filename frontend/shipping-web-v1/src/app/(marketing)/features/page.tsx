import Features from '@/components/home/Features'

export default function FeaturesPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your shipments
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform provides comprehensive shipping solutions for
            businesses of all sizes.
          </p>
        </div>
        {/* Add features here */}
      </div>
    </div>
  )
}
