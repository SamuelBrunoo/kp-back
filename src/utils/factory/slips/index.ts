import { outputBankSlipRegister } from "./outputBankSlipRegister"
import { outputPayerInfo } from "./outputPayerInfo"
import { outputReceiverInfo } from "./outputReceiverInfo"

export const slipsFactory = {
  bankSlipRegister: outputBankSlipRegister,
  payerInfo: outputPayerInfo,
  receiverInfo: outputReceiverInfo,
}
