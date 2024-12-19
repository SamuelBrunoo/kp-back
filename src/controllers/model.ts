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
      throw new Error(
        jsonError(
          "Não foi possível acessar as informações deste modelo. Tente novamente mais tarde"
        )
      )
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
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
    res.status(400).json(getCustomError(error))
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
          JSON.stringify({
            message:
              "Há produtos referentes a esse modelo. Você não pode excluí-lo diretamente.",
          })
        )
      }
    } else {
      // model does not exists
      throw new Error(
        JSON.stringify({ message: "Este modelo não existe ou já foi deletado" })
      )
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}
