import { TFBOrder, TOPStatusWeight, TOrder } from "../types/data/order"
import { TWorker } from "../types/data/worker"
import { TClient } from "../types/data/client"
import { TProduct } from "../types/data/product"
import { TColor } from "../types/data/color"
import { TModel } from "../types/data/model"
import { TProdType } from "../types/data/prodType"

import {
  TFBProductionLine,
  TLineProduct,
  TProductionLine,
} from "../types/data/productionLine"

type Props = {
  productionLines: TFBProductionLine[]
  products: TProduct[]
  prodTypes: TProdType[]
  colors: TColor[]
  models: TModel[]
  orders: ({ id: string } & TFBOrder)[]
  clients: TClient[]
  workers: TWorker[]
}

const parseProductionLines = (props: Props) => {
  const {
    productionLines,
    prodTypes,
    colors,
    models,
    products,
    orders,
    clients,
    workers,
  } = props

  let list: TProductionLine[] = []

  productionLines.forEach((pLine) => {
    const order = orders.find((ord) => pLine.order === ord.id) as TFBOrder & {
      id: string
    }

    const client = clients.find(
      (client) => order.client === client.id
    ) as TClient

    let status: TProductionLine["status"] = "queued"

    const pds: TProductionLine["products"] = pLine.products.map((pGroup) => {
      const product = products.find((p) => p.id === pGroup.id) as TProduct

      const c = colors.find((col) => col.code === product.color) as TColor
      const m = models.find((mod) => mod.code === product.model) as TModel
      const t = prodTypes.find((pt) => pt.code === m.type) as TProdType

      let pgStatus: TProductionLine["status"] = "queued"

      const list: TLineProduct[] = pGroup.list.map((pd, index) => {
        const w = workers.find((wk) => wk.id === pd.inCharge)

        const prod: TLineProduct = {
          index: index + 1,
          inCharge: {
            id: w?.id ?? "Não atribuído",
            name: w?.name ?? "Não atribuído",
          },
          productionId: pd.productionId,
          status: pd.status,
        }

        if (TOPStatusWeight[pd.status] > TOPStatusWeight[pgStatus])
          pgStatus = pd.status
        return prod
      })

      const productGroup: TProductionLine["products"][number] = {
        id: pGroup.id,
        status: pGroup.status,
        list: list,
        type: t.name,
        model: m.name,
        color: c.name,
      }

      if (TOPStatusWeight[pgStatus] > TOPStatusWeight[status]) status = pgStatus

      return productGroup
    })

    const obj: TProductionLine = {
      id: pLine.id,
      order: {
        client: {
          id: client.id,
          name: client.name,
          socialRole: client.socialRole,
        },
        code: order.code,
        id: order.id,
        orderDate: order.orderDate,
        deadline: order.deadline,
      },
      products: pds,
      quantity: pds.length,
      status: status,
    }

    list.push(obj)
  })

  return list
}

export default parseProductionLines
