import { TClient } from "./client"
import { TProduct } from "./product"

export type TFBOrder = {
  client: string
  code: string
  representative?: string
  orderDate: number
  value: number
  status: TOPStatus
  products: {
    id: string
    quantity: number
    status: TOPStatus
  }[]
  deadline: number
  payment: {
    type: TPayment
    paymentCode: string
    paymentNumber: string
    status: string
    installments?: number
  }
  shippingType: TShipping
  emmitter: string
}

export type TNewOrder = {
  client: string
  orderDate: number
  value: number
  status: TOPStatus
  products: TOrderProduct[]
  total: {
    products: number
    value: number
  }
  deadline: number
  representative: string
  payment: {
    installments?: string
    type: TPayment
    paymentCode: string
    paymentNumber: string
    status: string
  }
  shippingType: TShipping
  emmitter: string
}

export type TOrder = {
  id: string
  code: string
  client: TClient
  orderDate: number
  value: number
  status: TOPStatus
  products: TOrderProduct[]
  total: {
    products: number
    value: number
  }
  deadline: number
  representative?: string
  payment: {
    installments?: number
    type: TPayment
    paymentCode: string
    paymentNumber: string
    status: string
  }
  shippingType: TShipping
  emmitter: string
}

type TOrderProduct = TProduct & {
  quantity: number
  status: TOPStatus
}

export type TPayment = "pix" | "cash" | "slip"

export type TShipping = "transporter" | "representative" | "mail"

export type TOPStatus = "queued" | "lor" | "doing" | "done"
