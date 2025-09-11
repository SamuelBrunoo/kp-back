import { getListOverralStatus } from "./getListOverralStatus"

/*
 *  Typing
 */

/* Production Line */
import { TAttribution } from "../types/data/productionLine/attribution"
import { TProductionLineBeltProduct } from "../types/data/productionLine//productGroup/productionLineBeltProduct"
import { TProductionLineProductGroup } from "../types/data/productionLine/productGroup/productionLineGroup"
import { TDBProductionLine } from "../types/data/productionLine/dbProductionLine"

export const extractProductionUpdates = (
  products: TAttribution[],
  productionLine: TDBProductionLine
): TDBProductionLine => {
  let newPl: TDBProductionLine = {
    ...productionLine,
    products: [],
  }

  let newList: TDBProductionLine["products"] = []

  productionLine.products.forEach((prod) => {
    let newProdObj: TProductionLineProductGroup = {
      id: prod.id,
      list: [],
      status: "queued",
    }

    const newProdList: TProductionLineBeltProduct[] = prod.list.map(
      (prodItem) => {
        const updatedItemInfo = products.find(
          (p) => p.productionId === prodItem.productionId
        )

        const newProductionItemObj: TProductionLineBeltProduct = {
          ...prodItem,
          status: updatedItemInfo.status,
          inCharge: updatedItemInfo.responsable
            ? {
                ...updatedItemInfo.responsable,
                attributionDate: updatedItemInfo.attributedAt,
              }
            : null,
        }

        return newProductionItemObj
      }
    )

    newProdObj.list = newProdList
    newProdObj.status = getListOverralStatus(newProdList)

    newList.push(newProdObj)
  })

  newPl.products = newList
  newPl.status = getListOverralStatus(newList)

  return newPl
}
