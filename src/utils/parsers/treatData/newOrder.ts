import { getListOverralStatus } from "../../helpers/getListOverralStatus"

/*
 *  Typing
 */

/* Order */
import { TDBOrder } from "../../types/data/order/dbOrder"
import { TNewOrder } from "../../types/data/order/newOrder"

/* Product */
import { TProduct } from "../../types/data/product"

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

  // @ts-ignore
  let obj: TDBOrder = {
    ...data,
    representative: !!data.representative ? data.representative : null,
    shippedAt: null,
    code: Number(extra.newCode),
    status: getListOverralStatus(prods),
    products: prods,
  }

  return obj
}
