import { Box, Package, Truck, Plane } from 'lucide-react'

const services = [
  {
    title: 'Ground Shipping',
    description:
      'Reliable and cost-effective ground transportation for your packages',
    icon: Truck,
    color: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  {
    title: 'Air Freight',
    description:
      'Fast and efficient air shipping for time-sensitive deliveries',
    icon: Plane,
    color: 'bg-green-100',
    textColor: 'text-green-600',
  },
  {
    title: 'Express Delivery',
    description: 'Same-day and next-day delivery options for urgent shipments',
    icon: Package,
    color: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  {
    title: 'Warehousing',
    description: 'Secure storage solutions with inventory management',
    icon: Box,
    color: 'bg-orange-100',
    textColor: 'text-orange-600',
  },
]

export default function ServicesSection() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Shipping Services
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose from our range of shipping solutions tailored to your needs
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mt-24 lg:max-w-none lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200"
            >
              <div className={`inline-flex rounded-lg p-3 ${service.color}`}>
                <service.icon className={`h-6 w-6 ${service.textColor}`} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {service.title}
              </h3>
              <p className="mt-2 text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
