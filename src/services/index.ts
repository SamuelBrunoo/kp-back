import AuthService from "./auth"
import OrderService from "./order"
import PaymentsService from "./payments"
import ProductionLineService from "./productLine"
import ProductsService from "./products"
import StatisticsService from "./statistics"

const SERVICES = {
  Auth: AuthService,
  Order: OrderService,
  Payments: PaymentsService,
  ProductionLine: ProductionLineService,
  Products: ProductsService,
  Statistics: StatisticsService,
}

export default SERVICES
