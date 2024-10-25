import { TOPStatus } from "./order"

// # Firebase

export type TFBProductionLine = {
  id: string
  order: string
  status: string
  quantity: number
  products: TFBLineProductGroup[]
}

export type TFBLineProductGroup = {
  id: string
  status: TOPStatus
  list: TFBLineProduct[]
}

export type TFBLineProduct = {
  productionId: string
  inCharge: string
  status: TOPStatus
}

// # New

export type TNewProductLine = {
  order: TProductionOrder
  status: string
  quantity: number
  products: TFBLineProductGroup[]
}

// # Client

export type TProductionLine = {
  id: string
  order: TProductionOrder
  status: TOPStatus
  quantity: number
  products: TLineProductGroup[]
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

export type TLineProductGroup = {
  id: string
  type: string
  model: string
  color: string
  list: TLineProduct[]
  status: TOPStatus
}

export type TLineProduct = {
  index: number
  productionId: string
  inCharge: {
    id: string
    name: string
  }
  status: TOPStatus
}
