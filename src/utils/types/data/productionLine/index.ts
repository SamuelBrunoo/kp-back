import { TOPStatus } from "../status/orderProduct"
import { TProductionLineProductGroup } from "./productGroup/productionLineGroup"

export type TProductionLine = {
  id: string
  client: string
  order: string
  status: TOPStatus
  quantity: number
  products: TProductionLineProductGroup[]
}
