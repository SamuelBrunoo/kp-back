import { TProduct } from "./product"

export type TOrder = {
  id: string
  client: string
  date: string
  value: number
  status: string
  products: TOrderProduct[]
  deadline: string
  representative?: string
  payment: {
    type: TPayment
    paymentNumber: string
    status: string
    installments?: number
  }
  shippingType: TShipping
  emmitter: string
}

type TOrderProduct = TProduct & {
  status: string
}

type TPayment = "PIX" | "CASH" | "BOLETO"

type TShipping = "TRANSPORTER" | "REPRESENTATIVE" | "MAIL"
