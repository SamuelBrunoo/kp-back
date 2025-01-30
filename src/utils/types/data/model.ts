import { TProduct } from "./product"

export type TFBModel = {
  id: string
  code: string
  colors: string[]
  name: string
  active: boolean
  price: number
  type: string
}

export type TPageListModel = {
  id: string
  code: string
  colors: number
  name: string
  price: number
  type: string
  storage: {
    has: boolean
    quantity: number
  }
  deletable: boolean
  active: boolean
}

export type TModel = {
  id: string
  code: string
  colors: string[]
  name: string
  price: number
  type: string
  active: boolean
  deletable: boolean
  storage: {
    has: boolean
    quantity: number
  }
}

export type TModelDetails = {
  model: TModel
  variations: (TProduct & {
    color: string
    price: number
  })[]
}

export type TNewModel = {
  code: string
  type: string
  name: string
  price: number
  colors: string[]
  storage: {
    has: boolean
    quantity: number
  }
}
