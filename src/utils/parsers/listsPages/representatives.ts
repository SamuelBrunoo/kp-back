import {
  getRepMonthOrdersResume,
  getRepYearOrdersResume,
} from "../../reports/representative"

/*
 *  Typing
 */

/* Order */
import { TBasicOrder } from "../../types/data/order/basicOrder"

/* Representative */
import { TPageListRepresentative } from "../../types/data/accounts/representative/pageListRepresentative"
import { TRepresentative } from "../../types/data/accounts/representative"
import { TBasicClient } from "../../types/data/client/basicClient"

type Props = {
  clients: TBasicClient[]
  representatives: TRepresentative[]
  orders: TBasicOrder[]
}

export const parseRepresentativesPageList = ({
  representatives,
  clients,
  orders,
}: Props): TPageListRepresentative[] => {
  let list: TPageListRepresentative[] = []

  let clientsList = clients

  representatives.forEach((rep) => {
    try {
      const repClients = clientsList.filter((c) => c.representative === rep.id)
      const lastingClients = clientsList.filter(
        (c) => c.representative !== rep.id
      )

      clientsList = lastingClients

      const repOrders = orders.filter(
        (order) => order.representative === rep.id
      )

      const monthlyData = getRepMonthOrdersResume(repOrders, rep)
      const yearlyData = getRepYearOrdersResume(repOrders, rep)

      const isDeletable = false

      const obj: TPageListRepresentative = {
        id: rep.id,
        name: rep.name,
        clients: repClients.length,
        monthTotal: monthlyData.total,
        monthSells: monthlyData.sales,
        yearSells: yearlyData.sales,
        yearTotal: yearlyData.total,
        deletable: isDeletable,
        details: {
          clients: repClients,
        },
      }

      list.push(obj)
    } catch (error) {}
  })

  return list
}
