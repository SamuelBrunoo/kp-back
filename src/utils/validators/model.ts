import { TNewModel } from "../types/data/model"

export const modelValidator = (
  data: TNewModel
): {
  status: boolean
  fields: string[]
} => {
  let res = {
    status: true,
    fields: [],
  }

  if (!data.code || typeof data.code !== "string") {
    res.status = false
    res.fields.push("código")
  }
  if (
    !data.type ||
    typeof data.type !== "string" ||
    !["pendant", "tableNecklace"].includes(data.type)
  ) {
    res.status = false
    res.fields.push("tipo")
  }
  if (!data.name || typeof data.name !== "string") {
    res.status = false
    res.fields.push("nome")
  }
  if (!data.colors || !Array.isArray(data.colors)) {
    res.status = false
    res.fields.push("cores")
  }
  if (!data.storage) {
    res.status = false
    res.fields.push("estoque")
  }
  if (
    !data.price ||
    Number.isNaN(data.price) ||
    (!Number.isNaN(data.price) && data.price < 1)
  ) {
    res.status = false
    res.fields.push("preço")
  }

  return res
}
