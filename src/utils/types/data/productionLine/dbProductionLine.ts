import { TProductionLineProductGroup } from "./productGroup/productionLineGroup"

export type TDBProductionLine = {
  order: string
  client: string
  status: string
  quantity: number
  products: TProductionLineProductGroup[]
}
