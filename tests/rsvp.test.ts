import { describe, it, expect } from 'vitest'
import {
  isFormReady,
  normalizeRuPhone,
  formatRuPhone,
  isPhoneComplete,
} from '../src/scripts/rsvp'

const VALID = '+7 (999) 123-45-67'

describe('isFormReady', () => {
  it('false when name empty', () => {
    expect(isFormReady('', 'yes', VALID)).toBe(false)
    expect(isFormReady('   ', 'yes', VALID)).toBe(false)
  })
  it('false when no attendance selected', () => {
    expect(isFormReady('Иван', null, VALID)).toBe(false)
  })
  it('false when attendance is some other string', () => {
    expect(isFormReady('Иван', 'maybe', VALID)).toBe(false)
  })
  it('false when phone is incomplete', () => {
    expect(isFormReady('Иван', 'yes', '')).toBe(false)
    expect(isFormReady('Иван', 'yes', '+7 (999) 12')).toBe(false)
  })
  it('true when name, attendance and phone all valid', () => {
    expect(isFormReady('Иван', 'yes', VALID)).toBe(true)
    expect(isFormReady('Анна', 'no', '89991234567')).toBe(true)
  })
  it('false when companions checkbox is on but names list is empty', () => {
    expect(isFormReady('Иван', 'yes', VALID, true, '')).toBe(false)
    expect(isFormReady('Иван', 'yes', VALID, true, '   ')).toBe(false)
  })
  it('true when companions checkbox is on and names list is filled', () => {
    expect(isFormReady('Иван', 'yes', VALID, true, 'Мария, Пётр')).toBe(true)
  })
  it('ignores companions field when checkbox is off', () => {
    expect(isFormReady('Иван', 'yes', VALID, false, '')).toBe(true)
  })
})

describe('normalizeRuPhone', () => {
  it('keeps last 10 digits regardless of country code', () => {
    expect(normalizeRuPhone('89991234567')).toBe('9991234567')
    expect(normalizeRuPhone('+79991234567')).toBe('9991234567')
    expect(normalizeRuPhone('+7 (999) 123-45-67')).toBe('9991234567')
    expect(normalizeRuPhone('9991234567')).toBe('9991234567')
  })
  it('strips non-digit characters', () => {
    expect(normalizeRuPhone('999-123 abc 4567')).toBe('9991234567')
  })
  it('caps at 10 digits even if user types more', () => {
    expect(normalizeRuPhone('999123456789')).toBe('9991234567')
  })
  it('returns empty for empty input', () => {
    expect(normalizeRuPhone('')).toBe('')
  })
  it('does not re-consume the injected +7 prefix as a user digit', () => {
    // Regression: typing "5" produced "+7 (5", but typing "1" next produced
    // "+7 (751) " instead of "+7 (51". The prefix "7" was being treated as
    // user input on every re-format.
    expect(normalizeRuPhone('+7 (5')).toBe('5')
    expect(normalizeRuPhone('+7 (51')).toBe('51')
    expect(normalizeRuPhone('+7 (512) 3')).toBe('5123')
    expect(normalizeRuPhone('+7 (999) 123-45-6')).toBe('999123456')
  })
})

describe('formatRuPhone idempotence', () => {
  // Regression: deleting from a fully-formatted number used to grow new "7"
  // prefixes back into the digits ("+7 (777) 777-77-7"). Re-formatting the
  // already-formatted string must be a fixed point.
  it('is stable when re-applied to its own output', () => {
    const inputs = ['9', '99', '999', '99912', '9991234567']
    for (const x of inputs) {
      const once = formatRuPhone(x)
      expect(formatRuPhone(once)).toBe(once)
    }
  })
})

describe('formatRuPhone', () => {
  it('formats progressively as digits are added', () => {
    expect(formatRuPhone('')).toBe('')
    expect(formatRuPhone('9')).toBe('+7 (9')
    expect(formatRuPhone('999')).toBe('+7 (999')
    expect(formatRuPhone('9991')).toBe('+7 (999) 1')
    expect(formatRuPhone('999123')).toBe('+7 (999) 123')
    expect(formatRuPhone('9991234')).toBe('+7 (999) 123-4')
    expect(formatRuPhone('999123456')).toBe('+7 (999) 123-45-6')
    expect(formatRuPhone('9991234567')).toBe('+7 (999) 123-45-67')
  })
  it('does not glue trailing separators that would block deletion', () => {
    // Regression: with ") " appended after 3 digits, backspacing the space
    // only removed the space, which the mask immediately re-added — the user
    // could not delete past the parenthesis. The mask now emits separators
    // only when a digit follows them.
    expect(formatRuPhone('999')).not.toMatch(/\) $/)
    expect(formatRuPhone('999123')).not.toMatch(/-$/)
    expect(formatRuPhone('99912345')).not.toMatch(/-$/)
  })
  it('handles pasted full numbers with various country code prefixes', () => {
    expect(formatRuPhone('89991234567')).toBe('+7 (999) 123-45-67')
    expect(formatRuPhone('+79991234567')).toBe('+7 (999) 123-45-67')
    expect(formatRuPhone('+7 (999) 123-45-67')).toBe('+7 (999) 123-45-67')
  })
})

describe('isPhoneComplete', () => {
  it('true only for full 10-digit numbers', () => {
    expect(isPhoneComplete('')).toBe(false)
    expect(isPhoneComplete('+7 (999) 123-45')).toBe(false)
    expect(isPhoneComplete('+7 (999) 123-45-67')).toBe(true)
    expect(isPhoneComplete('89991234567')).toBe(true)
  })
})
