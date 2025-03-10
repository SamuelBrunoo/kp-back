import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../services/firebase"
import { parseFbDocs } from "../utils/parsers/fbDoc"
import { TClient } from "../utils/types/data/client"
import { TRepresentative } from "../utils/types/data/representative"
import { TBasicProduct, TProduct } from "../utils/types/data/product"
import { TProdType } from "../utils/types/data/prodType"
import { TColor } from "../utils/types/data/color"
import { TEmmitter } from "../utils/types/data/emmiter"
import { TFBModel, TModel, TModelDetails } from "../utils/types/data/model"
import { getCustomError } from "../utils/helpers/getCustomError"
import { TOrder } from "../utils/types/data/order"
import parseModel from "../utils/parsers/parseModel"
import parseProduct from "../utils/parsers/data/products/parseProduct"

export const getOrderFormData = async (req: Request, res: Response) => {
  try {
    let colClients: TClient[] = []
    let colEmmitters: TEmmitter[] = []
    let colRepresentatives: TRepresentative[] = []
    let colProducts: TProduct[] = []

    let colProdTypes: TProdType[] = []
    let colModels: TModel[] = []
    let colColors: TColor[] = []

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

    const data = {
      clients: colClients,
      emmitters: colEmmitters,
      representatives: colRepresentatives,
      products: colProducts,
      prodTypes: colProdTypes,
      models: colModels,
      colors: colColors,
    }

    res.json({ success: true, data: data })
  } catch (error) {
    res.status(204).json(getCustomError(error))
  }
}

export const getModelFormData = async (req: Request, res: Response) => {
  try {
    const { modelId } = req.query

    const colProducts = parseFbDocs(
      await fb.getDocs(fb.query(collections.products))
    ) as TProduct[]
    const colColors = parseFbDocs(
      await fb.getDocs(fb.query(collections.colors))
    ) as TColor[]
    const colProdTypes = parseFbDocs(
      await fb.getDocs(fb.query(collections.productTypes))
    ) as TProdType[]

    let resultInfo: {
      colors: TColor[]
      prodTypes: TProdType[]
      products: TProduct[]
      model?: TModelDetails
    } = {
      colors: colColors,
      prodTypes: colProdTypes,
      products: colProducts,
    }

    if (modelId) {
      const colModels = parseFbDocs(
        await fb.getDocs(fb.query(collections.models))
      ) as TFBModel[]
      const colOrders = parseFbDocs(
        await fb.getDocs(fb.query(collections.orders))
      ) as TOrder[]

      const model = colModels.find((m) => m.id === modelId)

      const modelInfo = parseModel({
        model: model,
        colors: colColors,
        prodTypes: colProdTypes,
        products: colProducts,
        orders: colOrders,
      })

      resultInfo.model = modelInfo
    }

    const result = resultInfo

    res.status(200).json({ success: true, data: result })
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const getProductFormData = async (req: Request, res: Response) => {
  try {
    const { productId } = req.query

    const colModels = parseFbDocs(
      await fb.getDocs(fb.query(collections.models))
    ) as TModel[]
    const colProducts = parseFbDocs(
      await fb.getDocs(fb.query(collections.products))
    ) as TBasicProduct[]
    const colColors = parseFbDocs(
      await fb.getDocs(fb.query(collections.colors))
    ) as TColor[]
    const colProdTypes = parseFbDocs(
      await fb.getDocs(fb.query(collections.productTypes))
    ) as TProdType[]

    let resultInfo: {
      product?: TProduct
      prodTypes: TProdType[]
      models: TModel[]
      colors: TColor[]
    } = {
      colors: colColors,
      prodTypes: colProdTypes,
      models: colModels,
    }

    if (productId) {
      const colOrders = parseFbDocs(
        await fb.getDocs(fb.query(collections.orders))
      ) as TOrder[]

      const product = colProducts.find((p) => p.id === productId)

      const productInfo = parseProduct({
        product: product,
        models: colModels,
      })

      resultInfo.product = productInfo
    }

    const result = resultInfo

    res.status(200).json({ success: true, data: result })
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}
