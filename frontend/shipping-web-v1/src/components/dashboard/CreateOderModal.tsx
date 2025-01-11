'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Order {
  id?: string
  customerName: string
  value: number
  pickupAddress: Address
  deliveryAddress: Address
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt?: string
}

interface CreateOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (order: Order) => void
  initialData?: Order | null
}

const emptyAddress: Address = {
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
}

const emptyOrder: Order = {
  customerName: '',
  value: 0,
  pickupAddress: { ...emptyAddress },
  deliveryAddress: { ...emptyAddress },
  status: 'pending',
}

export default function CreateOrderModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CreateOrderModalProps) {
  const [formData, setFormData] = useState<Order>({
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
  const [errors, setErrors] = useState<Partial<Record<keyof Order, string>>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData(emptyOrder)
    }
  }, [initialData, isOpen])

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Order, string>> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required'
    }

    if (formData.value <= 0) {
      newErrors.value = 'Value must be greater than 0'
    }

    // Validate addresses
    const validateAddress = (address: Address, prefix: string) => {
      if (!address.street.trim())
        newErrors[`${prefix}Street`] = 'Street is required'
      if (!address.city.trim()) newErrors[`${prefix}City`] = 'City is required'
      if (!address.state.trim())
        newErrors[`${prefix}State`] = 'State is required'
      if (!address.zipCode.trim())
        newErrors[`${prefix}ZipCode`] = 'ZIP code is required'
      if (!address.country.trim())
        newErrors[`${prefix}Country`] = 'Country is required'
    }

    validateAddress(formData.pickupAddress, 'pickup')
    validateAddress(formData.deliveryAddress, 'delivery')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      onClose()
    }
  }

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
          {errors[`${type}Street`] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[`${type}Street`]}
            </p>
          )}
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
          {errors[`${type}City`] && (
            <p className="mt-1 text-sm text-red-600">{errors[`${type}City`]}</p>
          )}
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
          {errors[`${type}State`] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[`${type}State`]}
            </p>
          )}
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
          {errors[`${type}ZipCode`] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[`${type}ZipCode`]}
            </p>
          )}
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
          {errors[`${type}Country`] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[`${type}Country`]}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="inline-block w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-8 text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {initialData ? 'Edit Order' : 'Create New Order'}
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
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.customerName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Value
                </label>
                <input
                  type="number"
                  value={formData.value.toString()} // Convert to string
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      value:
                        e.target.value === '' ? 0 : parseFloat(e.target.value),
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
                  pickupAddress: { ...formData.pickupAddress, [field]: value },
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
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? 'Update Order' : 'Create Order'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
