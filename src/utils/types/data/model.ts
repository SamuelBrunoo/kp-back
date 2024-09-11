export type TFBModel = {
  id: string
  code: string
  colors: string[]
  name: string
  price: number
  type: string
}

export type TModel = {
  id: string
  code: string
  colors: string[]
  name: string
  price: number
  type: string
  storage: {
    has: boolean
    quantity: number
  }
}

export type TNewModel = {
  code: string
  type: string
  name: string
  price: number
}
