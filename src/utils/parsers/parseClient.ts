import { TBaseClient } from "../types/data/client"
import { TFBRepresentative } from "../types/data/representative"
import { TState } from "../types/data/state"

type Props = {
  representatives: TFBRepresentative[]
  client: TBaseClient
  states: TState[]
}

const parseClient = ({
  representatives,
  client,
  states,
}: Props): TBaseClient => {
  let data: TBaseClient

  data = {
    ...client,
  }

  return data
}

export default parseClient
