import { TAddress } from "./address"
import { TClient } from "./client"

export type TRepresentative = {
  id: string
  name: string
  cpf?: string
  cnpj?: string
  address: TAddress
  email: string
  phone: string
  clients: TClient[]
  orders: string[]
}

export type TNewRepresentative = {
  name: string
  cpf?: string
  cnpj?: string
  address: TAddress
  email: string
  phone: string
}
