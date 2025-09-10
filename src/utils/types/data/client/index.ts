import { TDBClient } from "./dbClient"

export type TClient = TDBClient & {
  orders: string[]
}
