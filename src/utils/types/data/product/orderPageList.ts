import { TOPStatus } from "../status/orderProduct"

export type TOrderDetailsProduct = {
  id: string
  code: string | number
  model: string
  name: string
  color: string
  price: number
  type: string
  quantity: number
  status: TOPStatus
}
