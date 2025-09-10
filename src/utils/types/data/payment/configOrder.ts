import { TPaymentMethod } from "./paymentMethod"
import { OrderSlip } from "./slipOrder"

export type TOrderPaymentConfig = {
  type: TPaymentMethod
  hasInstallments: boolean
  installments: number
  due: number
  paymentCode: string | null
  paymentNumber: string | null
  status: string
  slips?: OrderSlip[]
}
