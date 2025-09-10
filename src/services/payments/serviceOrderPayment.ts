import { Api } from "../../api"
import { TDefaultBodyRes } from "../../api/types"
import { collections } from "../../network/firebase"
import { FACTORY } from "../../utils/factory"
import { getCustomError } from "../../utils/helpers/getCustomError"
import { getSlipDue, getSlipsValues } from "../../utils/helpers/slip"
import { parseFbDoc } from "../../utils/parsers/fbDoc"
import { TBaseClient } from "../../utils/types/data/client"
import { TBasicEmmitter } from "../../utils/types/data/emmiter"
import { TBasicOrder,TDBOrder } from "../../utils/types/data/order"
import {
  Slip,
  TBankSlipRegister,
  UnfilledSlip,
} from "../../utils/types/data/payment"
import { TState } from "../../utils/types/data/address/state"

import * as fb from "firebase/firestore"

export const serviceGenerateOrderPayment = async (
  orderId: string,
  shippingCost: number
): Promise<TDefaultBodyRes<TBankSlipRegister[]>> => {
  return new Promise(async (resolve, reject) => {
    try {
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

                    const payerInfo = FACTORY.slips.payerInfo({
                      client,
                      clientState,
                    })

                    const receiverInfo = FACTORY.slips.receiverInfo({
                      emmitter,
                      emmitterState,
                    })

                    const slipConfig = FACTORY.slips.bankSlipRegister({
                      bankCredentials,
                      order,
                      payerInfo,
                      receiverInfo,
                      slipData,
                      slipTotal,
                    })

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

                    const baseData = orderDoc.data() asTDBOrder

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
                    } asTDBOrder

                    await fb.updateDoc(orderRef, newOrderData)
                    resolve({ ok: true, data: generatedSlips })
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
    } catch (error) {
      reject({ ok: false, error: getCustomError(error).error })
    }
  })
}
