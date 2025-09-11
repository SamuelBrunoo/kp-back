import { TBasicClient } from "./basicClient"

export type TClient = TBasicClient & {
  orders: string[]
}
