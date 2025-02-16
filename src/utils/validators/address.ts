import { TAddress } from "../types/data/address"
import { TErrorsCheck } from "../types/system/ErrorsCheck"

export const addressValidator = (data: TAddress): TErrorsCheck => {
  let res: TErrorsCheck = {
    ok: true,
    fields: [],
  }

  if (!data.country || typeof data.country !== "string") {
    res.ok = false
    res.fields.push("país")
  }

  if (!data.state || typeof data.state !== "string") {
    res.ok = false
    res.fields.push("estado")
  }

  if (!data.city || typeof data.city !== "string") {
    res.ok = false
    res.fields.push("cidade")
  }

  if (
    !data.cep ||
    typeof data.cep !== "string" ||
    data.neighborhood.replace(/\D/g, "").length !== 8
  ) {
    res.ok = false
    res.fields.push("cep")
  }

  if (!data.neighborhood || typeof data.neighborhood !== "string") {
    res.ok = false
    res.fields.push("bairro")
  }

  if (!data.street || typeof data.street !== "string") {
    res.ok = false
    res.fields.push("rua")
  }

  if (
    !data.number ||
    typeof data.number !== "string" ||
    Number.isNaN(data.number) ||
    Number(data.number) < 1
  ) {
    res.ok = false
    res.fields.push("número")
  }

  if (!!data.complement) {
    if (typeof data.complement !== "string") {
      res.ok = false
      res.fields.push("complemento")
    }
  }

  return res
}
