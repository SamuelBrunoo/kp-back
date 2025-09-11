import { Api } from "../../api"
import { getCustomError } from "../../utils/helpers/getCustomError"

/*
 *  Typing
 */

/* API */
import { TDefaultBodyRes } from "../../api/types"

/* Order */
import { TBasicOrder } from "../../utils/types/data/order/basicOrder"

/* BANK */
import { TS_Slip_Register } from "../../utils/types/data/services/sicredi/data/slip"
import {
  TBankCredentials,
  TS_Credential,
} from "../../utils/types/data/services/sicredi/data/credential"

/* Client */
import { OrderSlip } from "../../utils/types/data/payment/slipOrder"
import { TBankSlipRegister } from "../../utils/types/data/payment/slipBank"

/* Client */
import { TClient } from "../../utils/types/data/client"

/* Emmitter */
import { TEmmitter } from "../../utils/types/data/accounts/emmitter"

export const generateSlip = async (
  emmitter: TEmmitter,
  order: TBasicOrder,
  client: TClient,
  slip: OrderSlip
): Promise<TDefaultBodyRes<TBankSlipRegister>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const slipConfig: TS_Slip_Register = {
        codigoBeneficiario: emmitter.bank.codigoBeneficiario,
        pagador: {
          tipoPessoa:
            client.type === "juridical" ? "PESSOA_JURIDICA" : "PESSOA_FISICA",
          documento: client.documents.register,
          nome: client.clientName,
          endereco: client.address.full,
          cidade: client.address.city,
          uf: client.address.state,
          cep: Number(client.address.cep.replace(/\D/g, "")),
          telefone: client.phone1,
          email: client.email,
        },
        especieDocumento: "DUPLICATA_MERCANTIL_INDICACAO",
        seuNumero: String(order.code),
        dataVencimento: slip.dueDate,
        tipoCobranca: "HIBRIDO",
        valor: slip.value / 100,
        diasProtestoAuto: 10,
        multa: 2,
        tipoJuros: "PERCENTUAL",
        juros: order.totals.value * 0.003,
      }

      const credentialsReq = await Api.auth.token({
        username: emmitter.bank.username,
        password: emmitter.bank.password,
        scope: "cobranca",
        grant_type: "password",
      })

      if (credentialsReq.ok) {
        const credentials: TS_Credential = credentialsReq.data
        const bankCredentials: TBankCredentials = {
          username: emmitter.bank.username,
          password: emmitter.bank.password,
          cooperativa: emmitter.bank.cooperativa,
          posto: emmitter.bank.posto,
          codigoBeneficiario: emmitter.bank.codigoBeneficiario,
        }

        const slipRegister = await Api.slips.register(
          slipConfig,
          credentials,
          bankCredentials
        )

        if (slipRegister.ok) {
          resolve({ ok: true, data: slipRegister.data })
        } else throw new Error("Não foi possível gerar o boleto.")
      } else throw new Error("Não foi possível autenticar na API do banco.")
    } catch (error) {
      reject({ ok: false, error: getCustomError(error).error })
    }
  })
}
