export const orderValidator = (data: any): boolean => {
  let ok = true

  if (!data.client || typeof data.client !== "string") ok = false
  if (!data.orderDate || typeof data.orderDate !== "string") ok = false
  if (Number.isNaN(data.value) || (!Number.isNaN(data.value) && data.value < 0))
    ok = false
  if (!data.status || typeof data.status !== "string") ok = false
  if (!data.deadline || typeof data.deadline !== "string") ok = false
  if (!data.representative || typeof data.representative !== "string")
    ok = false
  if (!data.shippingType || typeof data.shippingType !== "string") ok = false
  if (!data.emmitter || typeof data.emmitter !== "string") ok = false

  return ok
}
