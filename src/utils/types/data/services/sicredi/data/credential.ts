export type TS_Credential = {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  refresh_token: string
  token_type: string
  "not-before-policy": number
  session_state: string
  scope: string
}

export type TBankCredentials = {
  username: string
  password: string
  cooperativa: string
  posto: string
  codigoBeneficiario: string
}
