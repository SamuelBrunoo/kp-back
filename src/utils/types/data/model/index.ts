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
