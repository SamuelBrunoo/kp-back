import { OrderSlip } from "../payment/slipOrder"
import { TOrderDetailsProduct } from "../product/orderPageList"
import { TOPStatus } from "../status/orderProduct"

export type TPageListOrder = {
  id: string
  code: string | number
  clientName: string
  orderDate: string
  value: number
  quantity: number
  status: TOPStatus
  details: {
    productionLineId: string | null
    products: TOrderDetailsProduct[]
    additional: TPageListOrderDetailsAdditional
    paymentSlips?: OrderSlip[]
  }
}

type TPageListOrderDetailsAdditional = {
  clientName: string
  clientRegister: string
  clientStateInscription: string | null
  orderDate: string
  observations: string
  deadline: string
  shippedAt: string | null
  valueTotal: number
  valueCommission: number
  valueLiquid: number
  paymentMethod: string
  hasInstallments: string
  installments: number
  paidInstallments: number
  emmitter: string
  representative: string | null
  address: string
}
