import { TClient, TClientType, TNewClient } from "../types/data/client"
import { TErrorsCheck } from "../types/system/ErrorsCheck"
import { addressValidator } from "./address"
import { emailValidator } from "./email"

export const newClientValidator = (data: TNewClient): TErrorsCheck => {
  let res: TErrorsCheck = {
    ok: true,
    fields: [],
  }

  if (
    !data.type ||
    typeof data.type !== "string" ||
    !["juridical", "physical" as TClientType].includes(data.type)
  ) {
    res.ok = false
    res.fields.push("tipo")
  }

  if (data.type === "juridical") {
    if (!data.socialRole || typeof data.socialRole !== "string") {
      res.ok = false
      res.fields.push("razão social")
    }
  }

  if (!data.clientName || typeof data.clientName !== "string") {
    res.ok = false
    res.fields.push("nome do cliente")
  }

  if (!data.personName || typeof data.personName !== "string") {
    res.ok = false
    res.fields.push("nome do responsável")
  }

  if (!!data.representative) {
    if (
      typeof data.representative !== "string" ||
      data.representative.trim().length < 1
    ) {
      res.ok = false
      res.fields.push("representante")
    }
  }

  if (!data.documents.register || typeof data.documents.register !== "string") {
    res.ok = false
    res.fields.push("documento")
  }

  if (data.documents.stateInscription) {
    if (
      !data.documents.stateInscription ||
      typeof data.documents.stateInscription !== "string"
    ) {
      res.ok = false
      res.fields.push("inscrição estadual")
    }
  }

  if (data.documents.cityInscription) {
    if (
      !data.documents.cityInscription ||
      typeof data.documents.cityInscription !== "string"
    ) {
      res.ok = false
      res.fields.push("inscrição municipal")
    }
  }

  if (!!data.representative && typeof data.representative !== "string") {
    res.ok = false
    res.fields.push("representante")
  }

  // Contact

  if (
    !data.email ||
    typeof data.email !== "string" ||
    !emailValidator(data.email)
  ) {
    res.ok = false
    res.fields.push("email")
  }

  if (
    !data.phone1 ||
    typeof data.phone1 !== "string" ||
    !(data.phone1.length > 9 && data.phone1.length < 12)
  ) {
    res.ok = false
    res.fields.push("telefone 1")
  }

  if (!!data.phone2) {
    if (
      typeof data.phone2 !== "string" ||
      !(data.phone2.length > 9 && data.phone2.length < 12)
    ) {
      res.ok = false
      res.fields.push("telefone 2")
    }
  }

  const addressValidation = addressValidator(data.address)

  if (addressValidation.ok) {
    res.ok = addressValidation.ok
    res.fields.push(`endereço: - ${addressValidation.fields.join(", ")}`)
  }

  return res
}

export const clientValidator = (data: TClient): TErrorsCheck => {
  let res: TErrorsCheck = {
    ok: true,
    fields: [],
  }

  if (!data.id || typeof data.id !== "string") {
    res.ok = false
    res.fields.push("id")
  }

  return res
}
