import { TOPStatus } from "../../status/orderProduct"

export type TPageListPLProductsDetailsAttribution = {
  index: number
  color: string
  responsable: null | {
    id: string
    name: string
  }
  status: TOPStatus
  attributedAt: string | number | null
}
