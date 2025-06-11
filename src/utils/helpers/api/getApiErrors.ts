import axios, { AxiosError, AxiosResponse } from "axios"
import { defaultErrors } from "../../../api"

export const getApiError = (data: AxiosResponse | AxiosError): any => {
  try {
    if (
      axios.isAxiosError(data) &&
      String(data.response?.status).startsWith("4")
    ) {
      const backData = data.response?.data as any

      return {
        ok: false,
        error: {
          message: backData.error,
        },
      }
    } else {
      throw new Error()
    }
  } catch (error) {
    return defaultErrors.connection
  }
}
