import { TOPStatus } from "../types/data/order"

export const orderProductStatusRelation: { [key in TOPStatus]: string } = {
  doing: "Em produção",
  done: "Em produção",
  lor: "Sem material",
  queued: "Aguardando",
}
