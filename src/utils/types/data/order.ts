import { TClient } from "./client"
import { TProduct } from "./product"

export type TNewOrder = {
  client: string
  orderDate: number
  value: number
  status: string
  products: TOrderProduct[]
  total: {
    products: number
    value: number
  }
  deadline: string
  representative: string
  payment: {
    type: TPayment
    paymentCode: string
    paymentNumber: string
    status: string
  }
  shippingType: TShipping
  emmitter: string
}

export type TFBOrder = {
  client: string
  representative?: string
  orderDate: number
  value: number
  status: string
  products: {
    id: string
    quantity: number
    status: string
  }[]
  deadline: string
  payment: {
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
  client: TClient
  orderDate: number
  value: number
  status: string
  products: TOrderProduct[]
  total: {
    products: number
    value: number
  }
  deadline: string
  representative?: string
  payment: {
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
  status: string
}

type TPayment = "pix" | "cash" | "slip"

type TShipping = "transporter" | "representative" | "mail"
