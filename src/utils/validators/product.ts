import { TNewProduct, TProduct } from "../types/data/product"
import { TErrorsCheck } from "../types/system/ErrorsCheck"

export const newProductValidator = (data: TNewProduct): TErrorsCheck => {
  let res: TErrorsCheck = {
    ok: true,
    fields: [],
  }

  if (!data.type || typeof data.type !== "string") {
    res.ok = false
    res.fields.push("tipo")
  }

  if (!data.model || typeof data.model !== "string") {
    res.ok = false
    res.fields.push("modelo")
  }

  if (!data.color || typeof data.color !== "string") {
    res.ok = false
    res.fields.push("cor")
  }

  if (!data.code || typeof data.code !== "string") {
    res.ok = false
    res.fields.push("código")
  }

  if (
    !data.storage ||
    data.storage.has === undefined ||
    Number.isNaN(data.storage.quantity) ||
    (!Number.isNaN(data.storage.quantity) && data.storage.quantity < 0) ||
    !data.storage ||
    data.storage.has === undefined ||
    data.storage.quantity === undefined ||
    Number.isNaN(data.storage.quantity) ||
    (data.storage.has && +data.storage.quantity < 0)
  ) {
    res.ok = false
    res.fields.push("estoque")
  }

  if (typeof data.active == "undefined") {
    res.ok = false
    res.fields.push("status")
  }

  return res
}

export const productValidator = (data: TProduct): TErrorsCheck => {
  let res: TErrorsCheck = {
    ok: true,
    fields: [],
  }

  if (!data.id || typeof data.id !== "string") {
    res.ok = false
    res.fields.push("id")
  }

  if (!data.type || typeof data.type !== "string") {
    res.ok = false
    res.fields.push("tipo")
  }

  if (!data.name || typeof data.name !== "string") {
    res.ok = false
    res.fields.push("nome")
  }

  if (!data.model || typeof data.model !== "string") {
    res.ok = false
    res.fields.push("modelo")
  }

  if (!data.color || typeof data.color !== "string") {
    res.ok = false
    res.fields.push("cor")
  }

  if (!data.code || typeof data.code !== "string") {
    res.ok = false
    res.fields.push("código")
  }

  if (
    !data.storage ||
    data.storage.has === undefined ||
    Number.isNaN(data.storage.quantity) ||
    (!Number.isNaN(data.storage.quantity) && data.storage.quantity < 0) ||
    !data.storage ||
    data.storage.has === undefined ||
    data.storage.quantity === undefined ||
    Number.isNaN(data.storage.quantity) ||
    (data.storage.has && +data.storage.quantity < 0)
  ) {
    res.ok = false
    res.fields.push("estoque")
  }

  return res
}
