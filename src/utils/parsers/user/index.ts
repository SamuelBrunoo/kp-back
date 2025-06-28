import { TBasicEmmitter, TSafeEmmitter } from "../../types/data/emmiter"

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
