import { Request, Response } from "express"

import * as fb from "firebase/firestore"
import { collections } from "../network/firebase"
import { parseFbDoc, parseFbDocs } from "../utils/parsers/fbDoc"
import { getCustomError } from "../utils/helpers/getCustomError"
import { generateOrderPdf } from "../utils/pdf/order"
import parseProducts from "../utils/parsers/parseProducts"

/*
 *  Typing
 */

/* Client */
import { TClient } from "../utils/types/data/client"

/* Representative */
import { TRepresentative } from "../utils/types/data/accounts/representative"

/* Product */
import { TProduct } from "../utils/types/data/product"

/* Product Type */
import { TProdType } from "../utils/types/data/prodType"

/* Color */
import { TColor } from "../utils/types/data/color"

/* Emmitter */
import { TEmmitter } from "../utils/types/data/accounts/emmitter"

/* Model */
import { TModel } from "../utils/types/data/model"

/* Order */
import { TBasicOrder } from "../utils/types/data/order/basicOrder"
import parseOrder from "../utils/parsers/parseOrder"
import { Api } from "../api"
import { formatSlip } from "../utils/formatters/slip"
import AuthService from "../services/auth"
import { TUser } from "../utils/types/data/accounts/user"
import { getParsedCollections } from "../network/firebase/collectionsHelpers"

export const getOrderPdf = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.query
    const forAdmin = req.query.forAdmin && req.query.forAdmin === "true"

    const {
      colClients,
      colEmmitters,
      colRepresentatives,
      colProducts,
      colProductTypes,
      colModels,
      colColors,
    } = await getParsedCollections([
      "clients",
      "emmitters",
      "representatives",
      "products",
      "productTypes",
      "models",
      "colors",
    ])

    let orderData: TBasicOrder | null = null

    const ref = fb.doc(collections.orders, orderId as string)
    const fbOrder = await fb.getDoc(ref)

    if (fbOrder.exists()) {
      const orderInfo = parseFbDoc(fbOrder)
      orderData = orderInfo
    }

    const orderInfo = parseOrder({
      clients: colClients,
      colors: colColors,
      models: colModels,
      order: orderData,
      prodTypes: colProductTypes,
      products: colProducts,
    })

    const productsList = parseProducts({
      products: colProducts,
      models: colModels,
      colors: colColors,
    })

    const pdfbytes = await generateOrderPdf({
      order: orderInfo,
      products: productsList,
      forAdmin: forAdmin,
    })

    const buffer = Buffer.from(pdfbytes)

    // 3. Define os headers para download
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" +
        '"Pedido ' +
        String(orderData.code).padStart(2, "0") +
        '.pdf"'
    )

    res.status(200).send(buffer)
  } catch (error) {
    res.status(204).json(getCustomError(error))
  }
}

export const getSlipPdf = async (req: Request, res: Response) => {
  try {
    const user: TUser = (req as any).user

    const { slipCode } = req.query

    if (typeof slipCode === "string") {
      if (user.extraRole === "emmitter") {
        const credentials = await AuthService.getCredentials(user)

        if (credentials.success) {
          // A API precisa retornar a resposta como arraybuffer ou buffer.
          const apiResponse = await Api.slips.print(
            { slipCode: slipCode },
            credentials.data
          )

          if (apiResponse.status === 201 && apiResponse.data) {
            if (apiResponse && apiResponse.status === 201) {
              if (apiResponse.data.pipe) {
                const contentType =
                  apiResponse.headers["content-type"] || "application/pdf"
                const fileName = `Boleto-${slipCode}.pdf`

                res.setHeader("Content-Type", contentType)
                res.setHeader(
                  "Content-Disposition",
                  `attachment; filename="${fileName}"`
                )

                apiResponse.data.pipe(res)
              }
            } else throw new Error("Erro ao gerar o boleto.")
          } else {
            throw new Error(
              "Não foi possível gerar o arquivo. Tente novamente mais tarde."
            )
          }
        } else {
          throw new Error("Erro ao autenticar no banco.")
        }
      } else {
        throw new Error("Usuário sem autorização para download de boletos.")
      }
    } else {
      throw new Error(
        "Código do boleto não recebido. Verifique e tente novamente."
      )
    }
  } catch (error) {
    res.status(500).json(getCustomError(error as Error))
  }
}
