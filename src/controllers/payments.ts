import { Request, Response } from "express"

import * as fb from "firebase/firestore"

import app from "../network/firebase"
import { getCustomError } from "../utils/helpers/getCustomError"
import { parseFbDoc } from "../utils/parsers/fbDoc"
import { TBasicOrder, TFBOrder } from "../utils/types/data/order"
import { Api } from "../api"
import { TBasicEmmitter } from "../utils/types/data/emmiter"
import {
  Slip,
  TBankSlipRegister,
  UnfilledSlip,
} from "../utils/types/data/payment"
import { getSlipDue, getSlipsValues } from "../utils/helpers/slip"
import { TBaseClient } from "../utils/types/data/client"
import { TState } from "../utils/types/data/state"
import { TS_Slip_Register } from "../utils/types/data/services/sicredi/data/slip"

const firestore = fb.getFirestore(app)

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
  states: fb.collection(firestore, "states"),
}

export const generateOrderPayment = async (req: Request, res: Response) => {
  try {
    const { user } = req as any

    const orderId = req.body.orderId as string | undefined
    const shippingCost = req.body.shippingCost as number | undefined

    if (orderId && shippingCost) {
      const orderRef = fb.doc(collections.orders, orderId)
      const orderDoc = await fb.getDoc(orderRef)

      if (orderDoc.exists()) {
        const order = parseFbDoc(orderDoc) as TBasicOrder

        const orderPaymentConfig = order.payment

        const emmitterRef = fb.doc(collections.emmitters, order.emmitter)
        const emmitterDoc = await fb.getDoc(emmitterRef)

        const clientRef = fb.doc(collections.clients, order.client)
        const clientDoc = await fb.getDoc(clientRef)

        if (emmitterDoc.exists() && clientDoc.exists()) {
          const emmitter = parseFbDoc(emmitterDoc) as TBasicEmmitter
          const client = parseFbDoc(clientDoc) as TBaseClient

          const emmitterStateRef = fb.doc(
            collections.states,
            emmitter.address.state
          )
          const emmitterStateDoc = await fb.getDoc(emmitterStateRef)

          const clientStateRef = fb.doc(
            collections.states,
            client.address.state
          )
          const clientStateDoc = await fb.getDoc(clientStateRef)

          if (
            emmitterStateDoc.exists() &&
            !emmitter.address.full.includes(emmitter.address.state) &&
            clientStateDoc.exists() &&
            !client.address.full.includes(client.address.state)
          ) {
            const emmitterState = parseFbDoc(emmitterStateDoc) as TState
            const clientState = parseFbDoc(clientStateDoc) as TState

            if (orderPaymentConfig.type === "pix") {
              // generate pix
            } else if (orderPaymentConfig.type === "slip") {
              // generate slips

              const bankCredentials = emmitter.bank

              const req = await Api.auth.token({
                grant_type: "password",
                password: bankCredentials.password,
                username: bankCredentials.username,
                scope: "cobranca",
              })

              if (req.ok) {
                const credentials = req.data

                // register slips
                const shippedOrderPrice = order.totals.value + shippingCost

                if (orderPaymentConfig.hasInstallments) {
                  const slipsCount = +orderPaymentConfig.installments

                  const slipValues = getSlipsValues(
                    shippedOrderPrice,
                    slipsCount
                  )

                  let generatedSlips: (TBankSlipRegister & UnfilledSlip)[] = []
                  let reqErrors: string[] = []

                  for (let i = 0; i < slipsCount; i++) {
                    const slipData = {
                      installment: i,
                      dueDate: getSlipDue(i, order.payment.due.toString()),
                    } as UnfilledSlip

                    const slipTotal = slipValues[i]

                    const payerInfo: TS_Slip_Register["pagador"] = {
                      documento: client.documents.register,
                      nome: client.clientName,
                      tipoPessoa:
                        client.type === "juridical"
                          ? "PESSOA_JURIDICA"
                          : "PESSOA_FISICA",
                      cep: +client.address.cep,
                      cidade: client.address.city,
                      email: client.email,
                      endereco: `${client.address.street}, ${
                        client.address.number
                          ? `nº${client.address.number}`
                          : "s/n"
                      }`,
                      telefone: client.phone1,
                      uf: clientState.abbr,
                    }

                    const receiverInfo: TS_Slip_Register["beneficiarioFinal"] =
                      {
                        documento: emmitter.cnpj,
                        nome: emmitter.name,
                        tipoPessoa: "PESSOA_JURIDICA",
                        cep: +emmitter.address.cep,
                        cidade: emmitter.address.city,
                        email: emmitter.email,
                        logradouro: emmitter.address.street,
                        numeroEndereco: emmitter.address.number,
                        telefone: emmitter.phone,
                        uf: emmitterState.abbr,
                      }

                    const slipConfig: TS_Slip_Register = {
                      codigoBeneficiario: bankCredentials.codigoBeneficiario,
                      valor: slipTotal,
                      dataVencimento: slipData.dueDate,
                      especieDocumento: "DUPLICATA_MERCANTIL_INDICACAO",
                      pagador: payerInfo,
                      seuNumero: String(order.code),
                      tipoCobranca: "HIBRIDO",

                      beneficiarioFinal: receiverInfo,
                      diasProtestoAuto: 10,

                      tipoJuros: "PERCENTUAL",
                      juros: 33,
                      multa: 2,
                    }

                    // In case of automatic split the commission, put in config above.

                    await Api.slips
                      .register(slipConfig, credentials, bankCredentials)
                      .then((slipReq) => {
                        if (slipReq.ok === true) {
                          const info: TBankSlipRegister = slipReq.data
                          generatedSlips.push({ ...info, ...slipData })
                        } else reqErrors.push(JSON.stringify(slipReq))
                      })
                      .catch((err) => {
                        reqErrors.push(err)
                      })
                  }

                  if (generatedSlips.length === slipsCount) {
                    // update order to include shippingCost on it's totals

                    const baseData = orderDoc.data() as TFBOrder

                    const completeSlipsInfo: Slip[] = generatedSlips.map(
                      (s, sk) => ({
                        barCode: s.codigoBarras,
                        cleanCode: s.linhaDigitavel,
                        dueDate: s.dueDate,
                        installment: s.installment,
                        status: "awaiting",
                        value: slipValues[sk],
                        nossoNumero: s.nossoNumero,
                        txid: s.txid,
                        qrCode: s.qrCode,
                      })
                    )

                    const newOrderData = {
                      ...baseData,
                      totals: {
                        ...baseData.totals,
                        ship: shippingCost,
                      },
                      payment: {
                        ...baseData.payment,
                        slips: completeSlipsInfo,
                      },
                    } as TFBOrder

                    await fb.updateDoc(orderRef, newOrderData)
                    res.status(201).json({ success: true, data: {} })
                  } else
                    throw new Error(
                      "Houve um erro ao gerar os boletos. Confira e delete no seu banco e tente novamente."
                    )
                } else {
                }
              } else
                throw new Error(
                  "Não foi possível conectar-se ao banco. Tente novamente mais tarde."
                )
            } else throw new Error("Método de pagamento não suportado.")
          } else
            throw new Error(
              "Há um problema no endereço do cliente. Corrija e tente novamente."
            )
        } else throw new Error("Emissor(a) não existe.")
      } else throw new Error("Esse pedido não existe.")
    } else throw new Error("Preencha os campos corretamente.")
  } catch (error) {
    res.status(400).json(getCustomError(error))
  }
}
