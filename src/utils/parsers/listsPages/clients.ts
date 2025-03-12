import { TCity } from "../../types/data/city"
import { TBaseClient, TClient, TPageListClient } from "../../types/data/client"
import { TBasicOrder } from "../../types/data/order"
import { TBasicRepresentative } from "../../types/data/representative"
import { TState } from "../../types/data/state"

type Props = {
  representatives: TBasicRepresentative[]
  clients: TBaseClient[]
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
      const state = states.find(s => s.id === i.address.state)
      
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
            state: state.name
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
    console.log("Erro", error)
  }

  return list
}
