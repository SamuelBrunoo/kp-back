import * as fb from "firebase/firestore"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import app, { collections } from "../../network/firebase"
import { parseFbDoc } from "../../utils/parsers/fbDoc"
import { parseSafeEmmitter } from "../../utils/parsers/user"
import { getCustomError } from "../../utils/helpers/getCustomError"
import { authMessagesFbRelation } from "../../utils/relations/firebase/authMessages"
import { generateTokens } from "../../utils/jwt"

/*
 *  Typing
 */

/* User */
import { TUser } from "../../utils/types/data/accounts/user"

/* Worker */
import { TWorker } from "../../utils/types/data/accounts/worker"

/* Emmitter */
import { TEmmitter } from "../../utils/types/data/accounts/emmitter"
import {
  TBankCredentials,
  TS_Credential,
} from "../../utils/types/data/services/sicredi/data/credential"
import { Api } from "../../api"
import { TBasicEmmitter } from "../../utils/types/data/accounts/emmitter/basicEmmitter"

const authInstance = getAuth(app)

type TDefaultServiceResponse<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: string
    }

type TService_LoginResponse = TDefaultServiceResponse<{
  accessToken: string
  refreshToken: string
  user: TUser
}>

const login = async (
  email: string,
  pass: string
): Promise<TService_LoginResponse> => {
  return new Promise(async (resolve) => {
    let result: TService_LoginResponse = {
      success: false,
      error: "Ocorreu um erro ao fazer o login.",
    }

    try {
      await signInWithEmailAndPassword(authInstance, email, pass)
        .then(async (userCredential) => {
          const userRef = fb.doc(collections.users, userCredential.user.uid)
          const userDoc = await fb.getDoc(userRef)

          if (userDoc.exists()) {
            const user = parseFbDoc(userDoc) as TUser

            let userExtraInfo: null | TUser["roleInfo"] = null

            if (user.extraRole === "worker") {
              const erRef = fb.doc(collections.workers, user.extraRoleId)
              const erDoc = await fb.getDoc(erRef)

              if (erDoc.exists()) userExtraInfo = parseFbDoc(erDoc) as TWorker
              else throw new Error("O papel do usuário é inválido.")
            } else if (user.extraRole === "emmitter") {
              const erRef = fb.doc(collections.emmitters, user.extraRoleId)
              const erDoc = await fb.getDoc(erRef)

              if (erDoc.exists()) {
                const basicEmmitter = parseFbDoc(erDoc) as TEmmitter
                const safeEmmitter = parseSafeEmmitter(basicEmmitter)
                userExtraInfo = safeEmmitter
              } else throw new Error("O papel do usuário é inválido.")
            } else {
              const errorMessage = getCustomError({
                message: "Usuário sem autorização",
              })

              result = {
                success: false,
                error: errorMessage.error,
              }
            }

            const userData: TUser = {
              ...user,
              roleInfo: userExtraInfo,
            }

            // token
            const tokens = generateTokens(userData)

            const accessToken = tokens.accessToken
            const refreshToken = tokens.refreshToken

            result = {
              success: true,
              data: {
                accessToken,
                refreshToken,
                user: userData,
              },
            }
          }
        })
        .catch((error) => {
          const errorCode = error.code

          const errorReturnMessage = authMessagesFbRelation[errorCode]

          const message = errorReturnMessage

          throw new Error(message)
        })
    } catch (error) {
      const errorMessage = getCustomError({
        message: (error as Error).message,
      })

      result = {
        success: false,
        error: errorMessage.error,
      }
    }

    resolve(result)
  })
}

type TService_CredentialsResponse = TDefaultServiceResponse<TS_Credential>

const getCredentials = async (
  user: TUser
): Promise<TService_CredentialsResponse> => {
  return new Promise(async (resolve) => {
    let result: TService_CredentialsResponse = {
      success: false,
      error: "Ocorreu um erro ao fazer o login.",
    }

    try {
      const userDoc = await fb.getDoc(
        fb.doc(collections.emmitters, user.extraRoleId)
      )

      if (userDoc.exists()) {
        const userRoleData = parseFbDoc(userDoc) as TBasicEmmitter

        const credentialsReq = await Api.auth.token({
          username: userRoleData.bank.username,
          password: userRoleData.bank.password,
          scope: "cobranca",
          grant_type: "password",
        })

        if (credentialsReq.ok) {
          const credentials: TS_Credential = credentialsReq.data
          result = {
            success: true,
            data: credentials,
          }
        } else {
          const message = "Erro ao autenticar no banco."
          throw new Error(message)
        }
      }
    } catch (error) {
      const errorMessage = getCustomError({
        message: (error as Error).message,
      })

      result = {
        success: false,
        error: errorMessage.error,
      }
    }

    resolve(result)
  })
}

const AuthService = {
  login,
  getCredentials,
}

export default AuthService
