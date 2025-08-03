import { Request, Response } from "express"

import { getCustomError } from "../utils/helpers/getCustomError"
import { generateTokens, verifyRefreshToken } from "../utils/jwt"

import SERVICES from "../services"

export const login = async (req: Request, res: Response) => {
  try {
    const { email, pass } = req.body

    if (email && pass) {
      const authentication = await SERVICES.Auth.login(email, pass)

      return authentication.success
        ? res.status(200).json(authentication)
        : res.status(400).json(authentication)
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
