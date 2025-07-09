import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useSettingsStore } from "@/stores/settingsStore"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, fromCurrency?: string): string {
  // This function is meant to be used inside React components
  // so it can access the zustand store via the hook
  const { currency, rates } = useSettingsStore.getState()
  let converted = amount
  if (fromCurrency && fromCurrency !== currency && rates[fromCurrency] && rates[currency]) {
    // Convert from original currency to base (USD), then to target
    converted = (amount / rates[fromCurrency]) * rates[currency]
  } else if (fromCurrency && fromCurrency !== currency && rates[currency]) {
    // Fallback: just use the target rate
    converted = amount * rates[currency]
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(converted)
}
