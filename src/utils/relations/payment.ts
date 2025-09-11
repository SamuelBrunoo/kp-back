import { TPaymentMethod } from "../types/data/payment/paymentMethod"

export const paymentRelation: { [key in TPaymentMethod]: string } = {
  pix: "Pix",
  slip: "Boleto",
  cash: "Dinheiro",
}
