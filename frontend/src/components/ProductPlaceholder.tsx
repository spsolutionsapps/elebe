import { Package } from 'lucide-react'

interface ProductPlaceholderProps {
  className?: string
}

export default function ProductPlaceholder({ className = "w-full h-full" }: ProductPlaceholderProps) {
  return (
    <div className={`${className} bg-gray-100 flex items-center justify-center rounded-md`}>
      <Package className="h-8 w-8 text-gray-400" />
    </div>
  )
}
