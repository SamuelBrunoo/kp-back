import { TOPStatus } from "../../status/orderProduct"

export type TProductionLineBeltProduct = {
  index: number
  productionId: string
  inCharge: null | {
    id: string
    name: string
    attributionDate: number
  }
  status: TOPStatus
}
