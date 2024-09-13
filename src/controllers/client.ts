import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../services/firebase"
import { clientValidator } from "../utils/validators/client"
import { parseFbDocs } from "../utils/parsers/fbDoc"
import { TClient } from "../utils/types/data/client"

export const getClients = async (req: Request, res: Response) => {
  try {
    const colClients = parseFbDocs(
      await fb.getDocs(fb.query(collections.clients))
    ) as TClient[]

    // const list = parseClient({
    //   colors: colColors,
    //   models: colModels,
    //   prodTypes: colProdTypes,
    //   products: colProducts,
    // })
    const list = colClients.map((cc) => ({ ...cc, orders: [] }))

    res.json({ success: true, data: { list } })
  } catch (error) {
    res.status(204).json({ success: false, error: true })
  }
}

export const getClient = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.id
    const ref = fb.doc(collections.clients, clientId)
    const client = await fb.getDoc(ref)

    if (client.exists()) {
      res.json({
        success: true,
        data: { client: { ...client.data(), id: client.id } },
      })
    } else {
      throw new Error("Este cliente não existe")
    }
  } catch (error) {
    res.json({ success: false, error: { message: error } })
  }
}

export const addClient = async (req: Request, res: Response) => {
  try {
    const data = req.body

    if (clientValidator(data)) {
      const doc = await fb.addDoc(collections.clients, data)
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

export const updateClient = async (req: Request, res: Response) => {
  try {
    const data = req.body

    if (clientValidator(data)) {
      const ref = fb.doc(collections.clients, data.id)
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

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const ref = fb.doc(collections.clients, id)
    await fb.deleteDoc(ref)

    res.status(200).json({ success: true })
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Houve um erro. Tente novamente" })
  }
}
