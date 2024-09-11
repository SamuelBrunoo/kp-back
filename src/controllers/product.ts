import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../services/firebase"
import { TNewProduct, TProduct } from "../utils/types/data/product"
import { productValidator } from "../utils/validators/product"
import parseProducts from "../utils/parsers/parseProducts"
import { parseFbDocs } from "../utils/parsers/fbDoc"
import { TColor } from "../utils/types/data/color"
import { TModel } from "../utils/types/data/model"
import { TProdType } from "../utils/types/data/prodType"

export const getProducts = async (req: Request, res: Response) => {
  try {
    const colProducts = parseFbDocs(
      await fb.getDocs(fb.query(collections.products))
    ) as TProduct[]
    const colColors = parseFbDocs(
      await fb.getDocs(fb.query(collections.colors))
    ) as TColor[]
    const colModels = parseFbDocs(
      await fb.getDocs(fb.query(collections.models))
    ) as TModel[]
    const colProdTypes = parseFbDocs(
      await fb.getDocs(fb.query(collections.productTypes))
    ) as TProdType[]

    const list = parseProducts({
      colors: colColors,
      models: colModels,
      prodTypes: colProdTypes,
      products: colProducts,
    })

    res.json({ success: true, data: { list } })
  } catch (error) {
    res.status(204).json({ success: false, error: true })
  }
}

export const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id
    const ref = fb.doc(collections.products, productId)
    const product = await fb.getDoc(ref)

    if (product.exists()) {
      res.json({
        success: true,
        data: { product: { ...product.data(), id: product.id } },
      })
    } else {
      throw new Error("Este produto não existe")
    }
  } catch (error) {
    res.json({ success: false, error: { message: error } })
  }
}

export const addProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body

    if (productValidator(data)) {
      const doc = await fb.addDoc(collections.products, data)
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

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body

    if (productValidator(data)) {
      const ref = fb.doc(collections.products, data.id)
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

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const ref = fb.doc(collections.products, id)
    await fb.deleteDoc(ref)

    res.status(200).json({ success: true })
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Houve um erro. Tente novamente" })
  }
}
