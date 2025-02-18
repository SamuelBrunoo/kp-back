import {
  TNewRepresentative,
  TRepresentative,
} from "../types/data/representative"

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
): boolean => {
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
