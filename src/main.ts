import './style.css'
import { convert } from './converter'
import { updateBaseGroupState, showAlert, toggleInputStyle } from './utils/dom'
import { isValidInput, isValidBase } from './utils/validation'

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

      if (state.inputValue) updateInputValidity()
    })
  })

  // Eventos do Input Customizado de Base
  inputBaseNode.addEventListener('change', (e) => handleInputBase(e, isBaseInputGroup, buttons))
  inputBaseNode.addEventListener('click', (e) => handleInputBase(e, isBaseInputGroup, buttons))
})

// Evento do Input de Valor Principal
inputNode.addEventListener('change', (e) => {
  state.inputValue = (e.currentTarget as HTMLTextAreaElement).value
  updateInputValidity()
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

  if (state.inputValue)
    updateInputValidity()
})

// Evento de Conversão (Botão)
const convertButton = document.querySelector<HTMLButtonElement>('#convertButton')!
convertButton.addEventListener('click', () => {
  if (!state.inputValue) {
    showAlert('Entrada vazia', 'Por favor, insira um número para converter.', 'warning')
    return
  }

  updateInputValidity()

  if (!isValidInput(state.inputValue, state.baseFrom)) {
    showAlert('Entrada inválida', `O número inserido contém caracteres que não são válidos para a base ${state.baseFrom}.`, 'error')
    return
  }

  const result = convert(state.inputValue, state.baseFrom, state.baseTo)
  const resultDisplay = document.querySelector<HTMLDivElement>('.result-display')!
  resultDisplay.textContent = result ?? '0'
})

// Orquestração de validações
function handleInputBase(e: Event, isBaseInputGroup: boolean, buttons: NodeListOf<HTMLButtonElement>): void {
  const element = e.currentTarget as HTMLInputElement
  const value = parseInt(element.value, 10)

  if (!value && value !== 0) return toggleInputStyle(element, 'transparent')

  if (!isValidBase(value)) {
    toggleInputStyle(element, 'red', true)
    if (e.type === 'change')
      showAlert('Base inválida', 'A base inserida é inválida. Por favor, insira um valor entre 2 e 32.', 'error')
    return
  }

  toggleInputStyle(element, 'transparent')

  if (isBaseInputGroup) state.baseFrom = value
  else state.baseTo = value

  buttons.forEach(btn => btn.classList.remove('active'))
  element.classList.add('active')

  updateInputValidity()
}

function updateInputValidity() {
  if (!state.inputValue) return
  const valid = isValidInput(state.inputValue, state.baseFrom)
  toggleInputStyle(inputNode, valid ? 'transparent' : 'red', !valid)
}