import { TDBOrder } from "./dbOrder"

export type TBasicOrder = TDBOrder & {
  id: string
}
