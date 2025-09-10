import { TOPStatus } from "../../status/orderProduct"
import { TAttribution } from "../attribution"
import { TProductionLine_Order_ProductDetails } from "./productDetails"

export type TPageListProductionLine_OrdersView = {
  id: string
  orderCode: string
  clientName: string
  orderDate: string
  onProduction: number
  status: TOPStatus
  details: {
    products: TProductionLine_Order_ProductDetails[]
    attributions: TAttribution[]
  }
}
