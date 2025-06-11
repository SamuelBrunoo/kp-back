import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../services/firebase"
import { clientValidator, newClientValidator } from "../utils/validators/client"
import { parseFbDocs } from "../utils/parsers/fbDoc"
import {
  TBaseClient,
  TClient,
  TFBClient,
  TNewClient,
} from "../utils/types/data/client"
import { getCustomError } from "../utils/helpers/getCustomError"
import { parseClientsPageList } from "../utils/parsers/listsPages/clients"
import { TBasicOrder } from "../utils/types/data/order"
import { TCity } from "../utils/types/data/city"
import { TState } from "../utils/types/data/state"
import { TBasicRepresentative } from "../utils/types/data/representative"

export const getClientsListPage = async (req: Request, res: Response) => {
  try {
    const colRepresentatives = parseFbDocs(
      await fb.getDocs(fb.query(collections.representatives))
    ) as TBasicRepresentative[]
    const colClients = parseFbDocs(
      await fb.getDocs(fb.query(collections.clients))
    ) as TBaseClient[]
    const colOrders = parseFbDocs(
      await fb.getDocs(fb.query(collections.orders))
    ) as TBasicOrder[]

    const clientsCities = colClients.map((client) => client.address.city)
    const clientsStates = colClients.map((client) => client.address.state)

    const cities = parseFbDocs(
      await fb.getDocs(
        fb.query(collections.cities, fb.where("code", "in", clientsCities))
      )
    ) as TCity[]

    const states = parseFbDocs(
      await fb.getDocs(
        fb.query(collections.states, fb.where("__name__", "in", clientsStates))
      )
    ) as TState[]

    const list = parseClientsPageList({
      representatives: colRepresentatives,
      clients: colClients,
      orders: colOrders,
      cities: cities,
      states: states,
    })

    res.status(200).json({ success: true, data: { list } })
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const getClients = async (req: Request, res: Response) => {
  try {
    const colClients = parseFbDocs(
      await fb.getDocs(fb.query(collections.clients))
    ) as TClient[]

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
    const data = req.body as TNewClient

    const validation = newClientValidator(data)

    if (validation.ok) {
      // 1. check if already exists a client with its email, stateInscription (optional) or cityInscription (optional)
      const query = fb.query(
        collections.clients,
        fb.or(
          fb.where("email", "==", data.email),
          fb.where("documents.register", "==", data.documents.register)
        )
      )

      const docsSnap = await fb.getDocs(query)

      const alreadyExists = docsSnap.size > 0

      if (!alreadyExists) {
        const doc = await fb.addDoc(collections.clients, data)
        const docData = { ...data, id: doc.id }

        res.status(201).json({ success: true, data: docData })
      } else {
        const registeredClient = docsSnap.docs[0].data() as TFBClient

        let message = ""

        if (registeredClient.email === data.email) {
          message = "Já existe um cliente com este email."
        } else if (
          registeredClient.documents.register === data.documents.register
        ) {
          message = "Já existe um cliente com este documento."
        } else if (
          data.documents.stateInscription.replace(/\D/g, "").length > 0 &&
          registeredClient.documents.stateInscription ===
            data.documents.stateInscription
        ) {
          message = "Já existe um cliente com esta inscrição estadual."
        } else if (
          data.documents.cityInscription.replace(/\D/g, "").length > 0 &&
          registeredClient.documents.cityInscription ===
            data.documents.cityInscription
        ) {
          message = "Já existe um cliente com esta inscrição municipal."
        }

        if (message !== "") throw new Error(message)
        else throw new Error()
      }
    } else {
      const fieldsStr = validation.fields.join(", ")
      throw new Error(`Verifique os campos (${fieldsStr}) e tente novamente.`)
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const updateClient = async (req: Request, res: Response) => {
  try {
    const data = req.body as TClient

    const validation = clientValidator(data)

    if (validation.ok) {
      const clientId = req.params.id
      const ref = fb.doc(collections.clients, clientId)
      const client = await fb.getDoc(ref)

      if (client.exists()) {
        // 1. check if already exists a model with its code
        let query = fb.query(
          collections.clients,
          fb.or(
            fb.where("email", "==", data.email),
            fb.where("documents.register", "==", data.documents.register)
          )
        )

        if (data.documents.cityInscription) {
          if (data.documents.stateInscription) {
            query = fb.query(
              collections.clients,
              fb.or(
                fb.where("email", "==", data.email),
                fb.where("documents.register", "==", data.documents.register),
                fb.where(
                  "documents.cityInscription",
                  "==",
                  data.documents.cityInscription
                ),
                fb.where(
                  "documents.stateInscription",
                  "==",
                  data.documents.stateInscription
                )
              )
            )
          } else {
            query = fb.query(
              collections.clients,
              fb.or(
                fb.where("email", "==", data.email),
                fb.where("documents.register", "==", data.documents.register),
                fb.where(
                  "documents.cityInscription",
                  "==",
                  data.documents.cityInscription
                )
              )
            )
          }
        }

        const docsSnap = await fb.getDocs(query)

        const alreadyExists =
          docsSnap.docs.filter((i) => i.id !== clientId).length > 0

        if (!alreadyExists) {
          const ref = fb.doc(collections.clients, clientId)
          await fb.updateDoc(ref, data)
          const docData = data

          res.status(200).json({ success: true, data: docData })
        } else {
          const registeredClient = docsSnap.docs[0].data() as TFBClient

          let message = ""

          if (registeredClient.email === data.email) {
            message = "Já existe um cliente com este email."
          } else if (
            registeredClient.documents.register === data.documents.register
          ) {
            message = "Já existe um cliente com este cpf/cnpj."
          } else if (
            data.documents.cityInscription &&
            data.documents.cityInscription.replace(/\D/g, "").length > 0 &&
            registeredClient.documents.cityInscription ===
              data.documents.cityInscription
          ) {
            message = "Já existe um cliente com esta inscrição municipal."
          } else if (
            data.documents.stateInscription &&
            data.documents.stateInscription.replace(/\D/g, "").length > 0 &&
            registeredClient.documents.stateInscription ===
              data.documents.stateInscription
          ) {
            message = "Já existe um cliente com esta inscrição estadual."
          }

          if (message !== "") throw new Error(message)
          else throw new Error()
        }
      } else throw new Error("Este usuário não existe.")
    } else {
      const fieldsStr = validation.fields.join(", ")
      throw new Error(`Verifique os campos (${fieldsStr}) e tente novamente.`)
    }
  } catch (error) {
    res.status(400).json(getCustomError(error))
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
