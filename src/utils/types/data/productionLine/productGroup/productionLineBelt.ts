import { TOPStatus } from "../../status/orderProduct"
import { TProductionLineBeltProduct } from "./productionLineBeltProduct"

export type TProductionLineBelt = {
  id: string
  type: string
  model: string
  color: string
  list: TProductionLineBeltProduct[]
  status: TOPStatus
}
