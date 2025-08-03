import * as fb from "firebase/firestore"
import { collections } from "../firebase"
import { parseFbDocs } from "../../utils/parsers/fbDoc"
import { TFBOrder, TBasicOrder } from "../../utils/types/data/order"
import { TClient } from "../../utils/types/data/client"
import { TEmmitter } from "../../utils/types/data/emmiter"
import { TRepresentative } from "../../utils/types/data/representative"
import { TProdType } from "../../utils/types/data/prodType"
import { TColor } from "../../utils/types/data/color"
import { TModel } from "../../utils/types/data/model"
import { TProduct } from "../../utils/types/data/product"
import { TProductionLine } from "../../utils/types/data/productionLine"
import { TWorker } from "../../utils/types/data/worker"

type TWantedCollections = keyof typeof collections

interface ITypedCollections {
  colClients: TClient[]
  colOrders: TBasicOrder[]
  colEmmitters: TEmmitter[]
  colRepresentatives: TRepresentative[]
  colProdTypes: TProdType[]
  colProductionLines: TProductionLine[]
  colColors: TColor[]
  colModels: TModel[]
  colProducts: TProduct[]
  colWorkers: TWorker[]
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
  colWorkers: [],
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
  wantedCollections: TWantedCollections[],
  filters?: {
    [key in TWantedCollections]?: fb.QueryFieldFilterConstraint[]
  }
): Promise<ITypedCollections> => {
  try {
    let resultCollections = { ...emptyTypedCollections }
    let promises = []

    wantedCollections.forEach((collectionName) => {
      const prom = async () => {
        const collection = collections[collectionName]
        const query = fb.query(collection, ...(filters[collectionName] ?? []))
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
    return { ...emptyTypedCollections }
  }
}
