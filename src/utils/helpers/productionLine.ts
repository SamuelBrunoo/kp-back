import {
  TAttribution,
  TFBLineProduct,
  TFBLineProductGroup,
  TFBProductionLine,
} from "../types/data/productionLine"
import { getListOverralStatus } from "./getListOverralStatus"

export const extractProductionUpdates = (
  products: TAttribution[],
  productionLine: TFBProductionLine
): TFBProductionLine => {
  let newPl: TFBProductionLine = {
    ...productionLine,
    products: [],
  }

  let newList: TFBProductionLine["products"] = []

  productionLine.products.forEach((prod) => {
    let newProdObj: TFBLineProductGroup = {
      id: prod.id,
      list: [],
      status: "queued",
    }

    const newProdList: TFBLineProduct[] = prod.list.map((prodItem) => {
      const updatedItemInfo = products.find(
        (p) => p.productionId === prodItem.productionId
      )

      const newProductionItemObj: TFBLineProduct = {
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
    })

    newProdObj.list = newProdList
    newProdObj.status = getListOverralStatus(newProdList)

    newList.push(newProdObj)
  })

  newPl.products = newList
  newPl.status = getListOverralStatus(newList)

  return newPl
}
