import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import app from "../services/firebase"
import { TProduct } from "../utils/types/data/product"
import { TModel, TNewModel } from "../utils/types/data/model"
import { modelValidator } from "../utils/validators/model"
import { parseFbDocs } from "../utils/parsers/fbDoc"
import { TFBModel } from "../utils/types/data/model"
import { TColor } from "../utils/types/data/color"
import { TProdType } from "../utils/types/data/prodType"
import parseModels from "../utils/parsers/parseModels"
import parseModel from "../utils/parsers/parseModel"

const firestore = fb.getFirestore(app)

// # Collections
const collections = {
  products: fb.collection(firestore, "products"),
  colors: fb.collection(firestore, "colors"),
  models: fb.collection(firestore, "models"),
  productTypes: fb.collection(firestore, "productTypes"),
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

    const list = pretty
      ? parseModels({
          colors: colColors,
          models: colModels,
          prodTypes: colProdTypes,
          products: colProducts,
        })
      : colModels

    res.json({ success: true, data: { list } })
  } catch (error) {
    res.status(204).json({ success: false, error: true })
  }
}

export const getModel = async (req: Request, res: Response) => {
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

    const { id } = req.params
    const model = colModels.find((m) => m.id === id)

    if (model) {
      const info = parseModel({
        model: model,
        colors: colColors,
        prodTypes: colProdTypes,
        products: colProducts,
      })

      res.json({
        success: true,
        data: { model: info.model, variations: info.variations },
      })
    } else {
      throw new Error()
    }
  } catch (error) {
    res.status(204).json({ success: false, error: true })
  }
}

export const addModel = async (req: Request, res: Response) => {
  try {
    const data = req.body

    if (modelValidator(data)) {
      const doc = await fb.addDoc(collections.models, data)
      const docData = { ...data, id: doc.id }

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

export const updateModel = async (req: Request, res: Response) => {
  try {
    const data = req.body

    if (modelValidator(data)) {
      const ref = fb.doc(collections.models, data.id)
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

export const deleteModel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const ref = fb.doc(collections.models, id)
    await fb.deleteDoc(ref)

    res.status(200).json({ success: true })
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Houve um erro. Tente novamente" })
  }
}
