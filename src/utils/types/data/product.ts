export type TProduct = {
  id: string
  active: boolean
  code: string
  model: string
  color: string
  price: number
  type: string
  storage: {
    has: boolean
    quantity: number
  }
}

export type TNewProduct = {
  active: boolean
  code: string
  name: string
  color: string
  price: number
  type: string
  storage: {
    has: boolean
    quantity: number
  }
}
