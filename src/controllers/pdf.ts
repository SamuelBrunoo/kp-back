import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../network/firebase"
import { parseFbDoc, parseFbDocs } from "../utils/parsers/fbDoc"
import { TClient } from "../utils/types/data/client"
import { TRepresentative } from "../utils/types/data/representative"
import { TProduct } from "../utils/types/data/product"
import { TProdType } from "../utils/types/data/prodType"
import { TColor } from "../utils/types/data/color"
import { TEmmitter } from "../utils/types/data/emmiter"
import { TModel } from "../utils/types/data/model"
import { getCustomError } from "../utils/helpers/getCustomError"
import { TBasicOrder } from "../utils/types/data/order"
import { generateOrderPdf } from "../utils/pdf/order"
import parseOrders from "../utils/parsers/parseOrders"
import parseProducts from "../utils/parsers/parseProducts"

export const getOrderPdf = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.query
    const forAdmin = req.query.forAdmin && req.query.forAdmin === "true"

    let colClients: TClient[] = []
    let colEmmitters: TEmmitter[] = []
    let colRepresentatives: TRepresentative[] = []
    let colProducts: TProduct[] = []

    let colProdTypes: TProdType[] = []
    let colModels: TModel[] = []
    let colColors: TColor[] = []

    let orderData: TBasicOrder | null = null

    const pms = [
      fb.getDocs(fb.query(collections.clients)).then((res) => {
        colClients = parseFbDocs(res as any) as TClient[]
      }),
      fb.getDocs(fb.query(collections.emmitters)).then((res) => {
        colEmmitters = parseFbDocs(res as any) as TEmmitter[]
      }),
      fb.getDocs(fb.query(collections.representatives)).then((res) => {
        colRepresentatives = parseFbDocs(res as any) as TRepresentative[]
      }),
      fb.getDocs(fb.query(collections.products)).then((res) => {
        colProducts = parseFbDocs(res as any) as TProduct[]
      }),
      fb.getDocs(fb.query(collections.productTypes)).then((res) => {
        colProdTypes = parseFbDocs(res as any) as TProdType[]
      }),
      fb.getDocs(fb.query(collections.models)).then((res) => {
        colModels = parseFbDocs(res as any) as TModel[]
      }),
      fb.getDocs(fb.query(collections.colors)).then((res) => {
        colColors = parseFbDocs(res as any) as TColor[]
      }),
    ]

    await Promise.all(pms)

    const ref = fb.doc(collections.orders, orderId as string)
    const fbOrder = await fb.getDoc(ref)

    if (fbOrder.exists()) {
      const orderInfo = parseFbDoc(fbOrder)
      orderData = orderInfo
    }

    const orderInfo = parseOrders({
      emmitters: colEmmitters,
      representatives: colRepresentatives,
      clients: colClients,
      colors: colColors,
      models: colModels,
      orders: [orderData],
      prodTypes: colProdTypes,
      products: colProducts,
    })[0]

    const productsList = parseProducts({
      products: colProducts,
      models: colModels,
      colors: colColors,
    })

    const pdfbytes = await generateOrderPdf({
      order: orderInfo,
      products: productsList,
      forAdmin: forAdmin,
    })

    const buffer = Buffer.from(pdfbytes)

    // 3. Define os headers para download
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" +
        '"Pedido ' +
        String(orderData.code).padStart(2, "0") +
        '.pdf"'
    )

    res.status(200).send(buffer)
  } catch (error) {
    console.log(error)
    res.status(204).json(getCustomError(error))
  }
}
