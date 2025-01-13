// src/lib/types/organization.ts
export interface Organization {
  id: string
  name: string
  email: string
  address: string
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise'
    status: 'active' | 'inactive'
    expiresAt: Date
  }
  settings: {
    theme: 'light' | 'dark'
    notifications: boolean
    timezone: string
  }
}

export interface OrganizationStats {
  totalShipments: number
  activeCouriers: number
  monthlyRevenue: number
  pendingDeliveries: number
}
