import { TPaymentStatus } from "./paymentStatus"

export type OrderSlip = {
  installment: number
  value: number
  dueDate: string
  status: TPaymentStatus
  barCode: string
  cleanCode: string
  nossoNumero: string
  txid: string
  qrCode: string
}
