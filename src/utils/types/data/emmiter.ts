import { TAddress } from "./address"

export type TSafeEmmitter = {
  name: string
  cpf?: string
  cnpj: string
  address: TAddress
  email: string
  phone: string
}

export type TFBEmmitter = TSafeEmmitter & {
  bank: TBankCredentials
}

export type TBasicEmmitter = TFBEmmitter & {
  id: string
}

export type TEmmitter = TBasicEmmitter & {
  orders: string[]
}

export type TBankCredentials = {
  username: string
  password: string
  cooperativa: string
  posto: string
  codigoBeneficiario: string
}
