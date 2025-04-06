import { TNewOrder, TOrder } from "../types/data/order"
import { TErrorsCheck } from "../types/system/ErrorsCheck"

export const newOrderValidator = (data: TNewOrder): TErrorsCheck => {
  let res: TErrorsCheck = {
    ok: true,
    fields: [],
  }

  if (!data.client || typeof data.client !== "string") {
    res.ok = false
    res.fields.push("cliente")
  }
  if (
    !data.orderDate ||
    Number.isNaN(data.orderDate) ||
    (!Number.isNaN(data.orderDate) && data.orderDate <= 0)
  ) {
    res.ok = false
    res.fields.push("data do pedido")
  }
  if (
    Number.isNaN(data.deadline) ||
    (!Number.isNaN(data.deadline) && data.deadline <= 0)
  ) {
    res.ok = false
    res.fields.push("data de envio")
  }
  if (!data.emmitter || typeof data.emmitter !== "string") {
    res.ok = false
    res.fields.push("emissor")
  }
  if (!data.shippingType || typeof data.shippingType !== "string") {
    res.ok = false
    res.fields.push("envio")
  }
  if (!data.products || !Array.isArray(data.products)) {
    res.ok = false
    res.fields.push("produtos")
  }

  return res
}

export const orderValidator = (data: TOrder): TErrorsCheck => {
  return newOrderValidator(data as any)
}
