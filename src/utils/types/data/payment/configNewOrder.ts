import { TPaymentMethod } from "./paymentMethod"

export type TNewOrderPaymentConfig = {
  due?: number
  hasInstallments: boolean
  installments: number
  type: TPaymentMethod
}
