export const BASE32_DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUV'

export function convert(value: string, baseFrom: number, baseTo: number): string {
  if (baseFrom === baseTo) return value

  const bigBaseFrom = BigInt(baseFrom)
  const bigBaseTo = BigInt(baseTo)
  let base10input = 0n

  // Converter para base 10
  if (baseFrom !== 10) {
    for (let i = 0; i < value.length; i++) {
      const char = value[i].toUpperCase()
      const digit = BigInt(BASE32_DIGITS.indexOf(char))
      const exponent = BigInt(value.length - 1 - i)
      base10input += bigBaseFrom ** exponent * digit
    }
  } else {
    base10input = BigInt(value)
  }

  // Converter de base 10 para destino
  if (baseTo !== 10) {
    let result = ''
    let remaining = base10input

    if (remaining === 0n) return '0'

    while (remaining > 0n) {
      const mod = remaining % bigBaseTo
      result = BASE32_DIGITS[Number(mod)] + result
      remaining = remaining / bigBaseTo
    }

    return result
  }

  return base10input.toString()
}