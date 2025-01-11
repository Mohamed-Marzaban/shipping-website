// src/app/dashboard/orders/page.tsx
'use client'
import { useState } from 'react'
import { Plus, Download, Trash, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import OrderTable from '@/components/dashboard/OrderTable'
import CreateOrderModal from '@/components/dashboard/CreateOderModal'
import ImportCSVButton from '@/components/dashboard/ImportCSVButton'

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  // Create new order
  const handleCreateOrder = (order: Order) => {
    const newOrder = {
      ...order,
      id: `order-${Date.now()}`,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    }
    setOrders([...orders, newOrder])
    setIsCreateModalOpen(false)
    showAlert('Order created successfully')
  }

  // Edit existing order
  const handleEdit = (order: Order) => {
    setSelectedOrder(order)
    setIsEditModalOpen(true)
  }

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(
      orders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    )
    setIsEditModalOpen(false)
    setSelectedOrder(null)
    showAlert('Order updated successfully')
  }

  // Delete order
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter((order) => order.id !== id))
      showAlert('Order deleted successfully')
    }
  }

  // Delete multiple orders
  const handleBulkDelete = async (ids: string[]) => {
    if (
      window.confirm(`Are you sure you want to delete ${ids.length} orders?`)
    ) {
      setOrders(orders.filter((order) => !ids.includes(order.id)))
      showAlert(`${ids.length} orders deleted successfully`)
    }
  }

  // Update order status
  const handleStatusChange = (id: string, status: Order['status']) => {
    setOrders(
      orders.map((order) => (order.id === id ? { ...order, status } : order))
    )
    showAlert('Order status updated successfully')
  }

  // Import orders from CSV
  const handleImport = (importedOrders: any[]) => {
    const newOrders = importedOrders.map((order) => ({
      ...order,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    }))
    setOrders([...orders, ...newOrders])
    showAlert(`${newOrders.length} orders imported successfully`)
  }

  // Export orders to CSV
  const handleExport = (selectedIds?: string[]) => {
    const ordersToExport = selectedIds
      ? orders.filter((order) => selectedIds.includes(order.id))
      : orders

    const csv = convertToCSV(ordersToExport)
    downloadCSV(csv, 'orders.csv')
  }

  // Show alert message
  const showAlert = (message: string) => {
    setAlertMessage(message)
    setTimeout(() => setAlertMessage(null), 3000)
  }

  // Helper function to convert orders to CSV
  const convertToCSV = (orders: Order[]) => {
    const headers = [
      'Customer Name',
      'Value',
      'Status',
      'Pickup Street',
      'Pickup City',
      'Pickup State',
      'Pickup ZIP',
      'Pickup Country',
      'Delivery Street',
      'Delivery City',
      'Delivery State',
      'Delivery ZIP',
      'Delivery Country',
      'Created At',
    ].join(',')

    const rows = orders.map((order) =>
      [
        order.customerName,
        order.value,
        order.status,
        order.pickupAddress.street,
        order.pickupAddress.city,
        order.pickupAddress.state,
        order.pickupAddress.zipCode,
        order.pickupAddress.country,
        order.deliveryAddress.street,
        order.deliveryAddress.city,
        order.deliveryAddress.state,
        order.deliveryAddress.zipCode,
        order.deliveryAddress.country,
        order.createdAt,
      ].join(',')
    )

    return [headers, ...rows].join('\n')
  }

  // Helper function to download CSV
  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <div className="flex gap-4">
          <ImportCSVButton onImport={handleImport} />
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Alert Message */}
      {alertMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {alertMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Table */}
      <OrderTable
        orders={orders}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onBulkDelete={handleBulkDelete}
        onExport={handleExport}
      />

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrder}
      />

      {/* Edit Order Modal */}
      <CreateOrderModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedOrder(null)
        }}
        onSubmit={handleUpdateOrder}
        initialData={selectedOrder}
      />
    </div>
  )
}
