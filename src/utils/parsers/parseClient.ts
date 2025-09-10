import { TBaseClient } from "../types/data/client"
import {TDBRepresentative } from "../types/data/representative"
import { TState } from "../types/data/address/state"

type Props = {
  representatives:TDBRepresentative[]
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
