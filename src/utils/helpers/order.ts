import { TFBOrder } from "../types/data/order"
import { TFBLineProductGroup } from "../types/data/productionLine"
import { getListOverralStatus } from "./getListOverralStatus"

export const extractOrderProductionUpdates = (
  products: TFBLineProductGroup[],
  order: TFBOrder
): TFBOrder => {
  let newPl: TFBOrder = {
    ...order,
    products: [],
  }

  let newList: TFBOrder["products"] = []

  order.products.forEach((prod) => {
    const productionLineProduct = products.find((p) => p.id === prod.id)

    if (productionLineProduct) {
      let newProdObj: TFBOrder["products"][number] = {
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
