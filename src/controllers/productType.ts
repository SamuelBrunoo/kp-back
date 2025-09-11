import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import app from "../network/firebase"
import { newProductValidator } from "../utils/validators/product"

/*
 *  Typing
 */

/* Product */
import { TNewProduct } from "../utils/types/data/product/newProduct"

const firestore = fb.getFirestore(app)

// # Collections
const collections = {
  productTypes: fb.collection(firestore, "productTypes"),
}

export const getProductTypes = async (req: Request, res: Response) => {
  try {
    const documents = await fb.getDocs(fb.query(collections.productTypes))

    const list = documents.docs.map((d) => ({ ...d.data(), id: d.id }))

    res.json({ success: true, data: { list } })
  } catch (error) {
    res.json({ success: false, error: true })
  }
}

export const addProductType = async (req: Request, res: Response) => {
  try {
    const data: TNewProduct = req.body

    if (newProductValidator(data)) {
      const doc = await fb.addDoc(collections.productTypes, data)
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
