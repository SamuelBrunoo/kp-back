import { TBankCredentials } from "../../types/data/emmiter"
import { TBasicOrder } from "../../types/data/order"
import { UnfilledSlip } from "../../types/data/payment"
import {
  TFinalReceiver,
  TPayer,
  TS_Slip_Register,
} from "../../types/data/services/sicredi/data/slip"

export const outputBankSlipRegister = (data: {
  bankCredentials: TBankCredentials
  slipTotal: number
  slipData: UnfilledSlip
  payerInfo: TPayer
  receiverInfo: TFinalReceiver
  order: TBasicOrder
}) => {
  const {
    bankCredentials,
    slipTotal,
    slipData,
    payerInfo,
    receiverInfo,
    order,
  } = data

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
  return slipConfig
}
