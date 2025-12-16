import { describe, it, expect } from 'vitest'
import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
  it('should format a number as USD currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('should format large numbers with thousands separators', () => {
    expect(formatCurrency(1234567.89)).toBe('$1,234,567.89')
  })

  it('should format small numbers correctly', () => {
    expect(formatCurrency(0.01)).toBe('$0.01')
  })

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('should accept custom options', () => {
    expect(formatCurrency(1234.5, { minimumFractionDigits: 0, maximumFractionDigits: 0 })).toBe('$1,235')
  })
})

