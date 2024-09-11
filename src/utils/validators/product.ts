import { TProduct } from "../types/data/product"

export const productValidator = (data: any): boolean => {
  let ok = true

  if (!data.type || typeof data.type !== "string") ok = false
  if (!data.code || typeof data.code !== "string") ok = false
  if (!data.color || typeof data.color !== "string") ok = false
  if (!data.model || typeof data.model !== "string") ok = false
  if (
    !data.storage ||
    data.storage.has === undefined ||
    Number.isNaN(data.storage.quantity) ||
    (!Number.isNaN(data.storage.quantity) && data.storage.quantity < 0)
  )
    ok = false

  return ok
}
