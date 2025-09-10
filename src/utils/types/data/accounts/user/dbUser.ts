import { TUserExtraRole } from "./userExtraRole"

export type TDBUser = {
  active: boolean
  email: string
  extraRole: TUserExtraRole
  extraRoleId: string
  name: string
  userId: string
}
