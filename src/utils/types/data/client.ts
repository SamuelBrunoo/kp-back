import { TAddress } from "./address"

export type TClientType = "juridical" | "physical"

export type TFBClient = {
  type: TClientType
  clientName: string
  personName: string
  socialRole: string
  phone1: string
  phone2: string
  documents: {
    register: string
    stateInscription: string
    cityInscription: string
  }
  address: TAddress
  email: string
  representative: string | null
}

export type TNewClient = TFBClient

export type TBaseClient = TFBClient & {
  id: string
}

export type TClient = TBaseClient & {
  orders: string[]
}

/* *** ListPage *** */

export type TPageListClient = {
  id: string
  name: string
  address: string
  document: string
  stateIncription: string
  orders: number
  deletable: boolean
}
