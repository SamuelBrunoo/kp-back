export type TS_Slip = {
  txid?: string
  qrCode: string
  linhaDigitavel: string
  codigoBarras: string
  cooperativa: string
  posto: string
  nossoNumero: string
}

export type TS_Slip_Register = {
  codigoBeneficiario: string
  pagador: TPayer
  beneficiarioFinal?: TFinalReceiver
  especieDocumento: TDocumentSpecies
  nossoNumero?: string // Automatically generated if not provided
  seuNumero: string // User's system control id code
  idTituloEmpresa?: string // Same as 'seuNumero', but bigger
  dataVencimento: string // YYYY-MM-DD"

  diasProtestoAuto?: number // Not alloewed if contains diasNegativacaoAuto
  diasNegativacaoAuto?: number // Not alloewed if contains diasProtestoAuto
  validadeAposVencimento?: number // QRCode valid days. If not provided, user's 'dias de baixa'

  tipoCobranca: TCharge
  valor: number // R$ N.nn If Document Species === BOLETO_PROPOSTA or charge === "NORMAL"
  tipoDesconto?: TDiscount

  valorDesconto1?: number
  dataDesconto1?: string

  valorDesconto2?: number
  dataDesconto2?: string

  valorDesconto3?: number
  dataDesconto3?: string

  descontoAntecipado?: number

  tipoJuros?: TFeeType
  juros?: number // per delayed days
  multa?: number

  informativo?: string[]
  mensagem?: string[]

  splitBoleto?: string[] // *.2
  regraRateio?: TSplitRule // *.2
  repasseAutomaticoSplit?: TAutomaticSplit // *.2
  tipoValorRateio?: TSplitValueType // *.2

  destinatarios?: TReceiver[] // *.2 Up to 30 accounts
}
type TPayer = {
  tipoPessoa: TPersonType
  documento: string // CPF | CNPJ
  nome: string
  endereco?: string // *.1
  cidade?: string // *.1
  uf?: string // *.1
  cep?: number // *.1
  telefone?: string // just numbers
  email?: string
}

type TFinalReceiver = {
  tipoPessoa: TPersonType
  documento: string // CPF | CNPJ
  nome: string
  logradouro?: string
  numeroEndereco?: number
  cidade?: string
  cep?: number
  uf?: string
  telefone?: string
  email?: string
}

type TDiscount = "VALOR" | "PERCENTUAL"

type TFeeType = "VALOR" | "PERCENTUAL"

type TCharge = "HIBRIDO" | "NORMAL" // NORMAL without QRCode

type TPersonType = "PESSOA_FISICA" | "PESSOA_JURIDICA"

type TDocumentSpecies =
  | "DUPLICATA_MERCANTIL_INDICACAO"
  | "DUPLICATA_RURAL"
  | "NOTA_PROMISSORIA"
  | "NOTA_PROMISSORIA_RURAL"
  | "NOTA_SEGUROS"
  | "RECIBO"
  | "LETRA_CAMBIO"
  | "NOTA_DEBITO"
  | "DUPLICATA_SERVICO_INDICACAO"
  | "OUTROS"
  | "BOLETO_PROPOSTA"
  | "CARTAO_CREDITO"
  | "BOLETO_DEPOSITO"

type TSplitRule = "MENOR_VALOR" | "VALOR_COBRADO" | "VALOR_REGISTRO"

type TAutomaticSplit = "SIM" | "NAO"

type TSplitValueType = "PERCENTUAL" | "VALOR"

type TReceiver = {
  codigoAgencia: number // Up to 4 digits
  codigoBanco: number // Up to 3 digits
  floatSplit: number // Up to 30
  nomeDestinatário: string
  numeroContaCorrente: string // 4 to 13 alphanumeric digits
  numeroCpfCnpj: string // CPF | CNPJ
  parcelaRateio: number // Up to 30
  valorPercentualRateio: number // 14 digits + 2 decimals
}

/* ---------------
 * Notes
 * 1. Opcional (obrigatório se o cadastro do beneficiário está configurado para validar cep)
 * 2. Obrigatório caso seja um boleto com Distribuição de Crédito
 */
