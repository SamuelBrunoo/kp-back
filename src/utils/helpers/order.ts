import { getListOverralStatus } from "./getListOverralStatus"

/*
 *  Typing
 */

/* Order */
import { TDBOrder } from "../types/data/order/dbOrder"

/* Production Line */
import { TProductionLineProductGroup } from "../types/data/productionLine/productGroup/productionLineGroup"

export const extractOrderProductionUpdates = (
  products: TProductionLineProductGroup[],
  order: TDBOrder
): TDBOrder => {
  let newPl: TDBOrder = {
    ...order,
    products: [],
  }

  let newList: TDBOrder["products"] = []

  order.products.forEach((prod) => {
    const productionLineProduct = products.find((p) => p.id === prod.id)

    if (productionLineProduct) {
      let newProdObj: TDBOrder["products"][number] = {
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
