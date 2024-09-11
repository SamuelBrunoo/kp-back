export type TProductionLine = {
  id: string
  order: string
  client: string
  date: string
  products: TLineProduct[]
}

type TLineProduct = {
  type: string
  model: string
  color: string
  doing: string
  qnt: number
  status: TProductionStatus
}

type TProductionStatus = "going" | "queue" | "lack" | "done"
