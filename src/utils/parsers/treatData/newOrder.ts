import { getListOverralStatus } from "../../helpers/getListOverralStatus"
import { TFBOrder, TNewOrder } from "../../types/data/order"
import { TProduct } from "../../types/data/product"

export const treatNewOrder = (
  data: TNewOrder,
  extra: {
    newCode: string
    productsToTreat: TProduct[]
  }
) => {
  const prods: TFBOrder["products"] = data.products.map((p) => {
    const prod = extra.productsToTreat.find((product) => product.id === p.id)

    // @ts-ignore
    const obj: TFBOrder["products"][number] = {
      id: p.id,
      quantity: p.quantity,
      status:
        !prod.storage.has || prod.storage.quantity - p.quantity >= 0
          ? "done"
          : "queued",
    }

    return obj
  })

  let obj: TFBOrder = {
    ...data,
    representative: !!data.representative ? data.representative : null,
    shippedAt: null,
    code: extra.newCode,
    status: getListOverralStatus(prods),
    products: prods,
  }

  return obj
}
