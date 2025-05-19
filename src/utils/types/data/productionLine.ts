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
    attributionDate: number | string
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
  order: TPageListPLOrders
  products: TPageListPLProducts
}

export type TPageListPLOrders = {
  id: string
  orderCode: string
  clientName: string
  orderDate: string
  onProduction: number
  status: TOPStatus
  details: {
    products: TOrderPLDetailsProduct[]
    attributions: TAttribution[]
  }
}

export type TPageListPLProducts = {
  id: string
  type: string
  modelName: string
  onProduction: number
  orders: number
  status: TOPStatus

  details: {
    ordersList: TPageListPLProductsDetailsOrders[]
    attributions: TPageListPLProductsDetailsAttribution[]
  }
}

export type TPageListPLProductsDetailsOrders = {
  index: number
  orderNumber: number
  clientName: string
  orderDate: string
  deadline: string
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
  productionId: string
  productId: string
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
  productionId: string
  productId: string
  attributedAt: string | null
}

export type TPageListPLProductsDetailsAttribution = {
  index: number
  color: string
  responsable: null | {
    id: string
    name: string
  }
  status: TOPStatus
  attributedAt: string | number | null
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
