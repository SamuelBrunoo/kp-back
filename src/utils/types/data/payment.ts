export type TPaymentConfig = {
  representative: TRepresentativePaymentConfig
}

export type TRepresentativePaymentConfig = {
  commissionType: TCommissionType
  value: number
  paymentMethod: TPpaymentMethod
  period: TComissionPeriod
  dateLimit: number
  dateLimit2: number | null
}

export type TPpaymentMethod = "pix" | "ted" | "check" | "ticket"

export type TCommissionType = "percentage" | "fixed"

export type TComissionPeriod = "monthly" | "dualweek"
