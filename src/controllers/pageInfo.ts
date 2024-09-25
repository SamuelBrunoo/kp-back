import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../services/firebase"
import { parseFbDocs } from "../utils/parsers/fbDoc"
import { TClient } from "../utils/types/data/client"
import { TRepresentative } from "../utils/types/data/representative"
import { TProduct } from "../utils/types/data/product"
import { TProdType } from "../utils/types/data/prodType"
import { TColor } from "../utils/types/data/color"
import { TEmmitter } from "../utils/types/data/emmiter"
import { TModel } from "../utils/types/data/model"

export const getOrderFormData = async (req: Request, res: Response) => {
  try {
    let colClients: TClient[] = []
    let colEmmitters: TEmmitter[] = []
    let colRepresentatives: TRepresentative[] = []
    let colProducts: TProduct[] = []

    let colProdTypes: TProdType[] = []
    let colModels: TModel[] = []
    let colColors: TColor[] = []

    const pms = [
      fb.getDocs(fb.query(collections.clients)).then((res) => {
        colClients = parseFbDocs(res as any) as TClient[]
      }),
      fb.getDocs(fb.query(collections.emmitters)).then((res) => {
        colEmmitters = parseFbDocs(res as any) as TEmmitter[]
      }),
      fb.getDocs(fb.query(collections.representatives)).then((res) => {
        colRepresentatives = parseFbDocs(res as any) as TRepresentative[]
      }),
      fb.getDocs(fb.query(collections.products)).then((res) => {
        colProducts = parseFbDocs(res as any) as TProduct[]
      }),
      fb.getDocs(fb.query(collections.productTypes)).then((res) => {
        colProdTypes = parseFbDocs(res as any) as TProdType[]
      }),
      fb.getDocs(fb.query(collections.models)).then((res) => {
        colModels = parseFbDocs(res as any) as TModel[]
      }),
      fb.getDocs(fb.query(collections.colors)).then((res) => {
        colColors = parseFbDocs(res as any) as TColor[]
      }),
    ]

    await Promise.all(pms)

    const data = {
      clients: colClients,
      emmitters: colEmmitters,
      representatives: colRepresentatives,
      products: colProducts,
      prodTypes: colProdTypes,
      models: colModels,
      colors: colColors,
    }

    res.json({ success: true, data: data })
  } catch (error) {
    res.status(204).json({ success: false, error: true })
  }
}
