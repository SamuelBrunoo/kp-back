import { TOPStatus } from "../../status/orderProduct"
import { TProductionLineBeltProduct } from "./productionLineBeltProduct"

export type TProductionLineProductGroup = {
  id: string
  status: TOPStatus
  list: TProductionLineBeltProduct[]
}
