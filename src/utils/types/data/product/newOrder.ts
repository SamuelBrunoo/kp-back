import { TOPStatus } from "../status/orderProduct"

export type TNewOrderProduct = {
  id: string
  quantity: number
  status: TOPStatus
}
