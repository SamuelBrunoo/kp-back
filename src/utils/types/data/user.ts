import { TSafeEmmitter } from "./emmiter"
import { TWorker } from "./worker"

export type TFBUser = {
  active: boolean
  email: string
  extraRole: TUserExtraRole
  extraRoleId: string
  name: string
  userId: string
}

export type TUser = TFBUser & {
  id: string
  roleInfo?: TWorker | TSafeEmmitter
}

export type TUserExtraRole = "worker" | "emmitter"
