import { TBasicOrder } from "../types/data/order/basicOrder"
import { TDBRepresentative } from "../types/data/accounts/representative/dbRepresentative"

export const getRepMonthOrdersResume = (
  orders: TBasicOrder[],
  representative: TDBRepresentative
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

    const isCommissionFixed =
      representative.paymentConfig.commissionType === "fixed"

    if (
      orderDate.getMonth() === today.month &&
      orderDate.getFullYear() === today.year
    ) {
      res.sales += 1
      res.total +=
        order.totals.commission ?? isCommissionFixed
          ? representative.paymentConfig.value
          : order.totals.value * (representative.paymentConfig.value / 100)
    }
  })

  return res
}

export const getRepYearOrdersResume = (
  orders: TBasicOrder[],
  representative: TDBRepresentative
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

  const isCommissionFixed =
    representative.paymentConfig.commissionType === "fixed"

  orders.forEach((order) => {
    const orderDate = new Date(order.orderDate)

    if (orderDate.getFullYear() === todayYear) {
      res.sales += 1
      res.total +=
        order.totals.commission ?? isCommissionFixed
          ? representative.paymentConfig.value
          : order.totals.value * (representative.paymentConfig.value / 100)
    }
  })

  return res
}
