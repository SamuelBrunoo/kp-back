export const orderValidator = (data: any): boolean => {
  let ok = true

  if (!data.client || typeof data.client !== "string") ok = false
  if (
    Number.isNaN(data.orderDate) ||
    (!Number.isNaN(data.orderDate) && data.orderDate <= 0)
  )
    ok = false
  if (
    Number.isNaN(data.deadline) ||
    (!Number.isNaN(data.deadline) && data.deadline <= 0)
  )
    ok = false
  if (Number.isNaN(data.value) || (!Number.isNaN(data.value) && data.value < 0))
    ok = false
  if (!data.status || typeof data.status !== "string") ok = false
  if (!data.shippingType || typeof data.shippingType !== "string") ok = false
  if (!data.emmitter || typeof data.emmitter !== "string") ok = false

  return ok
}
