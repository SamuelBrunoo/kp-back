import { TPaymentConfig } from "../../payment"
import { TAddress } from "../../address"

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
