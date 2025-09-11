import { TBasicClient } from "../client/basicClient"
import { TBasicOrder } from "./basicOrder"

export type TOrder = TBasicOrder & {
  client: TBasicClient
}
