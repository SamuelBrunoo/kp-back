import { TOPStatus } from "./order"

export type TNewProductLine = {
  order: TProductionOrder
  status: string
  quantity: number
  products: TFBLineProduct[]
}

export type TFBProductionLine = {
  id: string
  order: TProductionOrder
  status: string
  quantity: number
  products: TFBLineProduct[]
}

export type TProductionLine = {
  id: string
  order: TProductionOrder
  status: string
  quantity: number
  products: TLineProduct[]
}

export type TProductionOrder = {
  id: string
  code: string
  client: {
    id: string
    name: string
    socialRole: string
  }
  orderDate: number
  deadline: number
}

export type TLineProduct = {
  id: string
  productionId: string
  type: string
  model: string
  color: string
  inCharge: {
    id: string
    name: string
  }
  status: TOPStatus
}

export type TFBLineProduct = {
  id: string
  productionId: string
  inCharge: string
  status: TOPStatus
}
