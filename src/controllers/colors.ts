import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import app from "../network/firebase"
import { TNewColor } from "../utils/types/data/color"
import { colorValidator } from "../utils/validators/color"

const firestore = fb.getFirestore(app)

// # Collections
const collections = {
  productTypes: fb.collection(firestore, "productTypes"),
  products: fb.collection(firestore, "products"),
  colors: fb.collection(firestore, "colors"),
  clients: fb.collection(firestore, "clients"),
  orders: fb.collection(firestore, "orders"),
  production: fb.collection(firestore, "production"),
}

export const getColors = async (req: Request, res: Response) => {
  try {
    const colors = await fb.getDocs(fb.query(collections.colors))

    const list = colors.docs.map((d) => ({ ...d.data(), id: d.id }))
    res.json({
      success: true,
      data: {
        list,
      },
    })
  } catch (error) {
    res.json({ success: false, error: true })
  }
}

export const addColor = async (req: Request, res: Response) => {
  try {
    const data: TNewColor = req.body

    if (colorValidator(data)) {
      const doc = await fb.addDoc(collections.colors, data)
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
