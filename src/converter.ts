export function convert(value: string, fromBase: number, toBase: number) {
  console.log(`Convertendo "${value}" de base ${fromBase} para base ${toBase}`)

  if (fromBase === toBase) {
    console.log('As bases são iguais, retornando o valor original.')
    return value
  }
}