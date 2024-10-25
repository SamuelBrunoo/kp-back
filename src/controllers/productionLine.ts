import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../services/firebase"

import { TClient } from "../utils/types/data/client"
import { TRepresentative } from "../utils/types/data/representative"
import { TFBOrder, TNewOrder } from "../utils/types/data/order"
import { TModel } from "../utils/types/data/model"
import { TProduct } from "../utils/types/data/product"
import { TProdType } from "../utils/types/data/prodType"
import { TColor } from "../utils/types/data/color"
import { TEmmitter } from "../utils/types/data/emmiter"

import { parseFbDocs } from "../utils/parsers/fbDoc"
import { orderValidator } from "../utils/validators/order"
import parseOrder from "../utils/parsers/parseOrder"
import { treatData } from "../utils/parsers/treatData"
import {
  TFBLineProduct,
  TFBProductionLine,
  TNewProductLine,
  TProductionLine,
} from "../utils/types/data/productionLine"

import { v4 as uuid } from "uuid"
import parseProductionLines from "../utils/parsers/parseProductionLines"
import { TWorker } from "../utils/types/data/worker"

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
    console.log(error)
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
    console.log(error)
    res
      .status(400)
      .json({ success: false, error: "Houve um erro. Tente novamente" })
  }
}

export const updateProductionLine = async (req: Request, res: Response) => {
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
