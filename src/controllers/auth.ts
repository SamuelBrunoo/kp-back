import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import app from "../services/firebase"
import { getCustomError } from "../utils/helpers/getCustomError"
import { authMessagesFbRelation } from "../utils/relations/firebase/authMessages"
import { parseFbDoc } from "../utils/parsers/fbDoc"
import { generateTokens, verifyRefreshToken } from "../utils/jwt"
import {
  TBasicEmmitter,
  TEmmitter,
  TSafeEmmitter,
} from "../utils/types/data/emmiter"
import { TUser } from "../utils/types/data/user"
import { TWorker } from "../utils/types/data/worker"
import { parseSafeEmmitter } from "../utils/parsers/user"

const firestore = fb.getFirestore(app)
const authInstance = getAuth(app)

// # Collections
const collections = {
  productTypes: fb.collection(firestore, "productTypes"),
  products: fb.collection(firestore, "products"),
  colors: fb.collection(firestore, "colors"),
  clients: fb.collection(firestore, "clients"),
  orders: fb.collection(firestore, "orders"),
  production: fb.collection(firestore, "production"),
  workers: fb.collection(firestore, "workers"),
  emmitters: fb.collection(firestore, "emmitters"),
  users: fb.collection(firestore, "users"),
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, pass } = req.body

    if (email && pass) {
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

              return res.status(400).json(errorMessage)
            }

            const userData: TUser = {
              ...user,
              roleInfo: userExtraInfo,
            }

            // token
            const tokens = generateTokens(userData)

            const accessToken = tokens.accessToken
            const refreshToken = tokens.refreshToken

            res.status(200).json({
              success: true,
              data: {
                accessToken,
                refreshToken,
                user: userData,
              },
            })
          }
        })
        .catch((error) => {
          const errorCode = error.code

          const errorReturnMessage = authMessagesFbRelation[errorCode]

          const message = errorReturnMessage

          throw new Error(message)
        })
    } else throw new Error("Preencha os campos corretamente")
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  try {
    const payload = verifyRefreshToken(refreshToken)
    const tokens = generateTokens({ id: (payload as any).id })
    res.status(200).json(tokens)
  } catch {
    res.status(403).json({ message: "Refresh token inválido" })
  }
}
