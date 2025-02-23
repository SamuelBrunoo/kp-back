import { paymentRelation } from "../../relations/payment"
import { orderProductStatusRelation } from "../../relations/status"
import { TCity } from "../../types/data/city"
import { TBaseClient, TClient, TPageListClient } from "../../types/data/client"
import { TColor } from "../../types/data/color"
import { TBasicEmmitter, TEmmitter } from "../../types/data/emmiter"
import { TModel } from "../../types/data/model"
import {
  TBasicOrder,
  TOPStatus,
  TOPStatusWeight,
  TPageListOrder,
} from "../../types/data/order"
import { TProdType } from "../../types/data/prodType"
import { TBasicProduct } from "../../types/data/product"
import {
  TPageListProductionLine,
  TProductionLine,
} from "../../types/data/productionLine"

import dateFns from "date-fns"
import { TWorker } from "../../types/data/worker"

type Props = {
  clients: TBaseClient[]
  orders: TBasicOrder[]

  productTypes: TProdType[]
  products: TBasicProduct[]
  colors: TColor[]
  models: TModel[]
  productionLines: TProductionLine[]
  workers: TWorker[]
}

export const parseProductionLinePageList = ({
  clients,
  orders,

  productTypes,
  products,
  colors,
  models,
  productionLines,

  workers,
}: Props): TPageListProductionLine[] => {
  let list: TPageListProductionLine[] = []

  try {
    productionLines.forEach((i) => {
      const client = clients.find((c) => c.id === i.client)
      const order = orders.find((o) => o.id === i.order)

      // Order Status
      let currentOrderStatusWeight = 1
      i.products.forEach((p) => {
        const statusWeight = TOPStatusWeight[p.status]
        currentOrderStatusWeight = Math.max(
          statusWeight,
          currentOrderStatusWeight
        )
      })

      const orderStatus: TOPStatus =
        orderProductStatusRelation[currentOrderStatusWeight]

      // Attributions
      let attributions: TPageListProductionLine["details"]["attributions"] = []

      // Products
      let orderProductsDetails: TPageListProductionLine["details"]["products"] =
        []

      i.products.forEach((p) => {
        const product = products.find((prod) => prod.id === p.id)
        const color = colors.find((col) => col.code === product.color)
        const model = models.find((mod) => mod.id === product.model)
        const type = productTypes.find((type) => type.code === product.type)

        const list: TPageListProductionLine["details"]["products"][number]["list"] =
          p.list.map((listItem) => ({
            code: product.code,
            color: color.name,
            lineNumber: listItem.index,
          }))

        // Order products details
        const orderProductsDetailsItem: TPageListProductionLine["details"]["products"][number] =
          {
            code: product.code,
            model: model.name,
            quantity: p.list.length,
            type: type.name,
            list: list,
          }

        // Attributions
        p.list.forEach((pListItem) => {
          const modelName = model.name
          const colorName = color.name
          const worker = pListItem.inCharge ?? null

          const attributionItem: TPageListProductionLine["details"]["attributions"][number] =
            {
              number: pListItem.index,
              responsable: worker,
              color: colorName,
              attributedAt: worker
                ? dateFns.format(worker.attributionDate, "dd/MM/yyyy")
                : null,
              code: product.code,
              model: modelName,
              status: pListItem.status,
            }

          attributions.push(attributionItem)
        })

        orderProductsDetails.push(orderProductsDetailsItem)
      })

      const obj: TPageListProductionLine = {
        id: i.id,
        clientName: client.clientName,
        orderDate: dateFns.format(order.orderDate, "dd/MM/yyyy"),
        onProduction: i.products
          .map((prod) => prod.list.length)
          .reduce((prev, next) => prev + next, 0),
        status: orderStatus,
        details: {
          products: orderProductsDetails,
          attributions: attributions,
        },
      }

      list.push(obj)
    })
  } catch (error) {
    console.error(error)
  }

  return list
}
