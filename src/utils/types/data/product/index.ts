export type TProduct = {
  id: string
  active: boolean
  code: string
  model: string
  name: string
  color: string
  price: number
  type: string
  storage: {
    has: boolean
    quantity: number
  }
}
