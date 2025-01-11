'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function TrackingSection() {
  const [trackingNumber, setTrackingNumber] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle tracking logic here
    console.log('Tracking number:', trackingNumber)
  }

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Track Your Shipment
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Enter your tracking number to get real-time updates on your package
            location
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl">
          <div className="flex gap-x-4">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="min-w-0 flex-1 rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
            />
            <Button type="submit" className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Track
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
