export const colorValidator = (data: any): boolean => {
  let ok = true

  if (!data.code || typeof data.code !== "string") ok = false
  if (!data.name || typeof data.name !== "string") ok = false

  return ok
}
