import { TPaymentConfig } from "../payment"
import { TNewOrderProduct } from "../product/newOrder"
import { TShipping } from "../shipping"
import { TOPStatus } from "../status/orderProduct"

export type TDBOrder = {
  client: string
  code: number
  deadline: string
  emmitter: string
  observations: string
  orderDate: string

  payment: TPaymentConfig["newOrder"] | TPaymentConfig["order"]

  products: TNewOrderProduct[]

  representative: string | null

  shippedAt?: string
  shipping: TShipping

  status: TOPStatus

  totals: {
    value: number
    commission: number
    liquid: number
    products: number
    ship: number
  }
}
