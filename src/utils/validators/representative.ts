import { TRepresentative } from "../types/data/representative"

export const representativeValidator = (data: TRepresentative): boolean => {
  let ok = true

  if (!data.name || typeof data.name !== "string") ok = false
  if (!data.email || typeof data.email !== "string") ok = false
  if (!data.phone || typeof data.phone !== "string") ok = false
  if (
    (!data.cpf || typeof data.cpf !== "string") &&
    (!data.cnpj || typeof data.cnpj !== "string")
  )
    ok = false
  if (!data.address) ok = false

  return ok
}
