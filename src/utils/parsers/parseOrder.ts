/*
 *  Typing
 */

/* Order */
import { TNewOrder } from "../types/data/order/newOrder"
import { TBasicOrder } from "../types/data/order/basicOrder"
import { TOrder } from "../types/data/order"

/* Product */
import { TProduct } from "../types/data/product"

/* Color */
import { TColor } from "../types/data/color"

/* Model */
import { TModel } from "../types/data/model"

/* Product Type */
import { TProdType } from "../types/data/prodType"

type Props = {
  order: TBasicOrder
  prodTypes: TProdType[]
  colors: TColor[]
  models: TModel[]
  products: TProduct[]
}

const parseOrder = (props: Props) => {
  const { order, prodTypes, colors, models, products } = props

  // @ts-ignore
  const pds: TOrder["products"] = order.products.map((pd) => {
    const product = products.find((p) => p.id === pd.id) as TProduct

    const c = colors.find((col) => col.code === product.color) as TColor
    const m = models.find((mod) => mod.code === product.model) as TModel
    const t = prodTypes.find((pt) => pt.code === m.type) as TProdType

    return {
      ...{
        ...product,
        type: t.name,
        model: m.name,
        color: c.name,
        price: m.price,
      },
      ...pd,
    }
  })

  const obj: TNewOrder = {
    ...order,
    orderDate: new Date(order.orderDate).getTime(),
    shippedAt: new Date(order.shippedAt).getTime(),
    deadline: new Date(order.deadline).getTime(),
    products: pds,
    representative: order.representative ?? "Não definido",
    payment: {
      ...(order.payment as any),
      installments:
        order.payment.installments !== undefined
          ? order.payment.installments
          : undefined,
      // paymentNumber:
      //   order.payment.type === "slip"
      //     ? formatSlip(order.payment.paymentNumber)
      //     : order.payment.paymentNumber,
    },
  }

  return obj
}

export default parseOrder
