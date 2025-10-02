'use client'

import { Badge } from '@/components/ui/badge'

interface LeadTagsProps {
  tags: string[]
  maxVisible?: number
}

export function LeadTags({ tags, maxVisible = 3 }: LeadTagsProps) {
  if (!tags || tags.length === 0) {
    return null
  }

  const visibleTags = tags.slice(0, maxVisible)
  const remainingCount = tags.length - maxVisible

  const getTagColor = (tag: string) => {
    if (tag.includes('vestido')) return 'bg-pink-100 text-pink-800'
    if (tag.includes('blazer')) return 'bg-blue-100 text-blue-800'
    if (tag.includes('camisa')) return 'bg-green-100 text-green-800'
    if (tag.includes('pantalon')) return 'bg-purple-100 text-purple-800'
    if (tag.includes('falda')) return 'bg-yellow-100 text-yellow-800'
    if (tag.includes('consulta-')) return 'bg-orange-100 text-orange-800'
    if (tag.includes('con-')) return 'bg-indigo-100 text-indigo-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="flex flex-wrap gap-1">
      {visibleTags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className={`text-xs ${getTagColor(tag)}`}
        >
          {tag}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remainingCount}
        </Badge>
      )}
    </div>
  )
}
