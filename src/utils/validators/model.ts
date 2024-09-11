import { TNewModel } from "../types/data/model"

export const modelValidator = (data: TNewModel): boolean => {
  let ok = true

  if (!data.code || typeof data.code !== "string") ok = false
  if (!data.type || typeof data.type !== "string") ok = false
  if (!data.name || typeof data.name !== "string") ok = false
  if (
    !data.price ||
    Number.isNaN(data.price) ||
    (!Number.isNaN(data.price) && data.price < 1)
  )
    ok = false

  return ok
}
