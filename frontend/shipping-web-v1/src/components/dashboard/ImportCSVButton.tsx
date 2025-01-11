import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Papa from 'papaparse'

interface ImportCSVButtonProps {
  onImport: (orders: any[]) => void
}

export default function ImportCSVButton({ onImport }: ImportCSVButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const orders = results.data.map((order: any) => ({
            ...order,
            id: Date.now().toString(),
            status: 'pending',
          }))
          onImport(orders)
        },
      })
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".csv"
        onChange={handleFileUpload}
      />
      <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" />
        Import CSV
      </Button>
    </>
  )
}
