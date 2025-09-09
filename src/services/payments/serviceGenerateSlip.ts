import { TBasicOrder } from "../../utils/types/data/order"
import { Api } from "../../api"
import { TS_Slip_Register } from "../../utils/types/data/services/sicredi/data/slip"
import { TClient } from "../../utils/types/data/client"
import { Slip, TBankSlipRegister } from "../../utils/types/data/payment"
import { TBankCredentials, TEmmitter } from "../../utils/types/data/emmiter"
import { TS_Credential } from "../../utils/types/data/services/sicredi/data/credential"
import { TDefaultBodyRes } from "../../api/types"
import { getCustomError } from "../../utils/helpers/getCustomError"

export const generateSlip = async (
  emmitter: TEmmitter,
  order: TBasicOrder,
  client: TClient,
  slip: Slip
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
