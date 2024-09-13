import { TFBOrder, TOrder } from "../types/data/order"
import { TEmmitter } from "../types/data/emmiter"
import { TRepresentative } from "../types/data/representative"
import { TClient } from "../types/data/client"
import { TProduct } from "../types/data/product"
import { TColor } from "../types/data/color"
import { TModel } from "../types/data/model"
import { TProdType } from "../types/data/prodType"

import { formatSlip } from "../formatters/slip"

type Props = {
  orders: ({ id: string } & TFBOrder)[]
  representatives: TRepresentative[]
  emmitters: TEmmitter[]
  clients: TClient[]
  prodTypes: TProdType[]
  colors: TColor[]
  models: TModel[]
  products: TProduct[]
}

const parseOrders = (props: Props) => {
  const {
    orders,
    emmitters,
    representatives,
    clients,
    prodTypes,
    colors,
    models,
    products,
  } = props

  let list: TOrder[] = []

  orders.forEach((order) => {
    const client = clients.find((client) => order.client === client.id)
    const representative = representatives.find(
      (rep) => order.representative === rep.id
    )?.name
    const emmitter = emmitters.find((emt) => order.emmitter === emt.id)
      ?.name as string

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

    const obj: TOrder = {
      ...order,
      client: client as TClient,
      emmitter,
      representative: representative ?? "Não atribuído",
      products: pds,
      total: {
        products: pds.reduce((prev, pd) => prev + pd.quantity, 0),
        value: pds.reduce((prev, pd) => prev + pd.quantity * pd.price, 0),
      },
      payment: {
        ...order.payment,
        paymentNumber:
          order.payment.type === "slip"
            ? formatSlip(order.payment.paymentNumber)
            : order.payment.paymentNumber,
      },
    }

    list.push(obj)
  })

  return list
}

export default parseOrders
