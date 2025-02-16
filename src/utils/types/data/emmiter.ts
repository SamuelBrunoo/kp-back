import { TAddress } from "./address"

export type TEmmitter = {
  id: string
  name: string
  cpf?: string
  cnpj?: string
  address: TAddress
  email: string
  phone: string
  orders: string[]
}
