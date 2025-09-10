import { TNewOrderPaymentConfig } from "../payment/configNewOrder"
import { TNewOrderProduct } from "../product/newOrder"
import { TShipping } from "../shipping"

export type TNewOrder = {
  client: string
  orderDate: number
  shippedAt?: number | null
  deadline: number
  emmitter: string
  representative: string | null
  products: TNewOrderProduct[]
  observations: string
  totals: {
    value: number
    commission: number
    liquid: number
    products: number
    ship: number
  }
  payment: TNewOrderPaymentConfig
  shipping: TShipping
}
