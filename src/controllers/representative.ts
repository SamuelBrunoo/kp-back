import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../services/firebase"
import { representativeValidator } from "../utils/validators/representative"
import { parseFbDocs } from "../utils/parsers/fbDoc"
import parseRepresentatives from "../utils/parsers/representatives"
import { TRepresentative } from "../utils/types/data/representative"
import { TClient } from "../utils/types/data/client"

export const getRepresentatives = async (req: Request, res: Response) => {
  try {
    const colRepresentatives = parseFbDocs(
      await fb.getDocs(fb.query(collections.representatives))
    ) as TRepresentative[]
    colRepresentatives.forEach
    const colClients = parseFbDocs(
      await fb.getDocs(fb.query(collections.clients))
    ) as TClient[]

    const list = parseRepresentatives({
      representatives: colRepresentatives,
      clients: colClients,
    })

    res.json({ success: true, data: { list } })
  } catch (error) {
    res.status(204).json({ success: false, error: true })
  }
}

export const getRepresentative = async (req: Request, res: Response) => {
  try {
    const representativeId = req.params.id
    const ref = fb.doc(collections.representatives, representativeId)
    const representative = await fb.getDoc(ref)

    if (representative.exists()) {
      res.json({
        success: true,
        data: {
          representative: { ...representative.data(), id: representative.id },
        },
      })
    } else {
      throw new Error("Este Representante não existe")
    }
  } catch (error) {
    res.json({ success: false, error: { message: error } })
  }
}

export const addRepresentative = async (req: Request, res: Response) => {
  try {
    const data = req.body

    if (representativeValidator(data)) {
      const doc = await fb.addDoc(collections.representatives, data)
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

export const updateRepresentative = async (req: Request, res: Response) => {
  try {
    const data = req.body

    if (representativeValidator(data)) {
      const ref = fb.doc(collections.representatives, data.id)
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

export const deleteRepresentative = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const ref = fb.doc(collections.representatives, id)
    await fb.deleteDoc(ref)

    res.status(200).json({ success: true })
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "Houve um erro. Tente novamente" })
  }
}
