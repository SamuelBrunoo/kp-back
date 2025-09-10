import { TBasicRepresentative } from "./basicRepresentative"

export type TRepresentative = TBasicRepresentative & {
  clients: TClient[]
  orders: string[]
}
