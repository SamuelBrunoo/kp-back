import {
  getListOverralStatus,
  getOrderStatusFromProductionStatus,
} from "../../helpers/getListOverralStatus"

/*
 *  Typing
 */

/* Order */
import { TDBOrder } from "../../types/data/order/dbOrder"
import { TNewOrder } from "../../types/data/order/newOrder"

/* Product */
import { TProduct } from "../../types/data/product"
import { TOrderStatus } from "../../types/data/status/order"
import { TOPStatus } from "../../types/data/status/orderProduct"

export const treatNewOrder = (
  data: TNewOrder,
  extra: {
    newCode: string
    productsToTreat: TProduct[]
  }
): TDBOrder => {
  const prods: TDBOrder["products"] = data.products.map((p) => {
    const prod = extra.productsToTreat.find((product) => product.id === p.id)

    const obj: TDBOrder["products"][number] = {
      id: p.id,
      quantity: p.quantity,
      status:
        !prod.storage.has || prod.storage.quantity - p.quantity >= 0
          ? "done"
          : "queued",
    }

    return obj
  })

  let productionStatus: TOPStatus = getListOverralStatus(prods)
  let orderStatus: TOrderStatus =
    getOrderStatusFromProductionStatus(productionStatus)

  // @ts-ignore
  let obj: TDBOrder = {
    ...data,
    representative: !!data.representative ? data.representative : null,
    shippedAt: null,
    status: orderStatus,
    code: Number(extra.newCode),
    productionStatus: productionStatus,
    products: prods,
  }

  return obj
}
