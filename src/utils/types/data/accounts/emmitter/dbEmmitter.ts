import { TBankCredentials } from "../../services/sicredi/data/credential"
import { TSafeEmmitter } from "./safeEmmitter"

export type TDBEmmitter = TSafeEmmitter & {
  bank: TBankCredentials
}
