import { TPageListProductionLine_OrdersView } from "./ordersView"
import { TPageListProductionLine_ProductsView } from "./productsView"

export type TPageListProductionLine = {
  order: TPageListProductionLine_OrdersView
  products: TPageListProductionLine_ProductsView
}
