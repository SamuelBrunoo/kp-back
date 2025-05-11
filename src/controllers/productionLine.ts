import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../services/firebase"

import { TBaseClient, TClient } from "../utils/types/data/client"
import { TRepresentative } from "../utils/types/data/representative"
import { TBasicOrder, TFBOrder } from "../utils/types/data/order"
import { TModel } from "../utils/types/data/model"
import { TBasicProduct, TProduct } from "../utils/types/data/product"
import { TProdType } from "../utils/types/data/prodType"
import { TColor } from "../utils/types/data/color"
import { TEmmitter } from "../utils/types/data/emmiter"

import { parseFbDoc, parseFbDocs } from "../utils/parsers/fbDoc"
import parseOrder from "../utils/parsers/parseOrder"
import {
  TAttribution,
  TFBProductionLine,
  TProductionLine,
} from "../utils/types/data/productionLine"

import parseProductionLines from "../utils/parsers/parseProductionLines"
import { TWorker } from "../utils/types/data/worker"
import {
  parseProductionLinePageList,
  parseProductionLinePageListByProducts,
} from "../utils/parsers/listsPages/productionLine"
import { getCustomError } from "../utils/helpers/getCustomError"
import { extractProductionUpdates } from "../utils/helpers/productionLine"
import { extractOrderProductionUpdates } from "../utils/helpers/order"

export const getProductionLinesListPage = async (
  req: Request,
  res: Response
) => {
  try {
    const { showType } = req.params

    const colClients = parseFbDocs(
      await fb.getDocs(fb.query(collections.clients))
    ) as TBaseClient[]
    const colOrders = parseFbDocs(
      await fb.getDocs(
        fb.query(collections.orders, fb.where("status", "!=", "done"))
      )
    ) as TBasicOrder[]

    const colProductTypes = parseFbDocs(
      await fb.getDocs(fb.query(collections.productTypes))
    ) as TProdType[]

    const colProducts = parseFbDocs(
      await fb.getDocs(fb.query(collections.products))
    ) as TBasicProduct[]

    const colColors = parseFbDocs(
      await fb.getDocs(fb.query(collections.colors))
    ) as TColor[]

    const colModels = parseFbDocs(
      await fb.getDocs(fb.query(collections.models))
    ) as TModel[]

    const colProductionLines = parseFbDocs(
      await fb.getDocs(fb.query(collections.productionLines))
    ) as TProductionLine[]

    const colWorkers = parseFbDocs(
      await fb.getDocs(fb.query(collections.workers))
    ) as TWorker[]

    const list =
      showType === "orders"
        ? parseProductionLinePageList({
            clients: colClients,
            orders: colOrders,
            productTypes: colProductTypes,
            products: colProducts,
            colors: colColors,
            models: colModels,
            productionLines: colProductionLines,
            workers: colWorkers,
          })
        : parseProductionLinePageListByProducts({
            clients: colClients,
            orders: colOrders,
            productTypes: colProductTypes,
            products: colProducts,
            colors: colColors,
            models: colModels,
            productionLines: colProductionLines,
            workers: colWorkers,
          })

    res.status(200).json({ success: true, data: { list, workers: colWorkers } })
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const getProductionLines = async (req: Request, res: Response) => {
  try {
    let colOrders: TFBOrder[] = []
    let colClients: TClient[] = []
    let colEmmitters: TEmmitter[] = []
    let colRepresentatives: TRepresentative[] = []
    let colProdTypes: TProdType[] = []
    let colColors: TColor[] = []
    let colModels: TModel[] = []
    let colProducts: TProduct[] = []
    let colProductionLines: TFBProductionLine[] = []
    let colWorkers: TWorker[] = []

    const pms = [
      fb.getDocs(fb.query(collections.orders)).then((res) => {
        colOrders = parseFbDocs(res as any) as TFBOrder[]
      }),
      fb.getDocs(fb.query(collections.clients)).then((res) => {
        colClients = parseFbDocs(res as any) as TClient[]
      }),
      fb.getDocs(fb.query(collections.emmitters)).then((res) => {
        colEmmitters = parseFbDocs(res as any) as TEmmitter[]
      }),
      fb.getDocs(fb.query(collections.representatives)).then((res) => {
        colRepresentatives = parseFbDocs(res as any) as TRepresentative[]
      }),
      fb.getDocs(fb.query(collections.productTypes)).then((res) => {
        colProdTypes = parseFbDocs(res as any) as TProdType[]
      }),
      fb.getDocs(fb.query(collections.colors)).then((res) => {
        colColors = parseFbDocs(res as any) as TColor[]
      }),
      fb.getDocs(fb.query(collections.models)).then((res) => {
        colModels = parseFbDocs(res as any) as TModel[]
      }),
      fb.getDocs(fb.query(collections.products)).then((res) => {
        colProducts = parseFbDocs(res as any) as TProduct[]
      }),
      fb.getDocs(fb.query(collections.productionLines)).then((res) => {
        colProductionLines = parseFbDocs(res as any) as (TFBProductionLine & {
          id: string
        })[]
      }),
      fb.getDocs(fb.query(collections.workers)).then((res) => {
        colWorkers = parseFbDocs(res as any) as TWorker[]
      }),
    ]

    await Promise.all(pms)

    const list = parseProductionLines({
      productionLines: colProductionLines,
      orders: colOrders as any,
      clients: colClients,
      prodTypes: colProdTypes,
      colors: colColors,
      models: colModels,
      products: colProducts,
      workers: colWorkers,
    })

    res.json({ success: true, data: { list } })
  } catch (error) {
    console.error(error)
    res.status(204).json({ success: false, error: true })
  }
}

export const getProductionLine = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id
    const ref = fb.doc(collections.orders, orderId)
    const fbOrder = await fb.getDoc(ref)

    if (fbOrder.exists()) {
      let colProdTypes: TProdType[] = []
      let colColors: TColor[] = []
      let colModels: TModel[] = []
      let colProducts: TProduct[] = []

      const pms = [
        fb.getDocs(fb.query(collections.productTypes)).then((res) => {
          colProdTypes = parseFbDocs(res as any) as TProdType[]
        }),
        fb.getDocs(fb.query(collections.colors)).then((res) => {
          colColors = parseFbDocs(res as any) as TColor[]
        }),
        fb.getDocs(fb.query(collections.models)).then((res) => {
          colModels = parseFbDocs(res as any) as TModel[]
        }),
        fb.getDocs(fb.query(collections.products)).then((res) => {
          colProducts = parseFbDocs(res as any) as TProduct[]
        }),
      ]

      await Promise.all(pms)

      const order = parseOrder({
        order: { ...fbOrder.data(), id: fbOrder.id } as any,
        colors: colColors,
        prodTypes: colProdTypes,
        models: colModels,
        products: colProducts,
      })

      res.json({
        success: true,
        data: { order: order },
      })
    } else {
      throw new Error("Este pedido não existe")
    }
  } catch (error) {
    res.json({ success: false, error: { message: error } })
  }
}

export const addProductionLine = async (req: Request, res: Response) => {
  try {
    // ...
  } catch (error) {
    console.error(error)
    res
      .status(400)
      .json({ success: false, error: "Houve um erro. Tente novamente" })
  }
}

export const updateProductionLine = async (req: Request, res: Response) => {
  try {
    const incomingData = req.body as
      | undefined
      | {
          id: string
          products: TAttribution[]
        }

    const productionLineId = req.params.id
    const ref = fb.doc(collections.productionLines, productionLineId)
    const fbProductionLineDoc = await fb.getDoc(ref)

    if (fbProductionLineDoc.exists()) {
      const fbProductionLine = parseFbDoc(
        fbProductionLineDoc
      ) as TFBProductionLine

      const orderId = fbProductionLine.order
      const orderRef = fb.doc(collections.orders, orderId)
      const fbOrder = await fb.getDoc(orderRef)

      if (fbOrder.exists()) {
        let order: TFBOrder = fbOrder.data() as TFBOrder

        const newProductionLineObj: TFBProductionLine =
          extractProductionUpdates(incomingData.products, fbProductionLine)

        const newOrderObj: TFBOrder = extractOrderProductionUpdates(
          newProductionLineObj.products,
          order
        )

        // Update Order
        await fb.updateDoc(orderRef, newOrderObj)

        // Update Production Line
        await fb.updateDoc(ref, newProductionLineObj)
        const docData = newProductionLineObj

        res.status(200).json({ success: true, data: docData })
      } else throw new Error("Este pedido não existe ou já foi concluído")
    } else throw new Error("Esta produção não existe ou já foi concluída")
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const deleteProductionLine = async (req: Request, res: Response) => {
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
