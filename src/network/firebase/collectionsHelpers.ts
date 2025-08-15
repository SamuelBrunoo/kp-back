import * as fb from "firebase/firestore"
import { collections } from "../firebase"
import { parseFbDocs } from "../../utils/parsers/fbDoc"
import { TBasicOrder } from "../../utils/types/data/order"
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
  colProductTypes: TProdType[]
  colProductionLines: TProductionLine[]
  colColors: TColor[]
  colModels: TModel[]
  colProducts: TProduct[]
  colWorkers: TWorker[]
}

type IFiltersCollections = {
  [key in TWantedCollections]?: fb.QueryFieldFilterConstraint[]
}

const emptyTypedCollections: ITypedCollections = {
  colClients: [],
  colOrders: [],
  colEmmitters: [],
  colRepresentatives: [],
  colProductTypes: [],
  colProductionLines: [],
  colColors: [],
  colModels: [],
  colProducts: [],
  colWorkers: [],
}

const emptyFiltersCollections: IFiltersCollections = {
  clients: [],
  orders: [],
  emmitters: [],
  representatives: [],
  productTypes: [],
  productionLines: [],
  colors: [],
  models: [],
  products: [],
  workers: [],
  users: [],
  cities: [],
  states: [],
}

const getCollectionRelation = <T>(collectionName: string, data: any[]) => ({
  colKey: getCollectionKeyName(collectionName),
  colType: data as T[],
})

const getCollectionKeyName = (collectionName: string): string => {
  const firstChar = collectionName.charAt(0)
  collectionName = collectionName.replace(firstChar, firstChar.toUpperCase())
  return `col${collectionName}`
}

export const getParsedCollections = async (
  wantedCollections: TWantedCollections[],
  filters: IFiltersCollections = emptyFiltersCollections
): Promise<ITypedCollections> => {
  try {
    let resultCollections = { ...emptyTypedCollections }
    let promises = []

    wantedCollections.forEach((collectionName) => {
      const prom = new Promise(async (resolve, reject) => {
        try {
          const collection = collections[collectionName]
          const collectionFilters =
            filters && filters[collectionName] !== undefined
              ? filters[collectionName]
              : []

          const query = fb.query(collection, ...collectionFilters)
          const response = await fb.getDocs(query)

          const parsedCollection = parseFbDocs(response)

          const collectionRelation = getCollectionRelation<TBasicOrder>(
            collectionName,
            parsedCollection
          )

          resultCollections[collectionRelation.colKey] =
            parsedCollection as typeof collectionRelation.colType

          resolve(true)
        } catch (error) {
          reject(error)
        }
      })

      promises.push(prom)
    })

    await Promise.all(promises).catch((err) => {
      throw new Error(err)
    })

    return resultCollections
  } catch (error) {
    return { ...emptyTypedCollections }
  }
}
