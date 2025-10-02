'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  User, 
  Tag, 
  Edit, 
  Trash2, 
  AlertCircle,
  Clock
} from 'lucide-react'
import { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
  priorityColor: string
  priorityLabel: string
  isDragging?: boolean
}

export function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  priorityColor, 
  priorityLabel,
  isDragging = false 
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: task.id
  })

  console.log('🃏 TaskCard rendered:', task.id, 'isSortableDragging:', isSortableDragging)
  console.log('🃏 TaskCard listeners:', listeners)
  console.log('🃏 TaskCard attributes:', attributes)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        border bg-white cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow py-1 rounded-lg shadow-sm
        ${isDragging || isSortableDragging ? 'opacity-50 shadow-lg scale-105' : 'hover:shadow-md'}
        ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
      `}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        console.log('🖱️ TaskCard clicked:', task.id)
        e.stopPropagation()
      }}
      onPointerDown={(e) => {
        console.log('🖱️ TaskCard pointer down:', task.id)
        e.stopPropagation()
      }}
    >
      <div className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 select-none">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                  {task.title}
                </h3>
                <div className={`w-2 h-2 rounded-full ${
                  task.status === 'todo' ? 'bg-gray-400' : 
                  task.status === 'in_progress' ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`} />
              </div>
            </div>
            <div className="flex items-center space-x-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  onEdit()
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="h-6 w-6 p-0 hover:bg-gray-100"
                style={{ touchAction: 'manipulation' }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  onDelete()
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="h-6 w-6 p-0 hover:bg-red-100 text-red-600 hover:text-red-700"
                style={{ touchAction: 'manipulation' }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Priority Badge */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`text-xs ${priorityColor}`}
            >
              {priorityLabel}
            </Badge>
            {isOverdue && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span className="text-xs font-medium">Vencida</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  <Tag className="h-2 w-2 mr-1" />
                  {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{task.tags.length - 3} más
                </span>
              )}
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progreso</span>
              <span className="font-medium">
                {task.status === 'todo' ? '0%' : task.status === 'in_progress' ? '50%' : '100%'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  task.status === 'todo' ? 'bg-gray-400' : 
                  task.status === 'in_progress' ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ 
                  width: task.status === 'todo' ? '0%' : 
                         task.status === 'in_progress' ? '50%' : 
                         '100%' 
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              {task.dueDate && (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              )}
              {task.assignedTo && (
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  <span className="font-medium text-blue-600">{task.assignedTo}</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
