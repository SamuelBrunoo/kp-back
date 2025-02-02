import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../services/firebase"
import { TFBProduct, TNewProduct, TProduct } from "../utils/types/data/product"
import {
  newProductValidator,
  productValidator,
} from "../utils/validators/product"
import parseProducts from "../utils/parsers/parseProducts"
import { parseFbDocs } from "../utils/parsers/fbDoc"
import { TColor } from "../utils/types/data/color"
import { TFBModel, TModel } from "../utils/types/data/model"
import { TProdType } from "../utils/types/data/prodType"
import { getCustomError } from "../utils/helpers/getCustomError"
import { TOrder } from "../utils/types/data/order"
import { parseProductsPageList } from "../utils/parsers/listsPages/products"

export const getProductslistPage = async (req: Request, res: Response) => {
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

    const list = parseProductsPageList({
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

export const getProducts = async (req: Request, res: Response) => {
  try {
    const colProducts = parseFbDocs(
      await fb.getDocs(fb.query(collections.products))
    ) as TProduct[]
    const colModels = parseFbDocs(
      await fb.getDocs(fb.query(collections.models))
    ) as TModel[]

    const list = parseProducts({
      products: colProducts,
      models: colModels,
    })

    res.status(200).json({ success: true, data: { list } })
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id
    const ref = fb.doc(collections.products, productId)
    const product = await fb.getDoc(ref)

    if (product.exists()) {
      res.status(200).json({
        success: true,
        data: { product: { ...product.data(), id: product.id } },
      })
    } else throw new Error("Este produto não existe")
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const addProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body as TNewProduct

    const validation = newProductValidator(data)

    if (validation.ok) {
      const modelRef = fb.doc(collections.models, data.model)

      const modelSnap = await fb.getDoc(modelRef)

      if (modelSnap.exists()) {
        const modelData = modelSnap.data() as TFBModel

        const isColorAvailable = modelData.colors.includes(data.color)

        if (isColorAvailable) {
          const sameCodeSnap = await fb.getDocs(
            fb.query(collections.products, fb.where("code", "==", data.code))
          )

          if (sameCodeSnap.docs.length === 0) {
            const doc = await fb.addDoc(collections.products, data)
            const docData = { ...data, id: doc.id }

            res.status(201).json({ success: true, data: docData })
          } else throw new Error("Este produto já existe")
        } else throw new Error("Este modelo não permite essa cor.")
      } else throw new Error("Este modelo não existe mais ou não está ativo")
    } else {
      const fieldsStr = validation.fields.join(", ")
      throw new Error(`Verifique os campos (${fieldsStr}) e tente novamente.`)
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const incomingData = req.body as TProduct
    const { id } = req.params

    const data = { ...incomingData, id }

    const validation = productValidator(data)

    if (validation.ok) {
      const ref = fb.doc(collections.products, data.id)

      const prodSnap = await fb.getDoc(ref)

      // Check if product exists
      if (prodSnap.exists()) {
        const fbProductData = prodSnap.data() as TFBProduct

        const modelRef = fb.doc(collections.models, data.model)
        const modelSnap = await fb.getDoc(modelRef)
        const modelData = modelSnap.data()

        // Check if new model exists, in change case
        if (!modelSnap.exists()) {
          throw new Error("Este modelo não existe mais.")
        }

        // Check if new color is available in this new model, in change case

        const isColorAvailable = modelData.colors.includes(data.color)

        if (isColorAvailable) {
          const hasChangedConfig =
            data.model !== fbProductData.model ||
            data.color !== fbProductData.color ||
            data.code !== fbProductData.code

          if (hasChangedConfig) {
            const query = fb.query(
              collections.products,
              fb.where("code", "==", data.code)
            )

            const sameCodeSnap = await fb.getDocs(query)

            if (
              sameCodeSnap.docs.filter((doc) => doc.id !== data.id).length > 0
            ) {
              const message =
                "Já existe outro produto com essa configuração (tipo, modelo e cor)."
              throw new Error(message)
            }
          }

          // Update

          await fb.updateDoc(ref, data)
          const docData = data

          res.status(200).json({ success: true, data: docData })
        } else throw new Error("Este modelo não permite essa cor.")
      } else throw new Error("Este produto não existe.")
    } else {
      const fieldsStr = validation.fields.join(", ")
      const message = `Verifique os campos (${fieldsStr}) e tente novamente.`
      throw new Error(message)
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const ref = fb.doc(collections.products, id)
    const product = await fb.getDoc(ref)

    if (product.exists()) {
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
    } else throw new Error("Este produto não existe.")
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const toggleProductStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const ref = fb.doc(collections.products, id)
    const product = await fb.getDoc(ref)

    if (product.exists()) {
      await fb.updateDoc(ref, { active: !product.data().active })
      const docData = { ...product, active: !product.data().active }

      res.status(200).json({ success: true, data: docData })
    } else {
      throw new Error(
        "Não foi possível alterar o status. Tente novamente mais tarde."
      )
    }

    const data = req.body
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}
