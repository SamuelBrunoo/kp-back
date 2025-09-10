import { TComissionPeriod } from "./commissionPeriod"
import { TCommissionType } from "./commissionType"
import { TPaymentMethod } from "./paymentMethod"

export type TRepresentativePaymentConfig = {
  commissionType: TCommissionType
  value: number
  paymentMethod: TPaymentMethod
  paymentAddress: string
  period: TComissionPeriod
  dateLimit: number
  dateLimit2: number | null
}
