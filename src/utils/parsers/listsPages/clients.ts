/*
 *  Typing
 */

/* Client */
import { TBasicClient } from "../../types/data/client/basicClient"
import { TPageListClient } from "../../types/data/client/pageListClient"

/* Order */
import { TBasicOrder } from "../../types/data/order/basicOrder"

/* Representative */
import { TBasicRepresentative } from "../../types/data/accounts/representative/basicRepresentative"

/* Address */
import { TCity } from "../../types/data/address/city"
import { TState } from "../../types/data/address/state"

type Props = {
  representatives: TBasicRepresentative[]
  clients: TBasicClient[]
  orders: TBasicOrder[]
  cities: TCity[]
  states: TState[]
}

export const parseClientsPageList = ({
  representatives,
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

      // Address
      const state = states.find((s) => s.id === i.address.state)
      const city = cities.find((s) => s.id === i.address.city)

      // Representative
      const representative = i.representative
        ? representatives.find((r) => r.id === i.representative).name
        : "Não atribuído"

      // Deletable
      const isClientDeletable = ordersCount === 0

      const obj: TPageListClient = {
        id: i.id,
        name: i.clientName,
        socialRole: i.socialRole,
        type: i.type,
        address: i.address,
        cep: i.address.cep,
        document: i.documents.register,
        stateIncription: i.documents.stateInscription,
        orders: ordersCount,
        deletable: isClientDeletable,

        details: {
          address: {
            ...i.address,
            state: state?.name ?? "-",
            city: city?.name ?? "-",
          },
          clientName: i.clientName,
          documents: i.documents,
          email: i.email,
          id: i.id,
          orders: clientOrders.map((o) => o.id),
          personName: i.personName,
          phone1: i.phone1,
          phone2: i.phone2,
          representative: representative,
          socialRole: i.socialRole,
          type: i.type,
        },
      }

      list.push(obj)
    })
  } catch (error) {
    console.log("Error", error)
    list = []
  }

  return list
}
