import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import app from "../services/firebase"
import { getCustomError } from "../utils/helpers/getCustomError"
import { authMessagesFbRelation } from "../utils/relations/firebase/authMessages"
import { parseFbDoc } from "../utils/parsers/fbDoc"
import { generateTokens, verifyRefreshToken } from "../utils/jwt"
import { TBasicEmmitter, TSafeEmmitter } from "../utils/types/data/emmiter"

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
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, pass } = req.body

    if (email && pass) {
      await signInWithEmailAndPassword(authInstance, email, pass)
        .then(async (userCredential) => {
          const workersList = await fb.getDocs(
            fb.query(
              collections.workers,
              fb.where("userId", "==", userCredential.user.uid)
            )
          )

          const isWorker = !workersList.empty

          let userData = null

          if (isWorker) {
            // get worker data
            const fbWorkerData = workersList.docs[0]
            userData = {
              ...parseFbDoc(fbWorkerData),
              email,
            }
          } else {
            // get emmitter data
            const emmittersDocs = await fb.getDocs(
              fb.query(
                collections.emmitters,
                fb.where("userId", "==", userCredential.user.uid)
              )
            )

            if (emmittersDocs.size > 0) {
              const emmitter = parseFbDoc(emmittersDocs.docs[0])

              const emmitterInfo: TSafeEmmitter = {
                address: emmitter.address,
                cnpj: emmitter.cnpj,
                email: emmitter.email,
                name: emmitter.name,
                phone: emmitter.phone,
                cpf: emmitter.cpf,
              }

              userData = emmitterInfo
            } else {
              const errorMessage = getCustomError({
                message: "Usuário sem autorização",
              })

              return res.status(400).json(errorMessage)
            }
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
