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
  slips?: Slip[]
}

export type Slip = {
  installment: number
  value: number
  dueDate: string
  status: TPaymentStatus
  barCode: string
  cleanCode: string
  pdfUrl: string
}

export type TPaymentStatus = "payed" | "awaiting" | "delayed"

export type TPaymentMethod = "pix" | "ted" | "check" | "slip"

export type TCommissionType = "percentage" | "fixed"

export type TComissionPeriod = "monthly" | "dualweek"
