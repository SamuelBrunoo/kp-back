import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import app from "../services/firebase"
import { getCustomError } from "../utils/helpers/getCustomError"
import { authMessagesFbRelation } from "../utils/relations/firebase/authMessages"
import { parseFbDoc } from "../utils/parsers/fbDoc"

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
            const emmittersList = await fb.getDocs(
              fb.query(
                collections.emmitters,
                fb.where("userId", "==", userCredential.user.uid)
              )
            )

            const isEmmiter = !emmittersList.empty

            if (isEmmiter) {
              const emmitterData = emmittersList.docs[0]
              userData = {
                ...parseFbDoc(emmitterData),
                email,
              }
            } else {
              const errorMessage = getCustomError({
                message: "Usuário sem autorização",
              })

              return res.status(400).json(errorMessage)
            }
          }

          // token
          const token = ""
          const refreshToken = ""

          res.status(200).json({
            success: true,
            data: {
              token,
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
