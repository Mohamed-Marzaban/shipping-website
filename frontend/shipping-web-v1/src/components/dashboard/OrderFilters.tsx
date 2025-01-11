'use client'
import React, { useState } from 'react'
interface OrderFiltersProps {
  onFilterChange: (filters: OrderFilters) => void
  onSearch: (query: string) => void
}

interface OrderFilters {
  status?: string
  dateRange?: {
    start: Date | null
    end: Date | null
  }
}

export default function OrderFilters({
  onFilterChange,
  onSearch,
}: OrderFiltersProps) {
  const [filters, setFilters] = useState<OrderFilters>({})
  const [searchQuery, setSearchQuery] = useState('')

  const handleFilterChange = (newFilters: Partial<OrderFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Search
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search orders..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange({ status: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
    </div>
  )
}
