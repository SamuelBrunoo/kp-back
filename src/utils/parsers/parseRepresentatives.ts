import { TRepresentative } from "../types/data/representative"
import { TClient } from "../types/data/client"

type Props = {
  representatives: TRepresentative[]
  clients: TClient[]
}

const parseRepresentatives = ({ representatives, clients }: Props) => {
  let list: any[] = []

  representatives.forEach((i) => {
    const c = clients.filter(
      (client) => client.representative === i.id
    )

    const obj: TRepresentative = {
      ...i,
      clients: c,
    }

    list.push(obj)
  })

  return list
}

export default parseRepresentatives
