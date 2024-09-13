export const clientValidator = (data: any): boolean => {
  let ok = true

  if (
    (!data.name || typeof data.name !== "string") &&
    (!data.socialRole || typeof data.socialRole !== "string")
  )
    ok = false
  if (!data.stateRegister || typeof data.stateRegister !== "string") ok = false
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
