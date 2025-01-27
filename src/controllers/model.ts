import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import app from "../services/firebase"
import { TProduct } from "../utils/types/data/product"
import { modelValidator } from "../utils/validators/model"
import { parseFbDocs } from "../utils/parsers/fbDoc"
import { TFBModel } from "../utils/types/data/model"
import { TColor } from "../utils/types/data/color"
import { TProdType } from "../utils/types/data/prodType"
import parseModels from "../utils/parsers/parseModels"
import parseModel from "../utils/parsers/parseModel"
import { getCustomError, jsonError } from "../utils/helpers/getCustomError"
import { parseModelsPageList } from "../utils/parsers/model/pageList"
import { TOrder } from "../utils/types/data/order"

const firestore = fb.getFirestore(app)

// # Collections
const collections = {
  products: fb.collection(firestore, "products"),
  colors: fb.collection(firestore, "colors"),
  models: fb.collection(firestore, "models"),
  productTypes: fb.collection(firestore, "productTypes"),
  orders: fb.collection(firestore, "orders"),
}

export const getModelsListPage = async (req: Request, res: Response) => {
  try {
    const colProducts = parseFbDocs(
      await fb.getDocs(fb.query(collections.products))
    ) as TProduct[]
    const colColors = parseFbDocs(
      await fb.getDocs(fb.query(collections.colors))
    ) as TColor[]
    const colModels = parseFbDocs(
      await fb.getDocs(fb.query(collections.models))
    ) as TFBModel[]
    const colProdTypes = parseFbDocs(
      await fb.getDocs(fb.query(collections.productTypes))
    ) as TProdType[]
    const colOrders = parseFbDocs(
      await fb.getDocs(fb.query(collections.orders))
    ) as TOrder[]

    const list = parseModelsPageList({
      colors: colColors,
      models: colModels,
      prodTypes: colProdTypes,
      products: colProducts,
      orders: colOrders,
    })

    res.status(200).json({ success: true, data: { list } })
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const getModels = async (req: Request, res: Response) => {
  try {
    const pretty = req.query.pretty === "yes"

    const colProducts = parseFbDocs(
      await fb.getDocs(fb.query(collections.products))
    ) as TProduct[]
    const colColors = parseFbDocs(
      await fb.getDocs(fb.query(collections.colors))
    ) as TColor[]
    const colModels = parseFbDocs(
      await fb.getDocs(fb.query(collections.models))
    ) as TFBModel[]
    const colProdTypes = parseFbDocs(
      await fb.getDocs(fb.query(collections.productTypes))
    ) as TProdType[]
    const colOrders = parseFbDocs(
      await fb.getDocs(fb.query(collections.orders))
    ) as TOrder[]

    const list = pretty
      ? parseModels({
          colors: colColors,
          models: colModels,
          prodTypes: colProdTypes,
          products: colProducts,
          orders: colOrders,
        })
      : colModels

    res.status(200).json({ success: true, data: { list } })
  } catch (error) {
    res.status(400).json({ success: false, error: getCustomError(error) })
  }
}

export const getModel = async (req: Request, res: Response) => {
  try {
    const colModels = parseFbDocs(
      await fb.getDocs(fb.query(collections.models))
    ) as TFBModel[]

    const { id } = req.params
    const model = colModels.find((m) => m.id === id)

    if (model) {
      const colProducts = parseFbDocs(
        await fb.getDocs(fb.query(collections.products))
      ) as TProduct[]
      const colColors = parseFbDocs(
        await fb.getDocs(fb.query(collections.colors))
      ) as TColor[]
      const colProdTypes = parseFbDocs(
        await fb.getDocs(fb.query(collections.productTypes))
      ) as TProdType[]
      const colOrders = parseFbDocs(
        await fb.getDocs(fb.query(collections.orders))
      ) as TOrder[]

      const info = parseModel({
        model: model,
        colors: colColors,
        prodTypes: colProdTypes,
        products: colProducts,
        orders: colOrders,
      })

      res.status(200).json({
        success: true,
        data: { model: info.model, variations: info.variations },
      })
    } else {
      throw new Error("Modelo não encontrado.")
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const addModel = async (req: Request, res: Response) => {
  try {
    const data = req.body

    const validation = modelValidator(data)

    if (validation.status) {
      // 1. check if already exists a model with its code
      const query = fb.query(
        collections.models,
        fb.where("code", "==", data.code)
      )

      const docsSnap = await fb.getDocs(query)

      const alreadyExists = docsSnap.size > 0

      if (!alreadyExists) {
        const doc = await fb.addDoc(collections.models, data)
        const docData = { ...data, id: doc.id }

        res.status(201).json({ success: true, data: docData })
      } else throw new Error("Já existe um modelo com esse código.")
    } else {
      const fieldsStr = validation.fields.join(", ")
      throw new Error(`Verifique os campos (${fieldsStr}) e tente novamente.`)
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const updateModel = async (req: Request, res: Response) => {
  try {
    const data = req.body
    const params = req.params

    const id = params.id as string

    const ref = fb.doc(collections.models, id)

    const docsSnap = await fb.getDoc(ref)
    if (docsSnap.exists()) {
      const validation = modelValidator(data)

      if (validation.status) {
        await fb.updateDoc(ref, data)
        const docData = data

        res.status(200).json({ success: true, data: docData })
      } else {
        throw new Error(
          `Verifique os campos (${validation.fields.join(
            ", "
          )}) e tente novamente`
        )
      }
    } else throw new Error("Este modelo não existe mais.")
  } catch (error) {
    console.log(error)
    res.status(400).json(getCustomError(error))
  }
}

export const deleteModel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const modelSnap = await fb.getDoc(fb.doc(collections.models, id))

    if (modelSnap.exists()) {
      const model = modelSnap.data()

      // 1. check if it has product of it
      const query = fb.query(
        collections.products,
        fb.where("model", "==", model.code)
      )
      const docsSnap = await fb.getDocs(query)

      if (docsSnap.docs.length === 0) {
        // 2. if not, delete

        const ref = fb.doc(collections.models, id)
        await fb.deleteDoc(ref)

        res.status(200).json({ success: true })
      } else {
        // 3. if have, return error
        throw new Error(
          "Há produtos referentes a esse modelo. Você não pode excluí-lo diretamente."
        )
      }
    } else {
      // model does not exists
      throw new Error("Este modelo não existe ou já foi deletado")
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}
