export type TPaymentConfig = {
  representative: TRepresentativePaymentConfig
}

export type TRepresentativePaymentConfig = {
  commissionType: TCommissionType
  value: number
  paymentMethod: TPaymentMethod
  paymentAddress: string
  period: TComissionPeriod
  dateLimit: number
  dateLimit2: number | null
}

export type TOrderPaymentConfig = {
  type: TPaymentMethod
  hasInstallments: boolean
  installments: number
  dueDate: number
  paymentCode: string | null
  paymentNumber: string | null
  status: string
  slips?: (UnfilledSlip | Slip)[]
}

export type UnfilledSlip = {
  installment: number
  dueDate: string
}

export type Slip = {
  installment: number
  value: number
  dueDate: string
  status: TPaymentStatus
  barCode: string
  cleanCode: string
}

export type TPaymentStatus = "payed" | "awaiting" | "delayed"

export type TPaymentMethod = "pix" | "slip"

export type TCommissionType = "percentage" | "fixed"

export type TComissionPeriod = "monthly" | "dualweek"

export type TBankSlipRegister = {
  txid: string
  qrCode: string
  linhaDigitavel: string
  codigoBarras: string
  cooperativa: string
  posto: string
  nossoNumero: string
}
