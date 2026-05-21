import { BASE32_DIGITS } from '../converter'
import { showAlert, toggleInputStyle } from './dom'

export function isValidInput(inputNode: HTMLTextAreaElement, value: string, base: number, warning: boolean = false): boolean {
  const validDigits = BASE32_DIGITS.slice(0, base)

  for (const char of value) {
    if (!validDigits.includes(char.toUpperCase())) {
      toggleInputStyle(inputNode, 'red', true)
      if (warning) {
        showAlert('Entrada inválida', `O número inserido contém caracteres que não são válidos para a base ${base}.`, 'error')
      }
      return false
    }
  }

  toggleInputStyle(inputNode, 'transparent')
  return true
}