import * as fb from "firebase/firestore"
import { collections } from "../../../services/firebase"
import { parseFbDocs } from "../../parsers/fbDoc"
import { TFBOrder, TBasicOrder } from "../../types/data/order"
import { TClient } from "../../types/data/client"
import { TEmmitter } from "../../types/data/emmiter"
import { TRepresentative } from "../../types/data/representative"
import { TProdType } from "../../types/data/prodType"
import { TColor } from "../../types/data/color"
import { TModel } from "../../types/data/model"
import { TProduct } from "../../types/data/product"
import { TFBProductionLine } from "../../types/data/productionLine"

type TWantedCollections = keyof typeof collections

interface ITypedCollections {
  colClients: TClient[]
  colOrders: TFBOrder[]
  colEmmitters: TEmmitter[]
  colRepresentatives: TRepresentative[]
  colProdTypes: TProdType[]
  colProductionLines: TFBProductionLine[]
  colColors: TColor[]
  colModels: TModel[]
  colProducts: TProduct[]
}

const emptyTypedCollections: ITypedCollections = {
  colClients: [],
  colOrders: [],
  colEmmitters: [],
  colRepresentatives: [],
  colProdTypes: [],
  colProductionLines: [],
  colColors: [],
  colModels: [],
  colProducts: [],
}

const getCollectionRelation = <T>(collectionName: string, data: any[]) => ({
  colKey: getCollectionKeyName(collectionName),
  colType: data as T[],
})

const getCollectionKeyName = (collectionName: string): string => {
  const firstChar = collectionName.charAt(0)
  collectionName.replace(firstChar, firstChar.toUpperCase())
  return `col${collectionName}`
}

export const getParsedCollections = async (
  wantedCollections: TWantedCollections[]
): Promise<ITypedCollections> => {
  try {
    let resultCollections = { ...emptyTypedCollections }
    let promises = []

    wantedCollections.forEach((collectionName) => {
      const prom = async () => {
        const collection = collections[collectionName]
        const query = fb.query(collection)
        const request = fb.getDocs(query)

        request.then((res) => {
          const parsedCollection = parseFbDocs(res)

          const collectionRelation = getCollectionRelation<TBasicOrder>(
            collectionName,
            parsedCollection
          )

          resultCollections[collectionRelation.colKey] =
            parsedCollection as typeof collectionRelation.colType
        })
      }
      promises.push(prom)
    })

    await Promise.all(promises).catch((err) => {
      throw new Error(err)
    })

    return resultCollections
  } catch (error) {
    console.error(`[ERROR]: Function 'getParsedCollections' - \n`, error)
  }
}
