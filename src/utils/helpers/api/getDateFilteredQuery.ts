import * as fb from "firebase/firestore"
import { collections } from "../../../network/firebase"

type TDateFilter = {
  start: string | null
  end: string | null
}

export const getRepresentativesQuery = (dateFilter: TDateFilter): fb.Query => {
  let ordersQuery: fb.Query = fb.query(collections.orders)

  if (dateFilter.start && dateFilter.end) {
    ordersQuery = fb.query(
      collections.orders,
      fb.where("representative", "!=", null),
      fb.where("orderDate", ">=", dateFilter.start),
      fb.where("orderDate", "<=", dateFilter.end)
    )
  } else if (dateFilter.start && !dateFilter.end) {
    ordersQuery = fb.query(
      collections.orders,
      fb.where("representative", "!=", null),
      fb.where("orderDate", ">=", dateFilter.start)
    )
  } else if (!dateFilter.start && dateFilter.end) {
    ordersQuery = fb.query(
      collections.orders,
      fb.where("representative", "!=", null),
      fb.where("orderDate", "<=", dateFilter.end)
    )
  } else if (!dateFilter.start && !dateFilter.end) {
    ordersQuery = fb.query(
      collections.orders,
      fb.where("representative", "!=", null)
    )
  }

  return ordersQuery
}
