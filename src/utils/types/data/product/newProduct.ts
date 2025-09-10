export type TNewProduct = {
  active: boolean
  code: string
  name: string
  color: string
  type: string
  model: string
  storage: {
    has: boolean
    quantity: number
  }
}
