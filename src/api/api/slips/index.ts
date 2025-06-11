import { TApi } from "../../types"
import { service } from "../.."
import { AxiosError } from "axios"
import { TApi_Params_Slips as TParams } from "./params"
import { TApi_Responses_Slips as TResponses } from "./responses"
import { getApiError } from "../../../utils/helpers/api/getApiErrors"
import { TS_Credential } from "../../../utils/types/data/services/sicredi/data/credential"

const baseURL = "/cobranca/boleto/v1"

export const register: TApi["slips"]["register"] = async (slipConfig) => {
  return new Promise(async (resolve, reject) => {
    try {
      const body = slipConfig

      await service
        .post(`${baseURL}/boletos`, body)
        .then((res) => {
          if (res.status === 201) {
            const info = res.data.data

            resolve({
              ok: true,
              data: info,
            })
          } else {
            console.log(
              "[API SICREDI] Cadastro de boleto: ",
              slipConfig,
              "\n",
              res
            )
            resolve(getApiError(res))
          }
        })
        .catch((err: AxiosError) => {
          console.error(
            "[API SICREDI] Cadastro de boleto: ",
            slipConfig,
            "\n",
            err
          )
          resolve(getApiError(err))
        })
    } catch (error) {
      reject({
        error:
          "Não foi possível cadastrar o boleto. Verifique as informações e tente novamente.",
      })
    }
  })
}

export type TApi_Slips = {
  register: (
    p: TParams["slips"]["register"],
    credentials: TS_Credential
  ) => TResponses["slips"]["register"]
}

export const apiSlips: TApi["slips"] = {
  register: register,
}
