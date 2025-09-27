import { Request, Response } from "express"
import SERVICES from "../services"

/*
 *  Typing
 */

/* Api */
import { TErrorResponse } from "../api/types"

export const getOrderStatistics = async (req: Request, res: Response) => {
  try {
    const request = await SERVICES.Statistics.Order.getOrderStatistics()

    if (request.ok) {
      res.json({
        success: true,
        data: request.data,
      })
    } else throw new Error((request as TErrorResponse).error.message)
  } catch (error) {
    res.json({ success: false, error: true })
  }
}
