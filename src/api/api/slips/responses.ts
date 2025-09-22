import { AxiosResponse } from "axios"
import { TBankSlipRegister } from "../../../utils/types/data/payment/slipBank"
import { TDefaultRes } from "../../types/responses"

export type TApi_Responses_Slips = {
  slips: {
    register: Promise<TDefaultRes<TBankSlipRegister>>
    print: Promise<AxiosResponse>
  }
}
