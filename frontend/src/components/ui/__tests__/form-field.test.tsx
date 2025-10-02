import React from 'react'
import { render, screen } from '@testing-library/react'
import { FormField, Input, Textarea, Select } from '../form-field'

describe('FormField', () => {
  it('should render label correctly', () => {
    render(
      <FormField label="Test Label">
        <input />
      </FormField>
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should show required asterisk when required', () => {
    render(
      <FormField label="Test Label" required>
        <input />
      </FormField>
    )

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should show error message when error and touched', () => {
    render(
      <FormField label="Test Label" error="Test error" touched>
        <input />
      </FormField>
    )

    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('should not show error message when not touched', () => {
    render(
      <FormField label="Test Label" error="Test error" touched={false}>
        <input />
      </FormField>
    )

    expect(screen.queryByText('Test error')).not.toBeInTheDocument()
  })
})

describe('Input', () => {
  it('should render input with correct props', () => {
    render(
      <Input
        value="test value"
        onChange={() => {}}
        placeholder="Test placeholder"
      />
    )

    const input = screen.getByDisplayValue('test value')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Test placeholder')
  })

  it('should apply error styles when error and touched', () => {
    render(
      <Input
        value="test"
        onChange={() => {}}
        error="Test error"
        touched
      />
    )

    const input = screen.getByDisplayValue('test')
    expect(input).toHaveClass('border-red-500')
  })

  it('should not apply error styles when no error', () => {
    render(
      <Input
        value="test"
        onChange={() => {}}
      />
    )

    const input = screen.getByDisplayValue('test')
    expect(input).not.toHaveClass('border-red-500')
  })
})

describe('Textarea', () => {
  it('should render textarea with correct props', () => {
    render(
      <Textarea
        value="test value"
        onChange={() => {}}
        placeholder="Test placeholder"
        rows={4}
      />
    )

    const textarea = screen.getByDisplayValue('test value')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute('placeholder', 'Test placeholder')
    expect(textarea).toHaveAttribute('rows', '4')
  })

  it('should apply error styles when error and touched', () => {
    render(
      <Textarea
        value="test"
        onChange={() => {}}
        error="Test error"
        touched
      />
    )

    const textarea = screen.getByDisplayValue('test')
    expect(textarea).toHaveClass('border-red-500')
  })
})

describe('Select', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]

  it('should render select with options', () => {
    render(
      <Select
        value="option1"
        onChange={() => {}}
        options={options}
      />
    )

    expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('should apply error styles when error and touched', () => {
    render(
      <Select
        value="option1"
        onChange={() => {}}
        options={options}
        error="Test error"
        touched
      />
    )

    const select = screen.getByDisplayValue('Option 1')
    expect(select).toHaveClass('border-red-500')
  })
})
