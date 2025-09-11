/*
 *  Typing
 */

/* Client */
import { TBasicClient } from "../types/data/client/basicClient"

/* Client */
import { TDBRepresentative } from "../types/data/accounts/representative/dbRepresentative"

/* Address */
import { TState } from "../types/data/address/state"

type Props = {
  representatives: TDBRepresentative[]
  client: TBasicClient
  states: TState[]
}

const parseClient = ({
  representatives,
  client,
  states,
}: Props): TBasicClient => {
  let data: TBasicClient

  data = {
    ...client,
  }

  return data
}

export default parseClient
