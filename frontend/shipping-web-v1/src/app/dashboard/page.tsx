import {
  Package,
  Truck,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
} from 'lucide-react'

const stats = [
  {
    name: 'Total Orders',
    value: '2,651',
    change: '+12.5%',
    changeType: 'positive',
    icon: Package,
  },
  {
    name: 'Active Deliveries',
    value: '156',
    change: '+5.2%',
    changeType: 'positive',
    icon: Truck,
  },
  {
    name: 'Total Customers',
    value: '891',
    change: '+3.1%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Revenue',
    value: '$45,621',
    change: '+8.3%',
    changeType: 'positive',
    icon: DollarSign,
  },
]

const recentActivity = [
  {
    id: 1,
    content: 'New order #1234 from John Doe',
    timestamp: '5 minutes ago',
  },
  {
    id: 2,
    content: 'Order #1231 delivered successfully',
    timestamp: '1 hour ago',
  },
  {
    id: 3,
    content: 'New customer registration - Jane Smith',
    timestamp: '2 hours ago',
  },
]

export default function DashboardPage() {
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div
                className={`inline-flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                <TrendingUp className="mr-1 h-4 w-4" />
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-base font-semibold text-gray-900">
              Recent Activity
            </h2>
            <div className="mt-6">
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivity.length - 1 && (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <Clock className="h-5 w-5 text-gray-500" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.content}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            {activity.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
