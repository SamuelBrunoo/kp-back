/*
 *  Typing
 */

/* Order */
import { TOrder } from "../types/data/order"

export const sumOrdersValues = (orders: TOrder[]) => {
  let value = 0

  value = orders.reduce((prev, current) => prev + current.totals.value, 0)

  return value
}
