import { TCity } from "../../types/data/city"
import { TBaseClient, TClient, TPageListClient } from "../../types/data/client"
import { TBasicOrder } from "../../types/data/order"
import { TState } from "../../types/data/state"

type Props = {
  clients: TBaseClient[]
  orders: TBasicOrder[]
  cities: TCity[]
  states: TState[]
}

export const parseClientsPageList = ({
  clients,
  orders,
  cities,
  states,
}: Props): TPageListClient[] => {
  let list: TPageListClient[] = []

  try {
    clients.forEach((i) => {
      const clientOrders = orders.filter((o) => o.client === i.id)

      const ordersCount = clientOrders.length

      // Address info

      const city = cities.find((c) => c.code === i.address.city)
      const state = states.find((s) => s.code === i.address.state)

      const addressTxt = `${i.address.street}, nº${i.address.number} - ${city.name}, ${state.abbr}`

      // Deletable
      const isClientDeletable = ordersCount === 0

      const obj: TPageListClient = {
        id: i.id,
        name: i.clientName,
        address: addressTxt,
        document: i.documents.register,
        stateIncription: i.documents.stateInscription,
        orders: ordersCount,
        deletable: isClientDeletable,
      }

      list.push(obj)
    })
  } catch (error) {}

  return list
}
