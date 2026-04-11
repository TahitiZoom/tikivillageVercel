import type { SupportedLocale } from '@/data/commerceProducts'

type LocalizedRecord = Partial<Record<Lowercase<SupportedLocale> | Uppercase<SupportedLocale>, string | null>>

export const resolveLocalizedValue = (
  value: unknown,
  locale: SupportedLocale,
  fallback = '',
): string => {
  if (typeof value === 'string') {
    const trimmedValue = value.trim()

    if (trimmedValue === '[object Object]') {
      return fallback
    }

    if (trimmedValue.startsWith('{') && trimmedValue.endsWith('}')) {
      try {
        return resolveLocalizedValue(JSON.parse(trimmedValue), locale, fallback)
      } catch {
        return value
      }
    }

    return value
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return fallback
  }

  const record = value as LocalizedRecord

  return (
    record[locale] ??
    record[locale.toUpperCase() as Uppercase<SupportedLocale>] ??
    record.fr ??
    record.FR ??
    record.en ??
    record.EN ??
    record.ja ??
    record.JA ??
    fallback
  ) || fallback
}
