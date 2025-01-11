import { Truck, Clock, Shield, Globe } from 'lucide-react'

const features = [
  {
    name: 'Real-time Tracking',
    description:
      'Track your shipments in real-time with our advanced QR code system',
    icon: Clock,
  },
  {
    name: 'Route Optimization',
    description: 'Efficient delivery routes powered by advanced algorithms',
    icon: Truck,
  },
  {
    name: 'Secure Platform',
    description: 'End-to-end encryption and comprehensive security measures',
    icon: Shield,
  },
  {
    name: 'Global Coverage',
    description: 'Ship anywhere with our worldwide network of carriers',
    icon: Globe,
  },
]

export default function Features() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Efficient Shipping
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your shipments
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-blue-600" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
