import {
  TBasicRepresentative,
  TRepresentative,
} from "../types/data/representative"
import { TBaseClient, TClient } from "../types/data/client"
import { TState } from "../types/data/state"
import { TBasicOrder } from "../types/data/order"
import parseClients from "./tableData/parseClients"

type Props = {
  representative: TBasicRepresentative
  clients: TBaseClient[]
  orders: TBasicOrder[]
}

export const parseRepresentative = ({ representative, clients }: Props) => {
  const representativeClients = clients.filter(
    (client) => client.representative === representative.id
  )

  let obj: TRepresentative = {
    ...representative,
    clients: parseClients(representativeClients),
    orders: [],
  }

  return obj
}

export const parseRepresentatives = ({
  representatives,
  clients,
  states,
}: {
  representatives: TRepresentative[]
  clients: TClient[]
  states: TState[]
}) => {
  let list: any[] = []

  representatives.forEach((i) => {
    const c = clients.filter((client) => client.representative === i.id)

    const obj: TRepresentative = {
      ...i,
      clients: c,
    }

    list.push(obj)
  })

  return list
}
