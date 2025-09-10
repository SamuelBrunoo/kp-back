import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import app from "../network/firebase"
import { getCustomError } from "../utils/helpers/getCustomError"
import { TBasicOrder, TOrder } from "../utils/types/data/order"
import { parseFbDocs } from "../utils/parsers/fbDoc"
import { sumOrdersValues } from "../utils/helpers/sumOrdersValues"
import { matchDay, matchYear } from "../utils/helpers/date/index.ts/matchDay"
import { TBaseClient } from "../utils/types/data/client"
import { TBasicProduct } from "../utils/types/data/product"
import {
  parseProductsToBestSeller,
  ParserBastSellerProps,
} from "../utils/parsers/data/products/betsSeller"
import {TDBModel } from "../utils/types/data/model"
import { TProdType } from "../utils/types/data/prodType"
import { TColor } from "../utils/types/data/color"

const firestore = fb.getFirestore(app)

// # Collections
const collections = {
  productTypes: fb.collection(firestore, "productTypes"),
  models: fb.collection(firestore, "models"),
  products: fb.collection(firestore, "products"),
  colors: fb.collection(firestore, "colors"),
  clients: fb.collection(firestore, "clients"),
  orders: fb.collection(firestore, "orders"),
  production: fb.collection(firestore, "production"),
}

export const getAdminDashboardInfo = async (req: Request, res: Response) => {
  try {
    const baseOrders = parseFbDocs(
      await fb.getDocs(fb.query(collections.orders))
    ) as TBasicOrder[]

    const clientsIds = [...new Set(baseOrders.map((o) => o.client).flat())]

    const clients = parseFbDocs(
      await fb.getDocs(
        fb.query(collections.clients, fb.where("__name__", "in", clientsIds))
      )
    ) as TBaseClient[]

    const orders = baseOrders.map((o) => ({
      ...o,
      client: clients.find((c) => c.id),
    })) as TOrder[]

    /* Products */
    const baseProductTypes = parseFbDocs(
      await fb.getDocs(fb.query(collections.productTypes))
    ) as TProdType[]

    const baseModels = parseFbDocs(
      await fb.getDocs(fb.query(collections.models))
    ) asTDBModel[]

    const baseColors = parseFbDocs(
      await fb.getDocs(fb.query(collections.colors))
    ) as TColor[]

    const selledProducts = orders
      .map((o) => o.products.map((p) => ({ id: p.id, quantity: p.quantity })))
      .flat()
    const unduplicatedIds = [...new Set(selledProducts.map((i) => i.id))]

    const selledProductsRelations = {
      ids: unduplicatedIds,
      counts: unduplicatedIds
        .map((i) => ({
          id: i,
          total: selledProducts.reduce(
            (total, current) =>
              current.id === i ? total + current.quantity : total,
            0
          ) as number,
        }))
        .sort((a, b) => (a.total >= b.total ? 1 : -1)),
    }

    const baseProducts = parseFbDocs(
      await fb.getDocs(
        fb.query(
          collections.products,
          fb.where("__name__", "in", selledProductsRelations.ids)
        )
      )
    ) as TBasicProduct[]

    const prodsToParse: ParserBastSellerProps["product"][] = baseProducts.map(
      (bp, bpKey) => ({
        ...bp,
        key: bpKey,
        count: selledProductsRelations["counts"].find((i) => i.id === bp.id)
          .total,
      })
    )

    const bestSellers = parseProductsToBestSeller({
      products: prodsToParse,
      models: baseModels,
      productTypes: baseProductTypes,
      colors: baseColors,
    })

    /* Sells values */
    const d = new Date()

    const datePoints = {
      firstYearMonth: new Date(d.getFullYear(), d.getMonth() + 1).getTime(),
      lastYearMonth: new Date(d.getFullYear(), d.getMonth() + 1).getTime(),
      nextMonth: new Date(d.getFullYear(), d.getMonth() + 1).getTime(),
      currentMonth: new Date(d.getFullYear(), d.getMonth()).getTime(),
      lastMonth: new Date(d.getFullYear(), d.getMonth() - 1).getTime(),
      pastMonth: new Date(d.getFullYear(), d.getMonth() - 2).getTime(),
    }

    const currentMonthSells = orders.filter(
      (o) =>
        o.status === "done" &&
        datePoints.nextMonth > o.orderDate &&
        o.orderDate >= datePoints.currentMonth
    )

    const lastMonthSells = orders.filter(
      (o) =>
        o.status === "done" &&
        datePoints.currentMonth > o.orderDate &&
        o.orderDate >= datePoints.lastMonth
    )

    const pastMonthSells = orders.filter(
      (o) =>
        o.status === "done" &&
        datePoints.lastMonth > o.orderDate &&
        o.orderDate >= datePoints.pastMonth
    )

    const yearSells = orders.filter((o) =>
      o.status === "done" && o.shippedAt
        ? matchYear(o.shippedAt, d.getTime())
        : false
    )

    /* Orders */

    const shippedToday = orders
      .filter((o) => (o.shippedAt ? matchDay(o.shippedAt, d.getTime()) : false))
      .sort((a, b) => (a.code >= b.code ? -1 : 1))

    const waitingToShip = orders
      .filter((o) => o.status === "done" && !o.shippedAt)
      .sort((a, b) => (a.code >= b.code ? -1 : 1))

    const onProduction = orders
      .filter((o) => o.status !== "done" && o.status !== "queued")
      .sort((a, b) => (a.code >= b.code ? -1 : 1))
    const lastOrders = orders
      .filter((o) => o.status === "queued")
      .sort((a, b) => (a.code >= b.code ? -1 : 1))

    /* Result object */

    const obj = {
      monthlySells: {
        current: sumOrdersValues(currentMonthSells),
        last: sumOrdersValues(lastMonthSells),
        past: sumOrdersValues(pastMonthSells),
      },
      totalSells: {
        balance: sumOrdersValues(yearSells) - 0,
        sells: sumOrdersValues(yearSells),
        spends: 0,
      },
      bastSellers: bestSellers,
      orders: {
        shippedToday: shippedToday,
        waitingToShip: waitingToShip,
        production: onProduction,
        lastOrders: lastOrders,
      },
    }

    res.status(200).json({ success: true, data: obj })
  } catch (error) {
    res.status(400).json({ success: false, error: getCustomError(error) })
  }
}
