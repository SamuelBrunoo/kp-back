import { TOPStatus } from "../types/data/status/orderProduct"

export const orderProductStatusRelation: { [key in TOPStatus]: string } = {
  doing: "Em produção",
  done: "Em produção",
  lor: "Sem material",
  queued: "Aguardando",
}
