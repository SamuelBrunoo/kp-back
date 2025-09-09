import { TBaseClient } from "../../types/data/client"
import { TPayer } from "../../types/data/services/sicredi/data/slip"
import { TState } from "../../types/data/state"

export const outputPayerInfo = (data: {
  client: TBaseClient
  clientState: TState
}): TPayer => {
  const { client, clientState } = data

  const payerInfo: TPayer = {
    documento: client.documents.register,
    nome: client.clientName,
    tipoPessoa:
      client.type === "juridical" ? "PESSOA_JURIDICA" : "PESSOA_FISICA",
    cep: +client.address.cep,
    cidade: client.address.city,
    email: client.email,
    endereco: `${client.address.street}, ${
      client.address.number ? `nº${client.address.number}` : "s/n"
    }`,
    telefone: client.phone1,
    uf: clientState.abbr,
  }

  return payerInfo
}
