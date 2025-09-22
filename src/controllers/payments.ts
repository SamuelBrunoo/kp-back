import { Request, Response } from "express"

import { getCustomError } from "../utils/helpers/getCustomError"

import SERVICES from "../services"

export const generateOrderPayment = async (req: Request, res: Response) => {
  try {
    const { user } = req as any

    const orderId = req.body.orderId as string | undefined
    const shippingCost = req.body.shippingCost as number | undefined

    if (orderId && shippingCost) {
      const generation = await SERVICES.Payments.generateOrderPayment(
        orderId,
        shippingCost
      )

      if (generation.ok) {
        res.status(201).json({ ok: false })
      } else
        throw new Error(
          "Houve um erro ao gerar os boletos. Verifique no seu banco e tente novamente."
        )
    } else throw new Error("Preencha os campos corretamente.")
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}
