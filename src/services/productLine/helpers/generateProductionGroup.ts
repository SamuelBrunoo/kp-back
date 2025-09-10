import { v4 as uuid } from "uuid"
import {
 TDBLineProduct,
 TDBLineProductGroup,
} from "../../../utils/types/data/productionLine"

export const generateProductionGroup = (
  productId: string,
  quantity: number
):TDBLineProductGroup => {
  let plProdGroup:TDBLineProductGroup = {
    id: productId,
    status: "queued",
    list: [],
  }

  for (let i = 1; i <= quantity; i++) {
    const newId = uuid()

    const pToDo:TDBLineProduct = {
      status: "queued",
      productionId: newId,
      inCharge: null,
      index: i,
    }

    plProdGroup.list.push(pToDo)
  }

  return plProdGroup
}
