import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../services/firebase"
import { TProduct } from "../utils/types/data/product"
import { productValidator } from "../utils/validators/product"
import parseProducts from "../utils/parsers/parseProducts"
import { parseFbDocs } from "../utils/parsers/fbDoc"
import { TColor } from "../utils/types/data/color"
import { TModel } from "../utils/types/data/model"
import { TProdType } from "../utils/types/data/prodType"
import { getCustomError, jsonError } from "../utils/helpers/getCustomError"

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
      throw new Error(jsonError("Este produto não existe"))
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const addProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body

    if (productValidator(data)) {
      const sameCodeSnap = await fb.getDocs(
        // @ts-ignore
        fb.query(collections.products, fb.where("code", "==", data.code))
      )

      if (sameCodeSnap.docs.length === 0) {
        const doc = await fb.addDoc(collections.products, data)
        const docData = { ...data, id: doc.id }

        res.status(200).json({ success: true, data: docData })
      } else {
        throw new Error(jsonError("Este produto já existe"))
      }
    } else {
      throw new Error(jsonError("Verifique os campos e tente novamente."))
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
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
      throw new Error(jsonError("Verifique os campos e tente novamente."))
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // 1. check if it has already been ordered

    const query = fb.query(
      collections.orders,
      fb.where("productsIds", "array-contains", id)
    )
    const docsSnap = await fb.getDocs(query)

    if (docsSnap.docs.length === 0) {
      // 2. if not, delete

      const ref = fb.doc(collections.products, id)
      await fb.deleteDoc(ref)

      res.status(200).json({ success: true })
    } else {
      // 3. if true, it cant be deleted. Just inactivated
      throw new Error(
        JSON.stringify({
          message:
            "Este produto já foi pedido pelo menos uma vez. Em vez de deletar, inative-o.",
        })
      )
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const toggleProductStatus = async (req: Request, res: Response) => {
  try {
    const data = req.body

    if (productValidator(data)) {
      const ref = fb.doc(collections.products, data.id)
      await fb.updateDoc(ref, { active: !data.active })
      const docData = data

      res.status(200).json({ success: true, data: docData })
    } else {
      throw new Error(
        "Não foi possível alterar o status. Tente novamente mais tarde."
      )
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}
