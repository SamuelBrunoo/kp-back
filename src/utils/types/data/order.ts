import { TBaseClient, TClient } from "./client"
import { TOrderPaymentConfig, TPaymentMethod } from "./payment"

export type TNewOrder = {
  client: string
  orderDate: number
  deadline: number
  emmitter: string
  representative: string | null
  products: TNewOrderProduct[]
  totals: {
    value: number
    commission: number
    liquid: number
  }
  payment: TOrderPaymentConfig
  shipping: TShipping
}

export type TFBOrder = TNewOrder & {
  code: string
  status: TOPStatus
  products: TOrderProduct[]
}

export type TBasicOrder = TFBOrder & {
  id: string
}

export type TOrder = {
  id: string
  orderDate: number
  deadline: number
  emmitter: string
  representative: string | null
  totals: {
    value: number
    commission: number
    liquid: number
  }
  payment: TOrderPaymentConfig
  shipping: TShipping
  client: TBaseClient
  products: TOrderProduct[]
  code: string
  status: TOPStatus
}

type TNewOrderProduct = {
  id: string
  quantity: number
}

type TOrderProduct = TNewOrderProduct & {
  model: string
  status: TOPStatus
}

export type TShipping = {
  type: TShippingType
  method: null | TShippingMethod
}

export type TShippingType = "transporter" | "representative" | "mail"

export type TShippingMethod = "PAC" | "SEDEX"

export type TOPStatus = "queued" | "lor" | "doing" | "done"

export const TOPStatusWeight = {
  queued: 1,
  done: 2,
  doing: 3,
  lor: 4,
}
