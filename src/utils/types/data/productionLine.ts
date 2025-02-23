import { TOPStatus } from "./order"

// # Firebase

export type TFBProductionLine = {
  id: string
  order: string
  client: string
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
  status: TOPStatus
  index: number
  inCharge: null | {
    id: string
    name: string
    attributionDate: number
  }
}

// # New

export type TNewProductLine = {
  order: TProductionOrder
  status: string
  quantity: number
  products: TFBLineProductGroup[]
}

export type TProductionLine = {
  id: string
  client: string
  order: string
  status: TOPStatus
  quantity: number
  products: TLineProductGroup[]
}

export type TPageListProductionLine = {
  id: string
  clientName: string
  orderDate: string
  onProduction: number
  status: TOPStatus
  details: {
    products: TOrderPLDetailsProduct[]
    attributions: TAttribution[]
  }
}

// Order tab

export type TOrderPLDetailsProduct = {
  type: string
  model: string
  code: string
  quantity: number
  list: TOrderPLDetailsProductListItem[]
}

export type TOrderPLDetailsProductListItem = {
  lineNumber: number
  color: string
  code: string
}

// -----

export type TAttribution = {
  number: number
  responsable: null | {
    id: string
    name: string
  }
  model: string
  color: string
  code: string
  status: TOPStatus
  attributedAt: string | null
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
  inCharge: null | {
    id: string
    name: string
    attributionDate: number
  }
  status: TOPStatus
}
