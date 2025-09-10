import { TProductionLineProductGroup } from "./productGroup/productionLineGroup"
import { TProductionOrder } from "./productionOrder"

export type TNewProductLine = {
  order: TProductionOrder
  status: string
  quantity: number
  products: TProductionLineProductGroup[]
}
