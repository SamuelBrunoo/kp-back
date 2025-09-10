import { TClient } from "."
import { TAddress } from "../address"
import { TClientType } from "./clientType"

export type TPageListClient = {
  id: string
  name: string
  socialRole: string
  type: TClientType
  address: TAddress
  cep: string
  document: string
  stateIncription: string
  orders: number
  deletable: boolean
  details: TClient
}
