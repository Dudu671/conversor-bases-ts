# Base Converter

Este projeto é uma ferramenta simples de conversão de bases numéricas. Ele permite transformar valores entre bases diferentes (por exemplo, decimal, binário, hexadecimal) com validação de entrada para garantir que o número informado é compatível com a base selecionada.

## Tecnologias utilizadas

- HTML: estruturação da interface do usuário.
- CSS: estilo e layout da página.
- TypeScript: lógica de conversão, validação e manipulação do DOM.
- JavaScript compilado: é o código final executado no navegador.

## Requisitos para rodar

- Navegador moderno (Chrome, Edge, Firefox, Safari).
- Node.js e npm/yarn apenas se quiser instalar dependências ou compilar TypeScript localmente.

## Como rodar

1. Abra o arquivo `index.html` diretamente no navegador.
2. Se usar TypeScript no desenvolvimento, instale dependências e compile:
   - `npm install`
   - `npm run build` (ou comando equivalente configurado em `package.json`)
3. Em seguida, abra `index.html` no navegador para testar a aplicação.

## Explicação do funcionamento

### Validação

A validação garante que o número informado é válido para a base escolhida.

- Em `src/utils/validation.ts`, há regras para cada base suportada.
- O código verifica cada caractere do valor de entrada para conferir se ele está dentro do intervalo permitido pela base.
- Por exemplo:
  - em base 2, apenas `0` e `1` são aceitos;
  - em base 10, apenas dígitos de `0` a `9` são aceitos;
  - em base 16, são aceitos dígitos e letras `A`–`F`.
- Se a entrada for inválida, o resultado não é processado e o usuário recebe um aviso.

### Conversão

A conversão transforma um número de uma base de origem para outra base de destino através de um processo em duas etapas:

#### Etapa 1: Conversão para base 10

- Se a base de origem não for 10, o código percorre cada caractere do valor de entrada.
- Para cada caractere, encontra seu índice na string `BASE32_DIGITS` (que contém os dígitos válidos: `0–9` e `A–V`).
- Multiplica esse dígito pela potência apropriada da base de origem.
- Soma todos os resultados para obter o equivalente em base 10.
- Exemplo: `1010` (base 2) → `1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 0 + 2 + 0 = 10` (base 10).

#### Etapa 2: Conversão de base 10 para base de destino

- Pega o valor em base 10 obtido na etapa anterior.
- Divide repetidamente pela base de destino, coletando os restos.
- Os restos, convertidos em caracteres usando `BASE32_DIGITS`, formam o resultado de trás para frente.
- Exemplo: `10` (base 10) para base 2 → `10 ÷ 2 = 5 resto 0`, `5 ÷ 2 = 2 resto 1`, `2 ÷ 2 = 1 resto 0`, `1 ÷ 2 = 0 resto 1` → `1010` (base 2).

#### Otimizações

- Se as bases de origem e destino forem iguais, o valor é retornado sem conversão.
- Se o valor for zero, o resultado é imediatamente retornado como `'0'`.
- A função usa `BigInt` para garantir que possa lidar com números muito grandes sem perda de precisão.

### Integração com o DOM

- Em `src/main.ts`, o código captura os elementos do formulário, campos de entrada e resultado.
- Quando o usuário envia o formulário, o projeto:
  1. lê o valor e as bases selecionadas;
  2. valida o valor usando a função de validação;
  3. converte o valor se estiver válido;
  4. exibe o resultado na tela.
