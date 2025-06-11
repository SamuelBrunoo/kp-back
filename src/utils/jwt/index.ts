import jwt from "jsonwebtoken"

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret"
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret"

export const generateTokens = (payload: any) => {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "36h" })
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" })
  return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_SECRET)

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_SECRET)
