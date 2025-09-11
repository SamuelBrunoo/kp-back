/*
 *  Typing
 */

/* Emmitter */
import { TBasicEmmitter } from "../../types/data/accounts/emmitter/basicEmmitter"
import { TSafeEmmitter } from "../../types/data/accounts/emmitter/safeEmmitter"

export const parseSafeEmmitter = (emmitter: TBasicEmmitter) => {
  const safeEmmitter: TSafeEmmitter = {
    address: emmitter.address,
    cnpj: emmitter.cnpj,
    email: emmitter.email,
    name: emmitter.name,
    phone: emmitter.phone,
    cpf: emmitter.cpf,
  }

  return safeEmmitter
}
