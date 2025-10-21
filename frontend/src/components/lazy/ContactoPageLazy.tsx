'use client'

import { lazy, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy loading de la página de contacto
const ContactoPage = lazy(() => import('@/app/(public)/contacto/page'))

// Componente de loading personalizado
const ContactoLoadingSkeleton = () => (
  <div className="space-y-8">
    {/* Hero section skeleton */}
    <div className="text-center space-y-4">
      <Skeleton className="h-12 w-96 mx-auto" />
      <Skeleton className="h-6 w-64 mx-auto" />
    </div>

    {/* Main content skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>

      {/* Cart skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-16 w-16" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)

export default function ContactoPageLazy() {
  return (
    <Suspense fallback={<ContactoLoadingSkeleton />}>
      <ContactoPage />
    </Suspense>
  )
}
