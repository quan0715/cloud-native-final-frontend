import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { cn, valueUpdater } from '../src/lib/utils'

describe('cn()', () => {
  it('merges class names correctly', () => {
    expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold')
  })

  it('removes conflicting tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})

describe('valueUpdater()', () => {
  it('sets ref value when given a direct value', () => {
    const count = ref(0)
    valueUpdater(5, count)
    expect(count.value).toBe(5)
  })

  it('applies updater function to ref value', () => {
    const count = ref(10)
    valueUpdater(v => v + 2, count)
    expect(count.value).toBe(12)
  })
})
