import { AxiosError } from "axios"
import { service } from "../../.."
import { getApiError } from "../../../../utils/helpers/api/getApiErrors"
import { TApi } from "../../../types"
import { bankApiKey, baseURL } from ".."

export const printSlip: TApi["slips"]["print"] = async (
  params,
  credentials
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { slipCode } = params

      const bankResponse = await service
        .get(`${baseURL}/boletos/pdf`, {
          headers: {
            Authorization: `Bearer ${credentials.access_token}`,
            "x-api-key": bankApiKey,
          },
          params: {
            linhaDigitavel: slipCode,
          },
          responseType: "stream",
        })
        .then((res) => res)
        .catch((err: AxiosError) => resolve(getApiError(err)))

      if (bankResponse && bankResponse.status === 201) {
        resolve(bankResponse)
      } else throw new Error("Erro ao gerar o boleto.")
    } catch (error) {
      reject({
        error:
          "Não foi possível cadastrar o boleto. Verifique as informações e tente novamente.",
      })
    }
  })
}
