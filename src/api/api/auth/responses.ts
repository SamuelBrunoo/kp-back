import { TS_Credential } from "../../../utils/types/data/services/sicredi/data/credential"
import { TDefaultRes } from "../../types/responses"

export type TApi_Responses_Auth = {
  auth: {
    token: Promise<TDefaultRes<TS_Credential>>
  }
}
