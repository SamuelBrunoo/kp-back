import { TOPStatus } from "../status/orderProduct"

export type TAttribution = {
  number: number
  responsable: null | {
    id: string
    name: string
  }
  model: string
  color: string
  code: string
  status: TOPStatus
  productionId: string
  productId: string
  attributedAt: string | null
}
