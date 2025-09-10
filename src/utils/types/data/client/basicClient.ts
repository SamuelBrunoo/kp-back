import { TDBClient } from "./dbClient"

export type TBasicClient = TDBClient & {
  id: string
}
