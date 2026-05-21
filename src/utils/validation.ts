import { BASE32_DIGITS } from '../converter'

export function isValidInput(value: string, base: number): boolean {
  const validDigits = BASE32_DIGITS.slice(0, base)
  return [...value].every(char => validDigits.includes(char.toUpperCase()))
}

export function isValidBase(value: number): boolean {
  return !isNaN(value) && value >= 2 && value <= 32
}