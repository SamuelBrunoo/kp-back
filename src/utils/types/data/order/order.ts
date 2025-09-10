import { TOrderPaymentConfig } from "../payment/configOrder"
import { TShipping } from "../shipping"
import { TOPStatus } from "../status/orderProduct"

export type TOrder = {
  id: string
  shippedAt: number | null
  orderDate: number
  deadline: number
  emmitter: string
  representative: string | null
  totals: {
    value: number
    commission: number
    liquid: number
    products: number
    ship: number
  }
  payment: TOrderPaymentConfig
  shipping: TShipping
  client: TBaseClient
  products: TOrderProduct[]
  observations: string
  code: string | number
  status: TOPStatus
}
