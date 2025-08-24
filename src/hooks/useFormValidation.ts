import type React from "react"

import { useState, useCallback } from "react"

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

const validateField = (value: string, rules: ValidationRule[], allValues: { [key: string]: string }): string | null => {
  for (const rule of rules) {
    if (rule.required && !value.trim()) {
      return "This field is required"
    }

    if (rule.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address"
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `Must be at least ${rule.minLength} characters`
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `Must be no more than ${rule.maxLength} characters`
    }

    if (rule.equals && value !== allValues[rule.equals]) {
      return "Passwords do not match"
    }

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
    Object.keys(initialFields).forEach((field) => {
      state[field] = {
        value: "",
        error: null,
        touched: false,
        rules: initialFields[field],
      }
    })
    return state
  })

  const values = Object.keys(formState).reduce(
    (acc, key) => {
      acc[key] = formState[key].value
      return acc
    },
    {} as { [key: string]: string },
  )

  const errors = Object.keys(formState).reduce(
    (acc, key) => {
      acc[key] = formState[key].error
      return acc
    },
    {} as { [key: string]: string | null },
  )

  const isValid = Object.values(formState).every((field) => !field.error && field.touched)

  const register = useCallback(
    (field: string, rules: ValidationRule[]) => {
      return {
        value: formState[field]?.value || "",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value
          setFormState((prev) => ({
            ...prev,
            [field]: {
              ...prev[field],
              value: newValue,
              error: validateField(newValue, rules, values),
            },
          }))
        },
        onBlur: () => {
          setFormState((prev) => ({
            ...prev,
            [field]: {
              ...prev[field],
              touched: true,
            },
          }))
        },
      }
    },
    [formState, values],
  )

  const setValue = useCallback(
    (field: string, value: string) => {
      setFormState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          value,
          error: validateField(value, prev[field].rules, { ...values, [field]: value }),
        },
      }))
    },
    [values],
  )

  const reset = useCallback(() => {
    setFormState((prev) => {
      const newState: FormState = {}
      Object.keys(prev).forEach((field) => {
        newState[field] = {
          ...prev[field],
          value: "",
          error: null,
          touched: false,
        }
      })
      return newState
    })
  }, [])

  return {
    values,
    errors,
    isValid,
    register,
    setValue,
    reset,
  }
}
