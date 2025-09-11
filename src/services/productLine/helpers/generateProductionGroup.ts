import { v4 as uuid } from "uuid"

/*
 *  Typing
 */

/* Production Line */
import { TProductionLineProductGroup } from "../../../utils/types/data/productionLine//productGroup/productionLineGroup"
import { TProductionLineBeltProduct } from "../../../utils/types/data/productionLine/productGroup/productionLineBeltProduct"

export const generateProductionGroup = (
  productId: string,
  quantity: number
): TProductionLineProductGroup => {
  let plProdGroup: TProductionLineProductGroup = {
    id: productId,
    status: "queued",
    list: [],
  }

  for (let i = 1; i <= quantity; i++) {
    const newId = uuid()

    const pToDo: TProductionLineBeltProduct = {
      status: "queued",
      productionId: newId,
      inCharge: null,
      index: i,
    }

    plProdGroup.list.push(pToDo)
  }

  return plProdGroup
}
