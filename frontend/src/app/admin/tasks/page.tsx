'use client'

import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, useDroppable, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor, KeyboardSensor, rectIntersection } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, User, Tag, AlertCircle } from 'lucide-react'
import { Task } from '@/types'
import { TaskCard } from '@/components/TaskCard'
import { TaskModal } from '@/components/TaskModal'
import { ConfirmModal } from '@/components/ConfirmModal'
import { useToast } from '@/hooks/useToast'
import { useModal } from '@/hooks/useModal'
import { getApiUrl } from '@/lib/config'

const COLUMNS = [
  { 
    id: 'todo', 
    title: 'Por Hacer', 
    color: 'bg-gray-500',
    textColor: 'text-white',
    badgeColor: 'bg-white text-gray-500'
  },
  { 
    id: 'in_progress', 
    title: 'En Progreso', 
    color: 'bg-yellow-500',
    textColor: 'text-white',
    badgeColor: 'bg-white text-yellow-500'
  },
  { 
    id: 'done', 
    title: 'Completado', 
    color: 'bg-[rgb(0,146,54)]',
    textColor: 'text-white',
    badgeColor: 'bg-white text-[rgb(0,146,54)]'
  },
]

// Componente para las columnas droppable
function DroppableColumn({ 
  column, 
  tasks, 
  onEdit, 
  onDelete, 
  getPriorityColor, 
  getPriorityLabel
}: {
  column: typeof COLUMNS[0]
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  getPriorityColor: (priority: string) => string
  getPriorityLabel: (priority: string) => string
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  
  useEffect(() => {
    return () => {
    }
  }, [column.id])

  return (
    <div 
      key={column.id} 
      ref={setNodeRef}
      className={`flex flex-col gap-6 rounded-xl border-none py-6 bg-transparent transition-all duration-200 min-h-[500px] ${
        isOver ? 'bg-blue-50 border-2 border-dashed border-blue-300 scale-105' : ''
      }`}
      data-column-id={column.id}
      data-droppable-id={column.id}
    >
      <div className="px-6">
        <div className={`flex items-center justify-between ${column.color} ${column.textColor} px-4 py-3 rounded-lg`}>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{column.title}</span>
            <span className="text-sm opacity-90">
              {tasks.length === 0 ? 
                (column.id === 'todo' ? 'Sin tareas pendientes' : 
                 column.id === 'in_progress' ? 'Sin tareas en progreso' : 
                 'Sin tareas completadas') :
               tasks.length === 1 ? 
                (column.id === 'todo' ? '1 tarea pendiente' : 
                 column.id === 'in_progress' ? '1 tarea en progreso' : 
                 '1 tarea completada') :
               (column.id === 'todo' ? `${tasks.length} tareas pendientes` : 
                column.id === 'in_progress' ? `${tasks.length} tareas en progreso` : 
                `${tasks.length} tareas completadas`)
              }
            </span>
          </div>
          <span className={`${column.badgeColor} w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold`}>
            {tasks.length}
          </span>
        </div>
      </div>
      <div className="px-6 bg-transparent">
        <SortableContext
          items={tasks.map(task => {
            return task.id
          })}
          strategy={verticalListSortingStrategy}
        >
          <div className={`space-y-3 min-h-[400px] p-4 rounded-lg transition-all duration-200 ${
            isOver ? 'bg-blue-50 border-2 border-blue-300' : 'border-2 border-transparent'
          }`}>
            {tasks.length === 0 ? (
              <div className={`flex items-center justify-center h-32 text-gray-400 text-sm border-2 border-dashed rounded-lg transition-colors ${
                isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}>
                {isOver ? 'Suelta la tarea aquí' : 'Arrastra tareas aquí'}
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => onEdit(task)}
                  onDelete={() => onDelete(task.id)}
                  priorityColor={getPriorityColor(task.priority)}
                  priorityLabel={getPriorityLabel(task.priority)}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default function TasksPage() {
  const { showSuccess, showError } = useToast()
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useModal()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isMovingTask, setIsMovingTask] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch(getApiUrl('/tasks'))
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      showError('Error al cargar las tareas')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      // El backend calcula automáticamente el order, no lo enviamos desde el frontend
      const cleanTaskData = {
        title: taskData.title,
        description: taskData.description || null,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        assignedTo: taskData.assignedTo || null,
        clientId: taskData.clientId || null,
        inquiryId: taskData.inquiryId || null,
        tags: taskData.tags || []
      }
      
      
      const response = await fetch(getApiUrl('/tasks'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanTaskData),
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks(prevTasks => [...prevTasks, newTask])
        showSuccess('Tarea creada exitosamente')
        setShowTaskModal(false)
      } else {
        const errorText = await response.text()
        showError(`Error al crear la tarea: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Error creating task:', error)
      showError('Error al crear la tarea')
    }
  }


  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!selectedTask) return

    try {
      const response = await fetch(getApiUrl(`/tasks/${selectedTask.id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === selectedTask.id ? updatedTask : task
          )
        )
        showSuccess('Tarea actualizada exitosamente')
        setShowTaskModal(false)
        setSelectedTask(null)
      } else {
        showError('Error al actualizar la tarea')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      showError('Error al actualizar la tarea')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    const confirmed = await showConfirm({
      title: 'Eliminar Tarea',
      message: '¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'danger'
    })

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(getApiUrl(`/tasks/${taskId}`), {
        method: 'DELETE',
      })

      if (response.ok) {
        showSuccess('Tarea eliminada exitosamente')
        fetchTasks()
      } else {
        showError('Error al eliminar la tarea')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      showError('Error al eliminar la tarea')
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) {
      return
    }

    const taskId = active.id as string
    const overId = over.id as string

    // Si se está soltando sobre la misma tarea, no hacer nada
    if (overId === taskId) {
      return
    }

    // Determinar el nuevo status basado en el over.id
    let newStatus: string
    
    // Verificar si se soltó directamente en una columna
    if (overId === 'todo' || overId === 'in_progress' || overId === 'done') {
      newStatus = overId
    } else {
      // Si se soltó sobre otra tarea, usar el status de esa tarea
      const overTask = tasks.find(t => t.id === overId)
      if (!overTask) {
        // Intentar encontrar la columna padre
        const parentElement = over.data.current?.droppableContainer
        if (parentElement && parentElement.id) {
          newStatus = parentElement.id
        } else {
          return
        }
      } else {
        newStatus = overTask.status
      }
    }

    // Encontrar la tarea actual
    const task = tasks.find(t => t.id === taskId)
    if (!task) {
      return
    }

    // Si la tarea ya está en la misma columna, no hacer nada
    if (task.status === newStatus) {
      return
    }

    // Obtener el nuevo orden (al final de la columna)
    const tasksInNewColumn = tasks.filter(t => t.status === newStatus)
    const newOrder = tasksInNewColumn.length


    setIsMovingTask(true)
    try {
      const response = await fetch(getApiUrl('/tasks/order/update'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          newStatus,
          newOrder,
        }),
      })

      if (response.ok) {
        const updatedTasks = await response.json()
        setTasks(updatedTasks)
        showSuccess('Tarea movida exitosamente')
      } else {
        const errorText = await response.text()
        showError('Error al mover la tarea')
      }
    } catch (error) {
      console.error('Error moving task:', error)
      showError('Error al mover la tarea')
    } finally {
      setIsMovingTask(false)
    }
  }

  const getTasksByStatus = (status: string) => {
    const filteredTasks = tasks.filter(task => task.status === status)
    return filteredTasks.sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgente'
      case 'high':
        return 'Alta'
      case 'medium':
        return 'Media'
      case 'low':
        return 'Baja'
      default:
        return 'Media'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tareas</h1>
          <p className="text-gray-600">Gestiona tus tareas con el sistema Kanban</p>
        </div>
        <Button
          onClick={() => setShowTaskModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          style={{
            backgroundColor: '#2563eb',
            borderColor: '#2563eb'
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(() => {
            return null
          })()}
          {COLUMNS.map((column, index) => {
            const columnTasks = getTasksByStatus(column.id)
            
            return (
              <DroppableColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onEdit={(task) => {
                  setSelectedTask(task)
                  setShowTaskModal(true)
                }}
                onDelete={handleDeleteTask}
                getPriorityColor={getPriorityColor}
                getPriorityLabel={getPriorityLabel}
              />
            )
          })}
        </div>
        
        {isMovingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Moviendo tarea...</span>
            </div>
          </div>
        )}

        <DragOverlay>
          {activeTask ? (
            <div className="transform rotate-3 scale-105 shadow-2xl">
              <TaskCard
                task={activeTask}
                isDragging={true}
                priorityColor={getPriorityColor(activeTask.priority)}
                priorityLabel={getPriorityLabel(activeTask.priority)}
                onEdit={() => {
                  setSelectedTask(activeTask)
                  setShowTaskModal(true)
                }}
                onDelete={() => handleDeleteTask(activeTask.id)}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        onSave={selectedTask ? handleUpdateTask : handleCreateTask}
      />
    </div>
  )
}
