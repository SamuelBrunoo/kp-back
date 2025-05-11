import { TOPStatus, TOPStatusWeight } from "../types/data/order"

export const getListOverralStatus = (list: any): TOPStatus => {
  let currentOrderStatusWeight = 1

  list.forEach((i) => {
    const statusWeight = TOPStatusWeight[i.status]
    currentOrderStatusWeight = Math.max(statusWeight, currentOrderStatusWeight)
  })

  const orderStatusName = Object.entries(TOPStatusWeight).find(
    ([_, value]) => value === currentOrderStatusWeight
  )[0] as TOPStatus

  const newStatus: TOPStatus = orderStatusName

  return newStatus
}
