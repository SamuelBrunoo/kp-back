/*
 *  Typing
 */

/* Representative */
import { TBasicRepresentative } from "../types/data/accounts/representative/basicRepresentative"
import { TRepresentative } from "../types/data/accounts/representative"

/* Client */
import { TBasicClient } from "../types/data/client/basicClient"
import { TClient } from "../types/data/client"

/* Address */
import { TState } from "../types/data/address/state"

/* Order */
import { TBasicOrder } from "../types/data/order/basicOrder"

type Props = {
  representative: TBasicRepresentative
  clients: TBasicClient[]
  orders: TBasicOrder[]
}

export const parseRepresentative = ({ representative, clients }: Props) => {
  const representativeClients = clients.filter(
    (client) => client.representative === representative.id
  )

  const clientsList = representativeClients as TClient[]

  let obj: TRepresentative = {
    ...representative,
    clients: clientsList,
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
