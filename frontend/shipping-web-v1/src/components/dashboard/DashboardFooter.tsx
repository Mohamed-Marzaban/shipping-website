export default function DashboardFooter() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} ShipStream. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
