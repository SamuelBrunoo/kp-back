import { TAddress } from "./address"

export type TFBEmmitter = {
  name: string
  cpf?: string
  cnpj?: string
  address: TAddress
  email: string
  phone: string
}

export type TBasicEmmitter = TFBEmmitter & {
  id: string
}

export type TEmmitter = TBasicEmmitter & {
  orders: string[]
}
