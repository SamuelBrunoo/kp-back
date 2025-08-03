import AuthService from "./auth"
import OrderService from "./order"
import ProductionLineService from "./productLine"
import ProductsService from "./products"

const SERVICES = {
  Auth: AuthService,
  Order: OrderService,
  Products: ProductsService,
  ProductionLine: ProductionLineService,
}

export default SERVICES
