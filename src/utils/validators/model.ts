import { TNewModel } from "../types/data/model"
import { TErrorsCheck } from "../types/system/ErrorsCheck"

export const modelValidator = (data: TNewModel): TErrorsCheck => {
  let res: TErrorsCheck = {
    ok: true,
    fields: [],
  }

  if (!data.code || typeof data.code !== "string") {
    res.ok = false
    res.fields.push("código")
  }
  if (
    !data.type ||
    typeof data.type !== "string" ||
    !["pendant", "tableNecklace"].includes(data.type)
  ) {
    res.ok = false
    res.fields.push("tipo")
  }
  if (!data.name || typeof data.name !== "string") {
    res.ok = false
    res.fields.push("nome")
  }
  if (!data.colors || !Array.isArray(data.colors)) {
    res.ok = false
    res.fields.push("cores")
  }
  if (!data.storage) {
    res.ok = false
    res.fields.push("estoque")
  }
  if (
    !data.price ||
    Number.isNaN(data.price) ||
    (!Number.isNaN(data.price) && data.price < 1)
  ) {
    res.ok = false
    res.fields.push("preço")
  }

  return res
}
