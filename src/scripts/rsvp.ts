export const PHONE_DIGITS = 10

export function extractDigits(input: string): string {
  return input.replace(/\D/g, '')
}

export function normalizeRuPhone(raw: string): string {
  // When the input already contains our injected "+7" prefix (e.g. the user
  // is typing into an already-masked field), the leading "7" in the extracted
  // digits is the prefix — not a user-typed digit. Strip it so we don't keep
  // re-consuming it on every keystroke.
  const hasInjectedPrefix = raw.trimStart().startsWith('+7')
  let digits = extractDigits(raw)
  if (hasInjectedPrefix && digits.startsWith('7')) {
    digits = digits.slice(1)
  } else if (digits.length > PHONE_DIGITS && (digits.startsWith('7') || digits.startsWith('8'))) {
    digits = digits.slice(1)
  }
  return digits.slice(0, PHONE_DIGITS)
}

export function formatRuPhone(raw: string): string {
  const d = normalizeRuPhone(raw)
  if (d.length === 0) return ''
  // Separators are only emitted when there's a digit after them. Otherwise a
  // trailing "(...) " or "-" would get re-added on every keystroke and trap
  // the user — backspace would remove the decoration and the mask would put
  // it right back.
  let out = '+7 (' + d.slice(0, Math.min(3, d.length))
  if (d.length > 3) out += ') ' + d.slice(3, Math.min(6, d.length))
  if (d.length > 6) out += '-' + d.slice(6, Math.min(8, d.length))
  if (d.length > 8) out += '-' + d.slice(8, Math.min(10, d.length))
  return out
}

export function isPhoneComplete(raw: string): boolean {
  return normalizeRuPhone(raw).length === PHONE_DIGITS
}

export function isFormReady(
  name: string,
  attendance: string | null,
  phone: string = '',
  withCompanions: boolean = false,
  companions: string = ''
): boolean {
  if (name.trim().length === 0) return false
  if (attendance !== 'yes' && attendance !== 'no') return false
  if (!isPhoneComplete(phone)) return false
  if (withCompanions && companions.trim().length === 0) return false
  return true
}
