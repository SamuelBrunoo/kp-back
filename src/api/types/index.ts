import { TApi_Auth } from "../api/auth"
import { TApi_Slips } from "../api/slips"

export type TApi = {
  auth: TApi_Auth
  slips: TApi_Slips
}

// Success
type TSuccessResponse<T> = {
  ok: true
  data: T
}

// Error
export type TErrorResponse = {
  ok: false
  error: {
    message: string
  }
}

// Response Structure

export type TDefaultBodyRes<T> = TSuccessResponse<T> | TErrorResponse
