import { TOPStatus } from "../../status/orderProduct"
import { TProductionLineBelt } from "./productionLineBelt"

export type TProductionLineProductGroup = {
  id: string
  status: TOPStatus
  list: TProductionLineBelt[]
}
