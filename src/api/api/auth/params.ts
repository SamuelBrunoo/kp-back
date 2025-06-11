export type TApi_Params_Auth = {
  auth: {
    token: {
      username: string
      password: string
      scope: TScope
      grant_type: TGrantType
      cooperativa?: string
      posto?: string
      codigoBeneficiario?: string
    }
  }
}

type TScope = "COBRANCA"

type TGrantType = "password" | "refresh_token"
