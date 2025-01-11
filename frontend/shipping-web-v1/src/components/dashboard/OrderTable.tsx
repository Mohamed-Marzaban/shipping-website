'use client'
import { useState, useMemo } from 'react'
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Search,
  Plus,
  X,
  Calendar,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Order {
  id: string
  customerName: string
  value: number
  pickupAddress: Address
  deliveryAddress: Address
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt?: string
}

interface OrderFilters {
  status?: string
  dateRange?: {
    start: Date | null
    end: Date | null
  }
}

const ITEMS_PER_PAGE = 10

export default function OrderTable() {
  // Main state
  const [orders, setOrders] = useState<Order[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Table state
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<OrderFilters>({})
  const [sortField, setSortField] = useState<keyof Order>('customerName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Form state for new/edit order
  const [formData, setFormData] = useState<Omit<Order, 'id'>>({
    customerName: '',
    value: 0,
    pickupAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    status: 'pending',
  })

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Search filter
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
          order.customerName.toLowerCase().includes(searchLower) ||
          order.id?.toLowerCase().includes(searchLower) ||
          order.pickupAddress.city.toLowerCase().includes(searchLower) ||
          order.deliveryAddress.city.toLowerCase().includes(searchLower)

        // Status filter
        const matchesStatus = !filters.status || order.status === filters.status

        // Date filter
        const matchesDate =
          !filters.dateRange?.start ||
          !filters.dateRange?.end ||
          (order.createdAt &&
            new Date(order.createdAt) >= filters.dateRange.start &&
            new Date(order.createdAt) <= filters.dateRange.end)

        return matchesSearch && matchesStatus && matchesDate
      })
      .sort((a, b) => {
        if (sortField === 'value') {
          return sortDirection === 'asc' ? a.value - b.value : b.value - a.value
        }

        const aValue = String(a[sortField]).toLowerCase()
        const bValue = String(b[sortField]).toLowerCase()

        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      })
  }, [orders, searchQuery, filters, sortField, sortDirection])

  // Paginate orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredOrders, currentPage])

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)

  // Event handlers
  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const toggleRowExpansion = (orderId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(orderId)) {
      newExpandedRows.delete(orderId)
    } else {
      newExpandedRows.add(orderId)
    }
    setExpandedRows(newExpandedRows)
  }

  const handleCreateOrder = () => {
    const newOrder = {
      ...formData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setOrders([...orders, newOrder])
    setIsModalOpen(false)
    resetForm()
  }

  const handleUpdateOrder = () => {
    if (!selectedOrder) return

    setOrders(
      orders.map((order) =>
        order.id === selectedOrder.id
          ? { ...formData, id: selectedOrder.id }
          : order
      )
    )
    setIsModalOpen(false)
    setSelectedOrder(null)
    resetForm()
  }

  const handleStatusChange = (id: string, status: Order['status']) => {
    setOrders(
      orders.map((order) => (order.id === id ? { ...order, status } : order))
    )
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter((order) => order.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      customerName: '',
      value: 0,
      pickupAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      deliveryAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      status: 'pending',
    })
  }

  // Utility functions
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatAddress = (address: Address) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`
  }

  // Render helper components
  const AddressFields = ({
    type,
    address,
    onChange,
  }: {
    type: 'pickup' | 'delivery'
    address: Address
    onChange: (field: keyof Address, value: string) => void
  }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        {type === 'pickup' ? 'Pickup' : 'Delivery'} Address
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Street
          </label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => onChange('street', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => onChange('city', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => onChange('state', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ZIP Code
          </label>
          <input
            type="text"
            value={address.zipCode}
            onChange={(e) => onChange('zipCode', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            value={address.country}
            onChange={(e) => onChange('country', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )

  // Main render
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Orders
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all orders including customer details and shipping
            information.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 mb-4 grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border border-gray-300 pl-10 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-12 px-3 py-3.5">
                      <span className="sr-only">Expand</span>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('customerName')}
                    >
                      <div className="group inline-flex">
                        Customer
                        <span className="ml-2 flex-none rounded text-gray-400">
                          {sortField === 'customerName' ? (
                            sortDirection === 'asc' ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronUp className="h-4 w-4" />
                            )
                          ) : null}
                        </span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('value')}
                    >
                      <div className="group inline-flex">
                        Value
                        <span className="ml-2 flex-none rounded text-gray-400">
                          {sortField === 'value' ? (
                            sortDirection === 'asc' ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronUp className="h-4 w-4" />
                            )
                          ) : null}
                        </span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedOrders.map((order) => (
                    <>
                      <tr key={order.id}>
                        <td className="relative px-3 py-4">
                          <button
                            onClick={() => toggleRowExpansion(order.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {expandedRows.has(order.id) ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          ${order.value.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value as Order['status']
                              )
                            }
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveDropdown(
                                  activeDropdown === order.id ? null : order.id
                                )
                              }
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                            {activeDropdown === order.id && (
                              <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order)
                                    setFormData({ ...order })
                                    setIsModalOpen(true)
                                    setActiveDropdown(null)
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(order.id)
                                    setActiveDropdown(null)
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedRows.has(order.id) && (
                        <tr>
                          <td colSpan={5} className="px-3 py-4 bg-gray-50">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  Pickup Address
                                </h4>
                                <p className="mt-1 text-sm text-gray-500">
                                  {formatAddress(order.pickupAddress)}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  Delivery Address
                                </h4>
                                <p className="mt-1 text-sm text-gray-500">
                                  {formatAddress(order.deliveryAddress)}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="secondary"
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)}
              </span>{' '}
              of <span className="font-medium">{filteredOrders.length}</span>{' '}
              results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="secondary"
                className="rounded-l-md"
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  variant={currentPage === index + 1 ? 'primary' : 'secondary'}
                  className={`${
                    currentPage === index + 1
                      ? 'z-10 bg-blue-600 text-white focus-visible:outline-blue-600'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="secondary"
                className="rounded-r-md"
              >
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="inline-block w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-8 text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setSelectedOrder(null)
                    resetForm()
                  }}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  selectedOrder ? handleUpdateOrder() : handleCreateOrder()
                }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedOrder ? 'Edit Order' : 'Create New Order'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Value
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          value: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <AddressFields
                  type="pickup"
                  address={formData.pickupAddress}
                  onChange={(field, value) =>
                    setFormData({
                      ...formData,
                      pickupAddress: {
                        ...formData.pickupAddress,
                        [field]: value,
                      },
                    })
                  }
                />

                <AddressFields
                  type="delivery"
                  address={formData.deliveryAddress}
                  onChange={(field, value) =>
                    setFormData({
                      ...formData,
                      deliveryAddress: {
                        ...formData.deliveryAddress,
                        [field]: value,
                      },
                    })
                  }
                />

                <div className="mt-6 flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsModalOpen(false)
                      setSelectedOrder(null)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedOrder ? 'Update Order' : 'Create Order'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
