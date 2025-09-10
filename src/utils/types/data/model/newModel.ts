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
