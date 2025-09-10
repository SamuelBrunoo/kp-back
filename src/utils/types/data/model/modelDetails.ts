import { TModel } from "."
import { TProduct } from "../product"

export type TModelDetails = {
  model: TModel
  variations: (TProduct & {
    color: string
    price: number
  })[]
}
