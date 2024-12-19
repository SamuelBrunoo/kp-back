import { TFBOrder, TNewOrder } from "../../types/data/order"

export const treatNewOrder = (data: TNewOrder, extra: { newCode: string }) => {
  const prods: TFBOrder["products"] = data.products.map((p) => ({
    id: p.id,
    quantity: p.quantity,
    status: !p.storage.has
      ? "done"
      : p.storage.quantity - p.quantity < 0
      ? "queued"
      : "done",
  }))

  let obj: TFBOrder = {
    code: extra.newCode,
    client: data.client,
    orderDate: data.orderDate,
    value: data.value,
    status: data.status,
    products: prods,
    productsIds: prods.map((p) => p.id),
    deadline: data.deadline,
    payment: {
      ...data.payment,
      installments: +(data.payment.installments as string),
    },
    shippingType: data.shippingType,
    emmitter: data.emmitter,
  }

  return obj
}
