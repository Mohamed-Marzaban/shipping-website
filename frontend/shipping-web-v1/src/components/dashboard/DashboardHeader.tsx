'use client'
import { Bell } from 'lucide-react'
import Link from 'next/link'

export default function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            ShipStream
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
            <Bell className="h-6 w-6" />
          </button>
          <div className="relative">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                John Doe
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
