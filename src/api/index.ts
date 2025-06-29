import axios from "axios"
import { TApi } from "./types"
import { jwtDecode } from "jwt-decode"
import dotenv from "dotenv"

// Api

import { TDefaultBodyRes, TErrorResponse } from "./types"
import { apiAuth } from "./api/auth"
import { apiSlips } from "./api/slips"

dotenv.config()

export const initialResponse: TErrorResponse = {
  ok: false,
  error: { message: "" },
}

export const defaultErrors: {
  [type: string]: TErrorResponse
} = {
  connection: {
    ok: false,
    error: {
      message: "Verifique a conexão e tente novamente",
    },
  },
}

export const generateResponse = <T>(info: any): TDefaultBodyRes<T> => {
  return {
    ok: true,
    data: info,
  }
}

// TODO: Implement apiKey using auth user
const apiKey = process.env.BANK_API_API_KEY
const backUrl = process.env.BANK_API_URL

axios.defaults.baseURL = backUrl

const checkTokenExpiration = (token: string) => {
  try {
    const decoded = jwtDecode(token)

    const now = +new Date().getTime().toFixed(0)

    const exp = (decoded.exp as number) * 1000

    return now > exp
  } catch (error) {
    return true
  }
}

axios.interceptors.request.use(function (config) {
  try {
    if (apiKey) config.headers["x-api-key"] = apiKey

    return config
  } catch (error) {
    return config
  }
})

export const service = axios

export const Api: TApi = {
  auth: apiAuth,
  slips: apiSlips,
}
