import { TSafeEmmitter } from "../emmitter/safeEmmitter"
import { TWorker } from "../worker"
import { TDBUser } from "./dbUser"

export type TUser = TDBUser & {
  id: string
  roleInfo?: TWorker | TSafeEmmitter
}
