import { TOrderStatus } from "../../status/order"

export type TStatisticsOrder = {
  totalOrders: number
  amountByStatus: {
    [key in TOrderStatus]: number
  }
  totalAmount: number
}
