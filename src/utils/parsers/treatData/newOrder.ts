import { TFBOrder, TNewOrder } from "../../types/data/order"

export const treatNewOrder = (data: TNewOrder, extra: { newCode: string }) => {
  const prods = data.products.map((p) => ({
    id: p.id,
    quantity: p.quantity,
    status: p.status,
  }))

  let obj: TFBOrder = {
    code: extra.newCode,
    client: data.client,
    orderDate: data.orderDate,
    value: data.value,
    status: data.status,
    products: prods,
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