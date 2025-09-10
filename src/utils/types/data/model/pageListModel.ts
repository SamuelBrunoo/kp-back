export type TPageListModel = {
  id: string
  code: string
  colors: number
  name: string
  price: number
  type: string
  typeKey: string
  storage: {
    has: boolean
    quantity: number
  }
  deletable: boolean
  active: boolean
}
