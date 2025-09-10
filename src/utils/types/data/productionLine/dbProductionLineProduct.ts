import { TOPStatus } from "../status/orderProduct"

export type TDBLineProduct = {
  productionId: string
  status: TOPStatus
  index: number
  inCharge: null | {
    id: string
    name: string
    attributionDate: number | string
  }
}
