/**
 * Minimal className combiner. Filters falsy values so conditional classes
 * read cleanly: cn('base', isActive && 'active', error ? 'err' : undefined).
 */
export type ClassValue = string | false | null | undefined

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
