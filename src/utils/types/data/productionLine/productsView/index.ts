import { TPageListPLProductsDetailsAttribution } from "./productAttribution"
import { TOPStatus } from "../../status/orderProduct"
import { TProductionLine_Product_ProductDetails } from "./productDetails"

export type TPageListProductionLine_ProductsView = {
  id: string
  type: string
  modelName: string
  onProduction: number
  orders: number
  status: TOPStatus

  details: {
    ordersList: TProductionLine_Product_ProductDetails[]
    attributions: TPageListPLProductsDetailsAttribution[]
  }
}
