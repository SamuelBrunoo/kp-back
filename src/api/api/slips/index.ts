import { TApi } from "../../types"
import { TApi_Params_Slips as TParams } from "./params"
import { TApi_Responses_Slips as TResponses } from "./responses"
import {
  TBankCredentials,
  TS_Credential,
} from "../../../utils/types/data/services/sicredi/data/credential"

import dotenv from "dotenv"

import { register } from "./calls/register"
import { printSlip } from "./calls/printSlip"

dotenv.config()

export const baseURL = "/cobranca/boleto/v1"

export const bankApiKey = process.env.BANK_API_API_KEY

export type TApi_Slips = {
  register: (
    p: TParams["slips"]["register"],
    credentials: TS_Credential,
    bankCredentials: TBankCredentials
  ) => TResponses["slips"]["register"]
  print: (
    p: TParams["slips"]["print"],
    credentials: TS_Credential
  ) => TResponses["slips"]["print"]
}

export const apiSlips: TApi["slips"] = {
  register: register,
  print: printSlip,
}
