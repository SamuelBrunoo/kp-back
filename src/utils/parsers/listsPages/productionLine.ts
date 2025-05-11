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
  TPageListPLProducts,
  TProductionLine,
  TPageListPLProductsDetailsOrders,
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
}: Props): TPageListProductionLine["order"][] => {
  let list: TPageListProductionLine["order"][] = []

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

      const orderStatusName = Object.entries(TOPStatusWeight).find(
        ([key, value]) => value === currentOrderStatusWeight
      )[0] as TOPStatus

      // const orderStatus: TOPStatus = orderProductStatusRelation[orderStatusName]
      const orderStatus = orderStatusName

      // Attributions
      let attributions: TPageListProductionLine["order"]["details"]["attributions"] =
        []

      // Products
      let orderProductsDetails: TPageListProductionLine["order"]["details"]["products"] =
        []

      i.products.forEach((p) => {
        const product = products.find((prod) => prod.id === p.id)
        const color = colors.find((col) => col.code === product.color)
        const model = models.find((mod) => mod.id === product.model)
        const type = productTypes.find((type) => type.code === product.type)

        const list: TPageListProductionLine["order"]["details"]["products"][number]["list"] =
          p.list.map((listItem) => ({
            code: product.code,
            color: color.name,
            lineNumber: listItem.index,
            productId: p.id,
            productionId: listItem.productionId,
          }))

        // Order products details
        const orderProductsDetailsItem: TPageListProductionLine["order"]["details"]["products"][number] =
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

          const attributionItem: TPageListProductionLine["order"]["details"]["attributions"][number] =
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
              productId: p.id,
              productionId: pListItem.productionId,
            }

          attributions.push(attributionItem)
        })

        orderProductsDetails.push(orderProductsDetailsItem)
      })

      const obj: TPageListProductionLine["order"] = {
        id: i.id,
        orderCode: order.code,
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

export const parseProductionLinePageListByProducts = ({
  clients,
  orders,

  productTypes,
  products,
  colors,
  models,
  productionLines,

  workers,
}: Props): TPageListPLProducts[] => {
  let list: TPageListPLProducts[] = []

  try {
    let modelsIds: string[] = []

    let productionProductsList: TProductionLine["products"][number]["list"] = []

    // Products Object Indexation
    let prodOI: {
      [key: string]: {
        id: string
        modelName: string
        onProduction: number
        orders: number
        status: string
        type: string
        productId: string
        productionId: string
        index: number
        incharge: {
          id: string
          name: string
        } | null
        attributedAt: number | null
      }[]
    } = {}

    productionLines.forEach((i) => {
      i.products.forEach((p) => {
        const product = products.find((prod) => prod.id === p.id)
        const model = models.find((mod) => mod.id === product.model)
        const type = productTypes.find((type) => type.code === product.type)

        if (!modelsIds.includes(p.id)) modelsIds.push(model.id)

        productionProductsList.push(...p.list)

        const oiItems: {
          id: string
          modelName: string
          onProduction: number
          orders: number
          status: string
          type: string
          productId: string
          productionId: string
          index: number
          incharge: {
            id: string
            name: string
          } | null
          attributedAt: number | null
        }[] = p.list.map((pItem) => {
          return {
            id: p.id,
            modelName: model.name,
            onProduction: 1,
            orders: 1,
            status: p.status,
            type: type.name,
            attributedAt: pItem.inCharge
              ? pItem.inCharge.attributionDate
              : null,
            incharge: pItem.inCharge
              ? {
                  id: pItem.inCharge.id,
                  name: pItem.inCharge.name,
                }
              : null,
            index: pItem.index,
            productId: p.id,
            productionId: pItem.productionId,
          }
        })

        if (prodOI[model.id])
          prodOI[model.id] = [...prodOI[model.id], ...oiItems]
        else prodOI[model.id] = [...oiItems]
      })

      // Order Status
      let currentOrderStatusWeight = 1
      i.products.forEach((p) => {
        const statusWeight = TOPStatusWeight[p.status]
        currentOrderStatusWeight = Math.max(
          statusWeight,
          currentOrderStatusWeight
        )
      })
    })

    modelsIds.forEach((mid) => {
      // Readable data
      const model = models.find((mod) => mod.id === mid)
      const type = productTypes.find((type) => type.code === model.type)

      const ordersList: TPageListPLProductsDetailsOrders[] = orders
        .filter((o) =>
          o.products.some(
            (p) => products.find((prod) => prod.id === p.id).model === mid
          )
        )
        .map(
          (ord, ordKey) =>
            ({
              clientName: clients.find((c) => c.id === ord.client).clientName,
              orderDate: dateFns.format(ord.orderDate, "dd/MM/yyyy"),
              deadline: dateFns.format(ord.deadline, "dd/MM/yyyy"),
              index: ordKey,
              orderNumber: ord.code,
            } as TPageListPLProductsDetailsOrders)
        )

      // Order Status
      let currentOrderStatusWeight = 1

      // Attributions
      let attributions: TPageListPLProducts["details"]["attributions"] = []

      prodOI[mid].forEach((p) => {
        /*
          productId
          productionId
          index
          incharge { id, name }
          attributedAt

        */
        // Readable data
        const product = products.find((prod) => prod.id === p.id)
        const color = colors.find((col) => col.code === product.color)

        // Status
        const statusWeight = TOPStatusWeight[p.status]
        currentOrderStatusWeight = Math.max(
          statusWeight,
          currentOrderStatusWeight
        )

        // Attribution
        const attributionData: TPageListPLProducts["details"]["attributions"][number] =
          {
            attributedAt: dateFns.format(p.attributedAt, "dd/MM/yyyy"),
            color: color.name,
            index: p.index,
            responsable: workers.find((w) => w.id === ""),
            status: orderProductStatusRelation[p.status],
          }

        attributions.push(attributionData)
      })

      const resumeStatus: TOPStatus =
        orderProductStatusRelation[currentOrderStatusWeight]

      const obj: TPageListPLProducts = {
        id: mid,
        details: {
          ordersList: ordersList,
          attributions: attributions,
        },
        modelName: model.name,
        orders: orders.length,
        status: resumeStatus,
        type: type.name,
        onProduction: prodOI[mid].length,
      }

      list.push(obj)
    })
  } catch (error) {
    console.error(error)
  }

  return list
}

/*

  1. Listar os produtos (ids)
  2. Para cada um, listar os pedidos que o contém
  3. Listar todos os em produção pelo id de produção dele
  4. Ver quem está responsável por cada um desses ids de produção (produtos) e inserir na lista de atribuições

*/
