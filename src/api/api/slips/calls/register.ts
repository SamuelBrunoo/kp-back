import { AxiosError } from "axios"
import { service } from "../../.."
import { getApiError } from "../../../../utils/helpers/api/getApiErrors"
import { TApi } from "../../../types"
import { baseURL } from ".."

export const register: TApi["slips"]["register"] = async (
  slipConfig,
  credentials,
  bankCredentials
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const body = slipConfig

      await service
        .post(`${baseURL}/boletos`, body, {
          headers: {
            Authorization: `Bearer ${credentials.access_token}`,
            cooperativa: bankCredentials.cooperativa,
            posto: bankCredentials.posto,
          },
        })
        .then((res) => {
          if (res.status === 201) {
            const info = res.data

            resolve({ ok: true, data: info })
          } else resolve(getApiError(res))
        })
        .catch((err: AxiosError) => resolve(getApiError(err)))
    } catch (error) {
      reject({
        error:
          "Não foi possível cadastrar o boleto. Verifique as informações e tente novamente.",
      })
    }
  })
}
