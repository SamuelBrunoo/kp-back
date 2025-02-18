import { TFBOrder, TNewOrder, TOrder } from "../types/data/order"
import { TEmmitter } from "../types/data/emmiter"
import { TRepresentative } from "../types/data/representative"
import { TClient } from "../types/data/client"
import { TProduct } from "../types/data/product"
import { TColor } from "../types/data/color"
import { TModel } from "../types/data/model"
import { TProdType } from "../types/data/prodType"

import { formatSlip } from "../formatters/slip"

type Props = {
  order: { id: string } & TFBOrder
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
    products: pds,
    representative: order.representative ?? "Não definido",
    payment: {
      ...order.payment,
      // @ts-ignore
      installments:
        order.payment.installments !== undefined
          ? String(order.payment.installments)
          : undefined,
      paymentNumber:
        order.payment.method === "slip"
          ? formatSlip(order.payment.paymentNumber)
          : order.payment.paymentNumber,
    },
  }

  return obj
}

export default parseOrder
