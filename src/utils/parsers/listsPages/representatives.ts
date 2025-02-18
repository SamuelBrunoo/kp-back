import {
  getRepMonthOrdersResume,
  getRepYearOrdersResume,
} from "../../reports/month"
import { TBasicOrder } from "../../types/data/order"
import {
  TPageListRepresentative,
  TRepresentative,
} from "../../types/data/representative"

type Props = {
  clients: {
    id: string
    representative: string
  }[]
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

      const repOrders = orders.filter((order) => order.client === rep.id)

      const monthlyData = getRepMonthOrdersResume(repOrders)
      const yearlyData = getRepYearOrdersResume(repOrders)

      const isDeletable = false

      const obj: TPageListRepresentative = {
        id: rep.id,
        name: rep.name,
        clients: repClients.length,
        monthTotal: monthlyData.total,
        monthSells: monthlyData.sales,
        yearSells: yearlyData.total,
        yearTotal: yearlyData.sales,
        deletable: isDeletable,
      }

      list.push(obj)
    } catch (error) {}
  })

  return list
}
