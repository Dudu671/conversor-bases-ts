import './style.css'
import { convert } from './converter'
import Swal from 'sweetalert2'

const base32Digits = '0123456789ABCDEFGHIJKLMNOPQRSTUV'
let baseFrom = 10
let baseTo = 2
let inputValue = ''

const inputNode = document.querySelector<HTMLInputElement>('#inputValue')!
const baseGroups = document.querySelectorAll<HTMLDivElement>('.base-group')

// Configuração dos Grupos de Base (From / To)
baseGroups.forEach(group => {
  const buttons = group.querySelectorAll<HTMLButtonElement>('button')
  const inputBaseNode = group.querySelector<HTMLInputElement>('input')!
  const isBaseInputGroup = group.id === 'baseInputGroup'

  // Evento de Clique nos Botões
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const element = e.currentTarget as HTMLButtonElement

      inputBaseNode.classList.remove('active')
      buttons.forEach(btn => btn.classList.remove('active'))
      element.classList.add('active')

      const defaultValue = isBaseInputGroup ? '10' : '2'
      const parsedValue = parseInt(element.dataset.value ?? defaultValue)

      if (isBaseInputGroup) baseFrom = parsedValue;
      else baseTo = parsedValue;

      if (inputValue) isValidInput(inputNode, inputValue, baseFrom)
    })
  })

  // Eventos do Input Customizado de Base
  inputBaseNode.addEventListener('change', (e) => handleInputBase(e, isBaseInputGroup, buttons))
  inputBaseNode.addEventListener('click', (e) => handleInputBase(e, isBaseInputGroup, buttons))
})

// Evento do Input de Valor Principal
inputNode.addEventListener('change', (e) => {
  inputValue = (e.currentTarget as HTMLInputElement).value
  isValidInput(inputNode, inputValue, baseFrom)
})

// Evento de Swap (Botão)
const swapButton = document.querySelector<HTMLButtonElement>('#swapButton')!
swapButton.addEventListener('click', () => {
  [baseFrom, baseTo] = [baseTo, baseFrom]

  const fromGroup = document.querySelector<HTMLDivElement>('#baseInputGroup')!
  const toGroup = document.querySelector<HTMLDivElement>('#baseOutputGroup')!

  const fromInput = fromGroup.querySelector<HTMLInputElement>('input')!
  const toInput = toGroup.querySelector<HTMLInputElement>('input')!

  const fromValue = fromInput.value
  const toValue = toInput.value
  fromInput.value = toValue
  toInput.value = fromValue

  updateBaseGroupState(fromGroup, baseFrom)
  updateBaseGroupState(toGroup, baseTo)

  if (inputValue) isValidInput(inputNode, inputValue, baseFrom)
})

function updateBaseGroupState(group: HTMLDivElement, activeBase: number) {
  const buttons = group.querySelectorAll<HTMLButtonElement>('button')
  const inputBase = group.querySelector<HTMLInputElement>('input')!

  let matchedButton = false

  buttons.forEach(btn => {
    const value = parseInt(btn.dataset.value ?? '0')
    const isActive = value === activeBase
    btn.classList.toggle('active', isActive)
    if (isActive) matchedButton = true
  })

  if (matchedButton || inputBase.value === '') {
    inputBase.classList.remove('active')
  } else {
    inputBase.classList.add('active')
  }
}

// Evento de Conversão (Botão)
const convertButton = document.querySelector<HTMLButtonElement>('#convertButton')!
convertButton.addEventListener('click', () => {
  if (!inputValue) {
    showAlert('Entrada vazia', 'Por favor, insira um número para converter.', 'warning')
    return
  }

  if (!isValidInput(inputNode, inputValue, baseFrom, true))
    return

  const result = convert(inputValue, baseFrom, baseTo)
  const resultDisplay = document.querySelector<HTMLDivElement>('.result-display')!
  resultDisplay.textContent = result ?? '0'
})

// Funções de Validação e Lógica
function isValidInput(inputNode: HTMLInputElement, value: string, base: number, warning: boolean = false): boolean {
  const validDigits = base32Digits.slice(0, base)

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

function handleInputBase(e: Event, isBaseInputGroup: boolean, buttons: NodeListOf<HTMLButtonElement>): void {
  const element = e.currentTarget as HTMLInputElement
  const value = parseInt(element.value)

  if (!value) return toggleInputStyle(element, 'transparent')

  if (isNaN(value) || value < 2 || value > 32) {
    toggleInputStyle(element, 'red', true)
    if (e.type === 'change') {
      showAlert('Base inválida', 'A base inserida é inválida. Por favor, insira um valor entre 2 e 32.', 'error')
    }
    return
  }

  toggleInputStyle(element, 'transparent')

  if (isBaseInputGroup) baseFrom = value;
  else baseTo = value;

  buttons.forEach(btn => btn.classList.remove('active'))
  element.classList.add('active')

  if (inputValue) isValidInput(inputNode, inputValue, baseFrom)
}

// Helpers de Interface
function toggleInputStyle(input: HTMLInputElement, color: 'red' | 'transparent', shouldTilt = false) {
  input.style.borderColor = color
  if (shouldTilt) {
    input.animate([
      { transform: 'rotate(2deg)' }, { transform: 'rotate(-2deg)' },
      { transform: 'rotate(2deg)' }, { transform: 'rotate(-2deg)' },
      { transform: 'rotate(0deg)' }
    ], { duration: 300, iterations: 1 })
  }
}

function showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question') {
  Swal.fire({ title, text, icon, confirmButtonText: 'OK' })
}