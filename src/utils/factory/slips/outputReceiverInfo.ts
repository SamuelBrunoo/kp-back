import { TBasicEmmitter } from "../../types/data/emmiter"
import { TFinalReceiver } from "../../types/data/services/sicredi/data/slip"
import { TState } from "../../types/data/state"

export const outputReceiverInfo = (data: {
  emmitter: TBasicEmmitter
  emmitterState: TState
}) => {
  const { emmitter, emmitterState } = data

  const receiverInfo: TFinalReceiver = {
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

  return receiverInfo
}
