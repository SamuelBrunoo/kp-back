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
