import { TBaseClient, TClient } from "../types/data/client"
import { TColor } from "../types/data/color"
import { TFBModel, TModel, TModelDetails } from "../types/data/model"
import { TOrder } from "../types/data/order"
import { TProdType } from "../types/data/prodType"
import { TProduct } from "../types/data/product"
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
