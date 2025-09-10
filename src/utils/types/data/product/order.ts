import { TOPStatus } from "../status/orderProduct"
import { TNewOrderProduct } from "./newOrder"

export type TOrderProduct = TNewOrderProduct & {
  status: TOPStatus
}
