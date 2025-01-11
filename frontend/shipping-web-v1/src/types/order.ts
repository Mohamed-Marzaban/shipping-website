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
  value: number // Explicitly defined as number
  pickupAddress: Address
  deliveryAddress: Address
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt?: string
}
