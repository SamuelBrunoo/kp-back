import {
  TNewRepresentative,
  TRepresentative,
} from "../types/data/representative"
import { TErrorsCheck } from "../types/system/ErrorsCheck"

export const representativeValidator = (data: TRepresentative): boolean => {
  let ok = true

  if (!data.name || typeof data.name !== "string") ok = false
  if (!data.email || typeof data.email !== "string") ok = false
  if (!data.phone || typeof data.phone !== "string") ok = false
  if (
    (!data.registers.cpf || typeof data.registers.cpf !== "string") &&
    (!data.registers.cnpj || typeof data.registers.cnpj !== "string")
  )
    ok = false
  if (!data.address) ok = false

  return ok
}

export const newRepresentativeValidator = (
  data: TNewRepresentative
): TErrorsCheck => {
  let res: TErrorsCheck = {
    ok: true,
    fields: [],
  }

  if (!data.name || typeof data.name !== "string") {
    res.ok = false
    res.fields.push("nome")
  }
  if (!data.email || typeof data.email !== "string") {
    res.ok = false
    res.fields.push("email")
  }
  if (!data.phone || typeof data.phone !== "string") {
    res.ok = false
    res.fields.push("telefone")
  }
  if (!data.registers.cpf || typeof data.registers.cpf !== "string") {
    res.ok = false
    res.fields.push("cpf")
  }
  if (!data.registers.cnpj || typeof data.registers.cnpj !== "string") {
    res.ok = false
    res.fields.push("cnpj")
  }
  if (!data.address) {
    res.ok = false
    res.fields.push("endereço")
  }

  return res
}
