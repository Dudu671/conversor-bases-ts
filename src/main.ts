import './style.css'
import { convert } from './converter'
import { updateBaseGroupState, showAlert, toggleInputStyle } from './utils/dom'
import { isValidInput } from './utils/validation'

const state = {
  baseFrom: 10,
  baseTo: 2,
  inputValue: ''
}

const inputNode = document.querySelector<HTMLTextAreaElement>('#inputValue')!
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

      if (isBaseInputGroup) state.baseFrom = parsedValue;
      else state.baseTo = parsedValue;

      if (state.inputValue) isValidInput(inputNode, state.inputValue, state.baseFrom)
    })
  })

  // Eventos do Input Customizado de Base
  inputBaseNode.addEventListener('change', (e) => handleInputBase(e, isBaseInputGroup, buttons))
  inputBaseNode.addEventListener('click', (e) => handleInputBase(e, isBaseInputGroup, buttons))
})

// Evento do Input de Valor Principal
inputNode.addEventListener('change', (e) => {
  state.inputValue = (e.currentTarget as HTMLInputElement).value
  isValidInput(inputNode, state.inputValue, state.baseFrom)
})

inputNode.addEventListener('input', () => {
  inputNode.style.height = 'auto'
  inputNode.style.height = inputNode.scrollHeight + 'px'
})

// Evento de Swap (Botão)
const swapButton = document.querySelector<HTMLButtonElement>('#swapButton')!
swapButton.addEventListener('click', () => {
  [state.baseFrom, state.baseTo] = [state.baseTo, state.baseFrom]

  const fromGroup = document.querySelector<HTMLDivElement>('#baseInputGroup')!
  const toGroup = document.querySelector<HTMLDivElement>('#baseOutputGroup')!

  const fromInput = fromGroup.querySelector<HTMLInputElement>('input')!
  const toInput = toGroup.querySelector<HTMLInputElement>('input')!

  const fromValue = fromInput.value
  const toValue = toInput.value
  fromInput.value = toValue
  toInput.value = fromValue

  updateBaseGroupState(fromGroup, state.baseFrom)
  updateBaseGroupState(toGroup, state.baseTo)

  if (state.inputValue) isValidInput(inputNode, state.inputValue, state.baseFrom)
})

// Evento de Conversão (Botão)
const convertButton = document.querySelector<HTMLButtonElement>('#convertButton')!
convertButton.addEventListener('click', () => {
  if (!state.inputValue) {
    showAlert('Entrada vazia', 'Por favor, insira um número para converter.', 'warning')
    return
  }

  if (!isValidInput(inputNode, state.inputValue, state.baseFrom, true))
    return

  const result = convert(state.inputValue, state.baseFrom, state.baseTo)
  const resultDisplay = document.querySelector<HTMLDivElement>('.result-display')!
  resultDisplay.textContent = result ?? '0'
})

// Funções de Validação e Lógica
function handleInputBase(e: Event, isBaseInputGroup: boolean, buttons: NodeListOf<HTMLButtonElement>): void {
  const element = e.currentTarget as HTMLInputElement
  const value = parseInt(element.value)

  if (!value && value !== 0) return toggleInputStyle(element, 'transparent')

  if (isNaN(value) || value < 2 || value > 32) {
    toggleInputStyle(element, 'red', true)
    if (e.type === 'change') {
      showAlert('Base inválida', 'A base inserida é inválida. Por favor, insira um valor entre 2 e 32.', 'error')
    }
    return
  }

  toggleInputStyle(element, 'transparent')

  if (isBaseInputGroup) state.baseFrom = value;
  else state.baseTo = value;

  buttons.forEach(btn => btn.classList.remove('active'))
  element.classList.add('active')

  if (state.inputValue) isValidInput(inputNode, state.inputValue, state.baseFrom)
}