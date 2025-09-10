import {TDBOrder } from "../types/data/order"
import {TDBLineProductGroup } from "../types/data/productionLine"
import { getListOverralStatus } from "./getListOverralStatus"

export const extractOrderProductionUpdates = (
  products:TDBLineProductGroup[],
  order:TDBOrder
):TDBOrder => {
  let newPl:TDBOrder = {
    ...order,
    products: [],
  }

  let newList:TDBOrder["products"] = []

  order.products.forEach((prod) => {
    const productionLineProduct = products.find((p) => p.id === prod.id)

    if (productionLineProduct) {
      let newProdObj:TDBOrder["products"][number] = {
        id: prod.id,
        quantity: prod.quantity,
        status: getListOverralStatus(productionLineProduct.list),
      }

      newList.push(newProdObj)
    } else newList.push(prod)
  })

  newPl.products = newList
  newPl.status = getListOverralStatus(newList)

  return newPl
}
