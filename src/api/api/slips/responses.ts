import { TBankSlipRegister } from "../../../utils/types/data/payment"
import { TDefaultRes } from "../../types/responses"

export type TApi_Responses_Slips = {
  slips: {
    register: Promise<TDefaultRes<TBankSlipRegister>>
  }
}
