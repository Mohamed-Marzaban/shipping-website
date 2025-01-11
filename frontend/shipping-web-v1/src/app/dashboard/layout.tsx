import DashboardHeader from '@/components/dashboard/DashboardHeader'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardFooter from '@/components/dashboard/DashboardFooter'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <DashboardHeader />
        <main className="min-h-[calc(100vh-128px)] p-8">{children}</main>
        <DashboardFooter />
      </div>
    </div>
  )
}
