import parseClients from "./parseClients"
import parseManufaturing from "./parseManufacturing"
import parseModels from "./parseModels"
import parseOrders from "./parseOrders"
import parseProducts from "./parseProducts"

type TContent = "models" | "products" | "clients" | "orders" | "manufacturing"

export const parseTableData = (data: any[], contentType: TContent, extra?: any) => {
  let list: any[] = []

  switch (contentType) {
    case "clients":
      list = parseClients(data)
      break
    case "manufacturing":
      list = parseManufaturing(data)
      break
    case "models":
      list = parseModels(data, extra)
      break
    case "orders":
      list = parseOrders(data)
      break
    case "products":
      list = parseProducts(data, extra)
      break
    default:
      list = data
      break
  }

  return list
}
