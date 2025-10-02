import React from 'react'
import { render, screen } from '@testing-library/react'
import { LoadingSpinner, LoadingButton, LoadingOverlay, LoadingCard, Skeleton, SkeletonText, SkeletonCard } from '../loading'

describe('LoadingSpinner', () => {
  it('should render with default size', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('h-6', 'w-6')
  })

  it('should render with small size', () => {
    render(<LoadingSpinner size="sm" />)
    
    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toHaveClass('h-4', 'w-4')
  })

  it('should render with large size', () => {
    render(<LoadingSpinner size="lg" />)
    
    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toHaveClass('h-8', 'w-8')
  })
})

describe('LoadingButton', () => {
  it('should render button with children', () => {
    render(<LoadingButton>Click me</LoadingButton>)
    
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    render(<LoadingButton loading loadingText="Loading...">Click me</LoadingButton>)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Click me')).not.toBeInTheDocument()
  })

  it('should be disabled when loading', () => {
    render(<LoadingButton loading>Click me</LoadingButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<LoadingButton disabled>Click me</LoadingButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})

describe('LoadingOverlay', () => {
  it('should render children when not loading', () => {
    render(
      <LoadingOverlay isLoading={false}>
        <div>Content</div>
      </LoadingOverlay>
    )
    
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should show loading overlay when loading', () => {
    render(
      <LoadingOverlay isLoading={true} message="Loading...">
        <div>Content</div>
      </LoadingOverlay>
    )
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

describe('LoadingCard', () => {
  it('should render children when not loading', () => {
    render(
      <LoadingCard isLoading={false}>
        <div>Content</div>
      </LoadingCard>
    )
    
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should show loading state when loading', () => {
    render(
      <LoadingCard isLoading={true} message="Loading...">
        <div>Content</div>
      </LoadingCard>
    )
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })
})

describe('Skeleton', () => {
  it('should render skeleton with default classes', () => {
    render(<Skeleton />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('animate-pulse', 'bg-gray-200', 'rounded')
  })

  it('should apply custom className', () => {
    render(<Skeleton className="custom-class" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('custom-class')
  })
})

describe('SkeletonText', () => {
  it('should render single line by default', () => {
    render(<SkeletonText />)
    
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(1)
  })

  it('should render multiple lines', () => {
    render(<SkeletonText lines={3} />)
    
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(3)
  })

  it('should apply custom className', () => {
    render(<SkeletonText className="custom-class" />)
    
    const container = screen.getByTestId('skeleton-text')
    expect(container).toHaveClass('custom-class')
  })
})

describe('SkeletonCard', () => {
  it('should render skeleton card', () => {
    render(<SkeletonCard />)
    
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should apply custom className', () => {
    render(<SkeletonCard className="custom-class" />)
    
    const card = screen.getByTestId('skeleton-card')
    expect(card).toHaveClass('custom-class')
  })
})
