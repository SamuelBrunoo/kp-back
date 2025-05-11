import { TBaseClient } from "./client"
import { TOrderPaymentConfig } from "./payment"

export type TNewOrder = {
  client: string
  orderDate: number
  shippedAt?: number | null
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
  shippingType: TShipping["type"]
  shippingMode: TShipping["method"]
  shipping: TShipping
}

export type TFBOrder = TNewOrder & {
  shippedAt: number | null
  code: string
  status: TOPStatus
  products: TOrderProduct[]
}

export type TBasicOrder = {
  id: string
  code: number
  status: TOPStatus
  products: TOrderProduct[]
} & TFBOrder

export type TPageListOrder = {
  id: string
  code: string
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
      deadline: string
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
  status: TOPStatus
}

type TOrderProduct = TNewOrderProduct & {
  status: TOPStatus
}

type TOrderDetailsProduct = {
  id: string
  code: string
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
