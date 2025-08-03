import { TBaseClient } from "./client"
import { Slip, TOrderPaymentConfig } from "./payment"

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
  payment: TOrderPaymentConfig
  shippingType: TShipping["type"]
  shippingMode: TShipping["method"]
  shipping: TShipping
}

export type TFBOrder = TNewOrder & {
  shippedAt: number | null
  code: string | number
  status: TOPStatus
  products: TOrderProduct[]
  observations: string
}

export type TBasicOrder = {
  id: string
  code: string | number
  status: TOPStatus
  products: TOrderProduct[]
} & TFBOrder

export type TPageListOrder = {
  id: string
  code: string | number
  clientName: string
  orderDate: string
  value: number
  quantity: number
  status: TOPStatus
  details: {
    productionLineId: string | null
    products: TOrderDetailsProduct[]
    additional: {
      clientName: string
      clientRegister: string
      clientStateInscription: string | null
      orderDate: string
      observations: string
      deadline: string
      shippedAt: string | null
      valueTotal: number
      valueCommission: number
      valueLiquid: number
      paymentMethod: string
      hasInstallments: string
      installments: number
      paidInstallments: number
      emmitter: string
      representative: string | null
      address: string
    }
    paymentSlips?: Slip[]
  }
}

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

type TNewOrderProduct = {
  id: string
  quantity: number
  status: TOPStatus
}

export type TOrderProduct = TNewOrderProduct & {
  status: TOPStatus
}

type TOrderDetailsProduct = {
  id: string
  code: string | number
  model: string
  name: string
  color: string
  price: number
  type: string
  quantity: number
  status: TOPStatus
}

export type TShipping = {
  type: TShippingType
  method: null | TShippingMethod
  price: number
}

export type TShippingType = "transporter" | "representative" | "mail"

export type TShippingMethod = "PAC" | "SEDEX"

export type TOPStatus = "queued" | "lor" | "doing" | "done"

export const TOPStatusWeight = {
  done: 1,
  queued: 2,
  doing: 3,
  lor: 4,
}
