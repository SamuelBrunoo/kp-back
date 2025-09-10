import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../network/firebase"
import {
  newRepresentativeValidator,
  representativeValidator,
} from "../utils/validators/representative"
import { parseFbDocs } from "../utils/parsers/fbDoc"
import { parseRepresentatives } from "../utils/parsers/parseRepresentatives"
import {
 TDBRepresentative,
  TNewRepresentative,
  TRepresentative,
} from "../utils/types/data/representative"
import { TBaseClient, TClient } from "../utils/types/data/client"
import { getCustomError } from "../utils/helpers/getCustomError"
import { TBasicOrder } from "../utils/types/data/order"
import { parseRepresentativesPageList } from "../utils/parsers/listsPages/representatives"
import { getRepresentativesQuery } from "../utils/helpers/api/getDateFilteredQuery"

export const getRepresentativesListPage = async (
  req: Request,
  res: Response
) => {
  try {
    const { startDateFilter, endDateFilter } = req.params

    const dateFilter = {
      start: startDateFilter,
      end: endDateFilter,
    }

    const colRepresentatives = parseFbDocs(
      await fb.getDocs(fb.query(collections.representatives))
    ) as TRepresentative[]
    const colClients = parseFbDocs(
      await fb.getDocs(
        fb.query(collections.clients, fb.where("representative", "!=", null))
      )
    ) as TBaseClient[]

    const ordersQuery: fb.Query = getRepresentativesQuery(dateFilter)

    const colOrders = parseFbDocs(
      await fb.getDocs(ordersQuery)
    ) as TBasicOrder[]

    const representativesClients = colClients.map((client) => ({
      id: client.id,
      representative: client.representative,
    }))

    const list = parseRepresentativesPageList({
      representatives: colRepresentatives,
      clients: representativesClients,
      orders: colOrders,
    })

    res.status(200).json({ success: true, data: { list } })
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

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
      states: [],
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
    const data = req.body as TNewRepresentative

    const validation = newRepresentativeValidator(data)

    if (validation.ok) {
      // 1. check if already exists a model with its code
      let query = fb.query(
        collections.representatives,
        fb.or(
          fb.where("email", "==", data.email),
          fb.where("registers.cpf", "==", data.registers.cpf)
        )
      )

      if (data.registers.cnpj) {
        query = fb.query(
          collections.representatives,
          fb.or(
            fb.where("email", "==", data.email),
            fb.where("registers.cpf", "==", data.registers.cpf),
            fb.where("registers.cnpj", "==", data.registers.cnpj)
          )
        )
      }

      const docsSnap = await fb.getDocs(query)

      const alreadyExists = docsSnap.size > 0

      if (!alreadyExists) {
        const doc = await fb.addDoc(collections.representatives, data)
        const docData = { ...data, id: doc.id }

        res.status(200).json({ success: true, data: docData })
      } else {
        const registeredRepresentative =
          docsSnap.docs[0].data() asTDBRepresentative

        let message = ""

        if (registeredRepresentative.email === data.email) {
          message = "Já existe um representante com este email."
        } else if (
          registeredRepresentative.registers.cpf === data.registers.cpf
        ) {
          message = "Já existe um representante com este cpf."
        } else if (
          data.registers.cnpj &&
          data.registers.cnpj.replace(/\D/g, "").length > 0 &&
          registeredRepresentative.registers.cnpj === data.registers.cnpj
        ) {
          message = "Já existe um representante com este cnpj."
        }

        if (message !== "") throw new Error(message)
        else throw new Error()
      }
    } else {
      const fieldsStr = validation.fields.join(", ")
      throw new Error(`Verifique os campos (${fieldsStr}) e tente novamente.`)
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}

export const updateRepresentative = async (req: Request, res: Response) => {
  try {
    const data = req.body as TRepresentative

    const representativeId = req.params.id
    const ref = fb.doc(collections.representatives, representativeId)
    const representative = await fb.getDoc(ref)

    if (representative.exists()) {
      if (representativeValidator(data)) {
        // 1. check if already exists a model with its code
        let query = fb.query(
          collections.representatives,
          fb.or(
            fb.where("email", "==", data.email),
            fb.where("registers.cpf", "==", data.registers.cpf)
          )
        )

        if (data.registers.cnpj) {
          query = fb.query(
            collections.representatives,
            fb.or(
              fb.where("email", "==", data.email),
              fb.where("registers.cpf", "==", data.registers.cpf),
              fb.where("registers.cnpj", "==", data.registers.cnpj)
            )
          )
        }

        const docsSnap = await fb.getDocs(query)

        const alreadyExists =
          docsSnap.docs.filter((i) => i.id !== representativeId).length > 0

        if (!alreadyExists) {
          const ref = fb.doc(collections.representatives, representativeId)
          await fb.updateDoc(ref, data)
          const docData = data

          res.status(200).json({ success: true, data: docData })
        } else {
          const registeredRepresentative =
            docsSnap.docs[0].data() asTDBRepresentative

          let message = ""

          if (registeredRepresentative.email === data.email) {
            message = "Já existe um representante com este email."
          } else if (
            registeredRepresentative.registers.cpf === data.registers.cpf
          ) {
            message = "Já existe um representante com este cpf."
          } else if (
            data.registers.cnpj &&
            data.registers.cnpj.replace(/\D/g, "").length > 0 &&
            registeredRepresentative.registers.cnpj === data.registers.cnpj
          ) {
            message = "Já existe um representante com este cnpj."
          }

          if (message !== "") throw new Error(message)
          else throw new Error()
        }
      } else {
        res.status(400).json({
          success: false,
          error: "Verifique os campos e tente novamente",
        })
      }
    } else throw new Error("Este representante não existe")
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const deleteRepresentative = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const ref = fb.doc(collections.representatives, id)
    await fb.deleteDoc(ref)

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}
