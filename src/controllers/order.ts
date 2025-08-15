import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../network/firebase"

import { TNewOrder } from "../utils/types/data/order"

import { parseFbDocs } from "../utils/parsers/fbDoc"
import { newOrderValidator, orderValidator } from "../utils/validators/order"
import parseOrder from "../utils/parsers/parseOrder"
import { treatData } from "../utils/parsers/treatData"
import { TFBProductionLine } from "../utils/types/data/productionLine"

import { getCustomError } from "../utils/helpers/getCustomError"
import { parseOrdersPageList } from "../utils/parsers/listsPages/orders"
import { TCity } from "../utils/types/data/city"
import { TState } from "../utils/types/data/state"
import { getParsedCollections } from "../network/firebase/collectionsHelpers"
import SERVICES from "../services"

export const getOrdersListPage = async (req: Request, res: Response) => {
  try {
    const shippingStatus = req.query.shippingStatus as
      | "todo"
      | "waitingShip"
      | "shipped"

    const orderConditions: fb.QueryFieldFilterConstraint[] =
      shippingStatus === "todo"
        ? [fb.where("status", "!=", "done")]
        : shippingStatus === "shipped"
        ? [fb.where("status", "==", "done"), fb.where("shippedAt", "!=", null)]
        : [fb.where("status", "==", "done"), fb.where("shippedAt", "==", null)]

    const {
      colOrders,
      colClients,
      colEmmitters,
      colRepresentatives,
      colProductTypes,
      colColors,
      colModels,
      colProducts,
      colProductionLines,
    } = await getParsedCollections(
      [
        "orders",
        "clients",
        "emmitters",
        "representatives",
        "productTypes",
        "colors",
        "models",
        "products",
      ],
      {
        orders: orderConditions,
      }
    )

    // -----

    const clientsCities = colClients.map((client) => client.address.city)
    const clientsStates = colClients.map((client) => client.address.state)

    const cities =
      clientsCities.length > 0
        ? (parseFbDocs(
            await fb.getDocs(
              fb.query(
                collections.cities,
                fb.where("__name__", "in", clientsCities)
              )
            )
          ) as TCity[])
        : []

    const states =
      clientsStates.length > 0
        ? (parseFbDocs(
            await fb.getDocs(
              fb.query(
                collections.states,
                fb.where("__name__", "in", clientsStates)
              )
            )
          ) as TState[])
        : []

    const list = parseOrdersPageList({
      clients: colClients,
      orders: colOrders,
      cities: cities,
      states: states,
      emmitters: colEmmitters,
      representatives: colRepresentatives,

      productTypes: colProductTypes,
      products: colProducts,
      colors: colColors,
      models: colModels,
      productionLines: colProductionLines,
    })

    res.status(200).json({ success: true, data: { list } })
  } catch (error) {
    console.log("Error", error)
    res.status(400).json(getCustomError(error))
  }
}

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { colOrders } = await getParsedCollections(["orders"])

    res.json({ success: true, data: { list: colOrders } })
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(204).json({ success: false, error: true })
  }
}

export const getOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id
    const ref = fb.doc(collections.orders, orderId)
    const fbOrder = await fb.getDoc(ref)

    if (fbOrder.exists()) {
      const { colProducts, colColors, colProductTypes, colModels } =
        await getParsedCollections([
          "products",
          "colors",
          "productTypes",
          "models",
        ])

      const order = parseOrder({
        order: { ...fbOrder.data(), id: fbOrder.id } as any,
        colors: colColors,
        prodTypes: colProductTypes,
        models: colModels,
        products: colProducts,
      })

      res.json({ success: true, data: { order: order } })
    } else {
      throw new Error("Este pedido não existe")
    }
  } catch (error) {
    res.json({ success: false, error: { message: error } })
  }
}

export const addOrder = async (req: Request, res: Response) => {
  try {
    const data = req.body as TNewOrder

    /* 1. Validate data */
    const validation = newOrderValidator(data)

    if (validation.ok) {
      const { colProducts: orderProducts } = await getParsedCollections(
        ["products"],
        {
          products: [
            fb.where(
              "id",
              "in",
              data.products.map((p) => p.id)
            ),
          ],
        }
      )

      /* 2. Get last order code */
      const newOrderCode = await SERVICES.Order.getNewOrderCode()

      /* 3. Treat data */
      const orderData = treatData("newOrder", data, {
        newOrderCode,
        orderProducts,
      })

      /* 4. Register order */
      const newOrder = await SERVICES.Order.registerOrder(orderData)
      if (newOrder.success === false) throw new Error(newOrder.error)

      let requiresNewProductLine: Partial<TFBProductionLine> | undefined =
        undefined

      /* 5. Update products count in storage */
      newOrder.data.products.forEach(async (product) => {
        const prodObj = orderProducts.find((p) => p.id === product.id)

        if (prodObj && prodObj.storage.has) {
          await SERVICES.Products.reduceStorageCount(
            product.id,
            prodObj.storage.quantity - product.quantity
          )
        }
      })

      /* 6. Create production line if needed */
      if (requiresNewProductLine)
        await SERVICES.ProductionLine.registerProductionLine(
          newOrder.data,
          orderProducts
        )

      res.status(200).json({ success: true, data: newOrder.data })
    } else {
      const fieldsStr = validation.fields.join(", ")
      throw new Error(`Verifique os campos (${fieldsStr}) e tente novamente.`)
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Houve um erro. Tente novamente" })
  }
}

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const data = req.body

    if (orderValidator(data)) {
      const ref = fb.doc(collections.orders, data.id)
      await fb.updateDoc(ref, data)
      const docData = data

      res.status(200).json({ success: true, data: docData })
    } else {
      res.status(400).json({
        success: false,
        error: "Verifique os campos e tente novamente",
      })
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Houve um erro. Tente novamente" })
  }
}

export const shipOrder = async (req: Request, res: Response) => {
  try {
    const data = req.body

    const { orderId, shippedAt } = data

    if (orderId && shippedAt && !Number.isNaN(+shippedAt)) {
      const ref = fb.doc(collections.orders, orderId)
      await fb.updateDoc(ref, { shippedAt })

      // Remove productionLine
      const productionLineDocs = await fb.getDocs(
        fb.query(collections.productionLines, fb.where("order", "==", orderId))
      )

      if (productionLineDocs.size === 1) {
        const productionLineRef = productionLineDocs.docs[0].ref
        await fb.deleteDoc(productionLineRef)
      }

      const docData = data

      res.status(200).json({ success: true, data: docData })
    } else {
      res.status(400).json({
        success: false,
        error: "Verifique a data e tente novamente",
      })
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Houve um erro. Tente novamente" })
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const ref = fb.doc(collections.orders, id)
    await fb.deleteDoc(ref)

    res.status(200).json({ success: true })
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Houve um erro. Tente novamente" })
  }
}
