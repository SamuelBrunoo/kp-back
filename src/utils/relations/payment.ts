import { TPaymentMethod } from "../types/data/payment"

export const paymentRelation: { [key in TPaymentMethod]: string } = {
  check: "Cheque",
  pix: "Pix",
  slip: "Boleto",
  ted: "TED",
}
