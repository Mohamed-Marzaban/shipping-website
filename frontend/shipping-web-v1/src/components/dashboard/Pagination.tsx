import { Button } from '../ui/Button'
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="secondary"
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="secondary"
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="secondary"
              className="rounded-l-md"
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                onClick={() => onPageChange(index + 1)}
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
              onClick={() => onPageChange(currentPage + 1)}
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
  )
}
