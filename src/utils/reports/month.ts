import { TBasicOrder } from "../types/data/order"

export const getRepMonthOrdersResume = (
  orders: TBasicOrder[]
): {
  sales: number
  total: number
} => {
  let res = {
    sales: 0,
    total: 0,
  }

  const d = new Date()

  const today = {
    date: d.getDate(),
    month: d.getMonth(),
    year: d.getFullYear(),
  }

  orders.forEach((order) => {
    const orderDate = new Date(order.orderDate)

    if (
      orderDate.getMonth() === today.month &&
      orderDate.getFullYear() === today.year
    ) {
      res.sales += 1
      res.total += order.totals.commission
    }
  })

  return res
}

export const getRepYearOrdersResume = (
  orders: TBasicOrder[]
): {
  sales: number
  total: number
} => {
  let res = {
    sales: 0,
    total: 0,
  }

  const d = new Date()

  const todayYear = d.getFullYear()

  orders.forEach((order) => {
    const orderDate = new Date(order.orderDate)

    if (orderDate.getFullYear() === todayYear) {
      res.sales += 1
      res.total += order.totals.commission
    }
  })

  return res
}
