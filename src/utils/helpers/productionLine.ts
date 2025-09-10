import {
  TAttribution,
 TDBLineProduct,
 TDBLineProductGroup,
 TDBProductionLine,
} from "../types/data/productionLine"
import { getListOverralStatus } from "./getListOverralStatus"

export const extractProductionUpdates = (
  products: TAttribution[],
  productionLine:TDBProductionLine
):TDBProductionLine => {
  let newPl:TDBProductionLine = {
    ...productionLine,
    products: [],
  }

  let newList:TDBProductionLine["products"] = []

  productionLine.products.forEach((prod) => {
    let newProdObj:TDBLineProductGroup = {
      id: prod.id,
      list: [],
      status: "queued",
    }

    const newProdList:TDBLineProduct[] = prod.list.map((prodItem) => {
      const updatedItemInfo = products.find(
        (p) => p.productionId === prodItem.productionId
      )

      const newProductionItemObj:TDBLineProduct = {
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
