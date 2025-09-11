/*
 *  Typing
 */

/* Order */
import { TDBOrder } from "../types/data/order/dbOrder"

/* Status */
import { TOPStatusWeight } from "../types/data/status/orderProductStatusWeight"

/* Worker */
import { TWorker } from "../types/data/accounts/worker"

/* Client */
import { TClient } from "../types/data/client"

/* Product */
import { TProduct } from "../types/data/product"

/* Color */
import { TColor } from "../types/data/color"

/* Model */
import { TModel } from "../types/data/model"

/* Product Type */
import { TProdType } from "../types/data/prodType"

/* Production Line */
import { TProductionLineBeltProduct } from "../types/data/productionLine/productGroup/productionLineBeltProduct"
import { TProductionLine } from "../types/data/productionLine"

type Props = {
  productionLines: TProductionLine[]
  products: TProduct[]
  prodTypes: TProdType[]
  colors: TColor[]
  models: TModel[]
  orders: ({ id: string } & TDBOrder)[]
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
    const order = orders.find((ord) => pLine.order === ord.id) as TDBOrder & {
      id: string
    }

    const client = clients.find((c) => order.client === c.id) as TClient

    let status: TProductionLine["status"] = "queued"

    const pds: TProductionLine["products"] = pLine.products.map((pGroup) => {
      const product = products.find((p) => p.id === pGroup.id) as TProduct

      const c = colors.find((col) => col.code === product.color) as TColor
      const m = models.find((mod) => mod.id === product.model) as TModel
      const t = prodTypes.find((pt) => pt.code === m.type) as TProdType

      let pgStatus: TProductionLine["status"] = "queued"

      const list: TProductionLineBeltProduct[] = pGroup.list.map(
        (pd, index) => {
          const w = pd.inCharge
            ? workers.find((wk) => wk.id === pd.inCharge.id)
            : null

          const prod: TProductionLineBeltProduct = {
            index: index + 1,
            inCharge: w
              ? {
                  id: w.id,
                  name: w.name,
                  attributionDate: new Date().getTime(),
                }
              : null,
            productionId: pd.productionId,
            status: pd.status,
          }

          if (TOPStatusWeight[pd.status] > TOPStatusWeight[pgStatus])
            pgStatus = pd.status
          return prod
        }
      )

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
      client: client.id,
      order: order.id,
      products: pds,
      quantity: pds.length,
      status: status,
    }

    list.push(obj)
  })

  return list
}

export default parseProductionLines
