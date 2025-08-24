import type React from "react"
import { useState, useCallback, useMemo } from "react"

export interface ValidationRule {
  required?: boolean
  email?: boolean
  minLength?: number
  maxLength?: number
  equals?: string
  custom?: (value: string) => string | null
}

export interface FormField {
  value: string
  error: string | null
  touched: boolean
  rules: ValidationRule[]
}

export interface FormState {
  [key: string]: FormField
}

export interface UseFormValidationReturn {
  values: { [key: string]: string }
  errors: { [key: string]: string | null }
  isValid: boolean
  register: (
    field: string,
    rules: ValidationRule[],
  ) => {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur: () => void
  }
  setValue: (field: string, value: string) => void
  reset: () => void
}

const validateField = (
  value: string,
  rules: ValidationRule[],
  allValues: { [key: string]: string },
): string | null => {
  for (const rule of rules) {
    if (rule.required && !value.trim()) return "This field is required"
    if (rule.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address"
    if (rule.minLength && value.length < rule.minLength) return `Must be at least ${rule.minLength} characters`
    if (rule.maxLength && value.length > rule.maxLength) return `Must be no more than ${rule.maxLength} characters`
    if (rule.equals && value !== allValues[rule.equals]) return "Passwords do not match"
    if (rule.custom) {
      const customError = rule.custom(value)
      if (customError) return customError
    }
  }
  return null
}

export const useFormValidation = (initialFields: { [key: string]: ValidationRule[] }): UseFormValidationReturn => {
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {}
    for (const field of Object.keys(initialFields)) {
      state[field] = { value: "", error: null, touched: false, rules: initialFields[field] }
    }
    return state
  })

  const values = useMemo(
    () =>
      Object.keys(formState).reduce((acc, key) => {
        acc[key] = formState[key].value
        return acc
      }, {} as Record<string, string>),
    [formState],
  )

  const errors = useMemo(
    () =>
      Object.keys(formState).reduce((acc, key) => {
        acc[key] = formState[key].error
        return acc
      }, {} as Record<string, string | null>),
    [formState],
  )

  const isValid = useMemo(
    () => {  return Object.values(formState).every((f) => !f.error ) && Object.values(formState).some((f) => f.touched )},
    [formState],
  )

  const register = useCallback(
    (field: string, _rulesFromCall: ValidationRule[]) => {
      const value = formState[field]?.value ?? ""

      return {
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value
          setFormState((prev) => {
            const current = prev[field] ?? { value: "", error: null, touched: false, rules: [] }
            const nextValues: Record<string, string> = {}
            for (const k of Object.keys(prev)) nextValues[k] = k === field ? newValue : prev[k].value
            const nextError = validateField(newValue, current.rules, nextValues)

            if (current.value === newValue && current.error === nextError) return prev

            return {
              ...prev,
              [field]: { ...current, value: newValue, error: nextError },
            }
          })
        },
        onBlur: () => {
          setFormState((prev) => {
            const current = prev[field]
            if (!current || current.touched) return prev
            return { ...prev, [field]: { ...current, touched: true } }
          })
        },
      }
    },
    [formState],
  )

  const setValue = useCallback((field: string, value: string) => {
    setFormState((prev) => {
      const current = prev[field]
      if (!current) return prev

      const nextValues: Record<string, string> = {}
      for (const k of Object.keys(prev)) nextValues[k] = k === field ? value : prev[k].value
      const nextError = validateField(value, current.rules, nextValues)

      if (current.value === value && current.error === nextError) return prev

      return {
        ...prev,
        [field]: { ...current, value, error: nextError },
      }
    })
  }, [])

  const reset = useCallback(() => {
    setFormState((prev) => {
      let changed = false
      const next: FormState = {}
      for (const k of Object.keys(prev)) {
        const curr = prev[k]
        const n = { ...curr, value: "", error: null, touched: false }
        changed ||= curr.value !== "" || curr.error !== null || curr.touched !== false
        next[k] = n
      }
      return changed ? next : prev
    })
  }, [])

  return { values, errors, isValid, register, setValue, reset }
}
