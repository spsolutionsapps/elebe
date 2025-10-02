'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Bell, Users, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CalendarProps {
  reminders: Array<{
    id: string;
    title: string;
    date: Date | string;
    time: string;
    type: 'appointment' | 'follow_up' | 'payment' | 'general';
    priority: 'low' | 'medium' | 'high';
    clientName?: string;
  }>;
  onDateClick?: (date: Date) => void;
  onReminderClick?: (reminder: any) => void;
  className?: string;
}

export function Calendar({ reminders, onDateClick, onReminderClick, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Obtener el primer día del mes y cuántos días tiene
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Crear array de días del mes
  const days = []
  
  // Días del mes anterior (para completar la primera semana)
  const prevMonth = new Date(year, month - 1, 0)
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonth.getDate() - i),
      isCurrentMonth: false,
      isToday: false
    })
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    days.push({
      date,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString()
    })
  }

  // Días del mes siguiente (para completar la última semana)
  const remainingDays = 42 - days.length // 6 semanas * 7 días
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
      isToday: false
    })
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getRemindersForDate = (date: Date) => {
    return reminders.filter(reminder => {
      const reminderDate = new Date(reminder.date)
      return reminderDate.toDateString() === date.toDateString()
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return '📅'
      case 'follow_up': return '👥'
      case 'payment': return '💰'
      default: return '🔔'
    }
  }

  return (
    <div className={cn("bg-white rounded-lg border shadow-sm", className)}>
      {/* Header del calendario */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[month]} {year}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="text-xs px-3"
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 border-b">
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
            {day}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayReminders = getRemindersForDate(day.date)
          const hasReminders = dayReminders.length > 0
          
          return (
            <div
              key={index}
              className={cn(
                "min-h-[120px] border-r border-b border-gray-100 p-2 cursor-pointer transition-all duration-200",
                !day.isCurrentMonth && "bg-gray-50 text-gray-400",
                day.isCurrentMonth && "hover:bg-blue-50 hover:shadow-sm",
                day.isToday && "bg-blue-50 border-blue-200",
                day.isCurrentMonth && "group"
              )}
              onClick={() => onDateClick?.(day.date)}
              title={day.isCurrentMonth ? `Click para crear recordatorio el ${day.date.getDate()}` : ''}
            >
              {/* Número del día */}
              <div className={cn(
                "text-sm font-medium mb-1 flex items-center justify-between",
                day.isToday && "text-blue-600 font-bold",
                !day.isCurrentMonth && "text-gray-400"
              )}>
                <span>{day.date.getDate()}</span>
                {day.isCurrentMonth && !hasReminders && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Recordatorios del día */}
              <div className="space-y-1">
                {dayReminders.slice(0, 3).map((reminder, reminderIndex) => (
                  <div
                    key={reminder.id}
                    className={cn(
                      "text-xs p-1 rounded cursor-pointer transition-colors",
                      "hover:opacity-80",
                      getPriorityColor(reminder.priority),
                      "text-white"
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      onReminderClick?.(reminder)
                    }}
                    title={`${reminder.title} - ${reminder.time}`}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">{getTypeIcon(reminder.type)}</span>
                      <span className="truncate font-medium">{reminder.title}</span>
                    </div>
                    <div className="text-xs opacity-90">{reminder.time}</div>
                  </div>
                ))}
                
                {/* Indicador de más recordatorios */}
                {dayReminders.length > 3 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{dayReminders.length - 3} más
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
