import { treatNewOrder } from "./newOrder"

export const treatData = <T>(dataType: string, data: any, extra?: any): T => {
  switch (dataType) {
    case "newOrder":
      return treatNewOrder(data, extra) as T
    default:
      return data
  }
}
