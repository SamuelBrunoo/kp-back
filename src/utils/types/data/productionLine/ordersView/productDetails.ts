import { TOPStatus } from "../../status/orderProduct"
import { TProductionLine_Order_ProductDetailsItem } from "./productDetailsItem"

export type TProductionLine_Order_ProductDetails = {
  type: string
  model: string
  quantity: number
  status: TOPStatus
  list: TProductionLine_Order_ProductDetailsItem[]
}
