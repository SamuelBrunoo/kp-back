// src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../utils/jwt"

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(" ")[1]

  if (!token) return res.status(401).json({ message: "Token ausente" })

  try {
    const payload = verifyAccessToken(token)

    const newReq = { ...req, user: payload }
    req = newReq as any
    next()
  } catch (err) {
    return res.status(403).json({ message: "Token inválido ou expirado" })
  }
}
