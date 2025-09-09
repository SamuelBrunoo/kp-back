
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
  shippingType: TShipping["type"]
  shippingMode: TShipping["method"]
  shipping: TShipping
}