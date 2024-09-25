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
import parseOrders from "../utils/parsers/parseOrders"
import parseOrder from "../utils/parsers/parseOrder"
import { treatData } from "../utils/parsers/treatData"
import {
  TFBLineProduct,
  TFBProductionLine,
  TNewProductLine,
  TProductionLine,
} from "../utils/types/data/productionLine"

import { v4 as uuid } from "uuid"

export const getOrders = async (req: Request, res: Response) => {
  try {
    let colOrders: TFBOrder[] = []
    let colClients: TClient[] = []
    let colEmmitters: TEmmitter[] = []
    let colRepresentatives: TRepresentative[] = []
    let colProdTypes: TProdType[] = []
    let colColors: TColor[] = []
    let colModels: TModel[] = []
    let colProducts: TProduct[] = []

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
    ]

    await Promise.all(pms)

    const list = parseOrders({
      orders: colOrders as any,
      clients: colClients,
      emmitters: colEmmitters,
      representatives: colRepresentatives,
      prodTypes: colProdTypes,
      colors: colColors,
      models: colModels,
      products: colProducts,
    })

    res.json({ success: true, data: { list } })
  } catch (error) {
    res.status(204).json({ success: false, error: true })
  }
}

export const getOrder = async (req: Request, res: Response) => {
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

export const addOrder = async (req: Request, res: Response) => {
  try {
    let colProducts: TProduct[] = []
    let colProductionLines: TProductionLine[] = []

    const pms = [
      fb.getDocs(fb.query(collections.products)).then((res) => {
        colProducts = parseFbDocs(res as any) as TProduct[]
      }),
      fb.getDocs(fb.query(collections.productionLines)).then((res) => {
        colProductionLines = parseFbDocs(res as any) as TProductionLine[]
      }),
    ]

    await Promise.all(pms)

    const data = req.body

    if (orderValidator(data)) {
      const lastOrder = (
        await fb.getDocs(
          fb.query(collections.orders, fb.orderBy("code", "desc"), fb.limit(1))
        )
      ).docs[0].data() as TFBOrder

      const newCode = Number(lastOrder.code) + 1
      const treated = treatData("newOrder", data, { newCode })

      const info: TNewOrder = data
      const clientRef = fb.doc(collections.clients, info.client)
      const clientDoc = await fb.getDoc(clientRef)
      const client = { ...clientDoc.data(), id: clientDoc.id } as TClient

      // Register Order
      const doc = await fb.addDoc(collections.orders, treated)
      const docData = { ...treated, id: doc.id } as TFBOrder

      // TODO: production line creator helper

      let newProductLine: TNewProductLine | undefined = undefined

      info.products.forEach((product) => {
        const prodSubj = colProducts.find((p) => p.id === product.id)

        if (prodSubj && prodSubj.storage.has) {
          const hasInStorage = prodSubj.storage.quantity - product.quantity >= 0

          if (!hasInStorage) {
            const missing = product.quantity - prodSubj.storage.quantity

            if (!newProductLine) {
              newProductLine = {
                order: {
                  id: doc.id,
                  code: docData.code,
                  client: {
                    id: client.id,
                    name: client.name,
                    socialRole: client.socialRole,
                  },
                  orderDate: info.orderDate,
                  deadline: info.deadline,
                },
                status: "queued",
                quantity: 0,
                products: [],
              }
            }

            let plProducts: TFBLineProduct[] = []

            for (let i = 1; i <= missing; i++) {
              const newId = uuid()

              const pToDo: TFBLineProduct = {
                id: product.id,
                status: "queued",
                productionId: newId,
                inCharge: "",
              }

              plProducts.push(pToDo)
            }

            newProductLine.quantity = plProducts.length
            newProductLine.products = plProducts
          }

          // update product quantity
          const stillTodo = product.quantity - prodSubj.storage.quantity
          const willBeEmpty = prodSubj.storage.quantity - stillTodo

          fb.updateDoc(fb.doc(collections.products, prodSubj.id), {
            storage: {
              has: prodSubj.storage.has,
              quantity: willBeEmpty ? 0 : stillTodo,
            },
          })
        }
      })

      // register new product line document
      if (newProductLine) {
        await fb.addDoc(collections.productionLines, newProductLine)
      }

      res.status(200).json({ success: true, data: docData })
    } else {
      res.status(400).json({
        success: false,
        error: "Verifique os campos e tente novamente",
      })
    }
  } catch (error) {
    console.log(error)
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
