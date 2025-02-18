import { TAddress } from "./address"
import { TClient } from "./client"
import { TPaymentConfig } from "./payment"

export type TNewRepresentative = {
  name: string
  email: string
  phone: string
  phone2: string
  paymentConfig: TPaymentConfig["representative"]
  registers: {
    cpf: string
    cnpj: string | null
  }
  address: TAddress
}

export type TFBRepresentative = TNewRepresentative

export type TBasicRepresentative = TFBRepresentative & {
  id: string
}

export type TRepresentative = TNewRepresentative & {
  id: string
  clients: TClient[]
  orders: string[]
}

export type TPageListRepresentative = {
  id: string
  name: string
  clients: number
  monthTotal: number
  monthSells: number
  yearTotal: number
  yearSells: number
  deletable: boolean
}
