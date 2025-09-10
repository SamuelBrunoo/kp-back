import { TBasicEmmitter } from "./basicEmmitter"

export type TEmmitter = TBasicEmmitter & {
  orders: string[]
}
