import { TOPStatus } from "../status/orderProduct"
import { TProductionLineBelt } from "./productGroup/productionLineBelt"

export type TProductionLine = {
  id: string
  client: string
  order: string
  status: TOPStatus
  quantity: number
  products: TProductionLineBelt[]
}
