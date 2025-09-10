import { TAddress } from "../address"
import { TClientType } from "./clientType"

export type TNewClient = {
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
