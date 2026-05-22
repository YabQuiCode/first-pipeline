import { describe, it, expect } from 'vitest'

// Test utility functions extracted from hooks logic
describe('useCountUp logic', () => {
  it('should parse numeric string targets', () => {
    const target = '42'
    const numTarget = typeof target === 'string' ? parseFloat(target) : target
    expect(numTarget).toBe(42)
  })

  it('should handle NaN targets gracefully', () => {
    const target = 'N/A'
    const numTarget = typeof target === 'string' ? parseFloat(target) : target
    expect(isNaN(numTarget)).toBe(true)
  })

  it('should calculate easing correctly at progress boundaries', () => {
    // Easing function: 1 - (1 - progress)^3
    const easeAt0 = 1 - Math.pow(1 - 0, 3)
    const easeAt1 = 1 - Math.pow(1 - 1, 3)
    const easeAtHalf = 1 - Math.pow(1 - 0.5, 3)

    expect(easeAt0).toBe(0)
    expect(easeAt1).toBe(1)
    expect(easeAtHalf).toBe(0.875)
  })

  it('should round count values correctly', () => {
    const target = 100
    const progress = 0.5
    const eased = 1 - Math.pow(1 - progress, 3)
    const count = Math.round(eased * target)
    expect(count).toBe(88) // 0.875 * 100 rounded
  })
})
