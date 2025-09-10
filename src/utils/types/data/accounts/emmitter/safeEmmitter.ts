import { TAddress } from "../../address"

export type TSafeEmmitter = {
  name: string
  cpf?: string
  cnpj: string
  address: TAddress
  email: string
  phone: string
}
