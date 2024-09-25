import { treatNewOrder } from "./newOrder"

export const treatData = (dataType: string, data: any, extra?: any) => {
  switch (dataType) {
    case "newOrder":
      return treatNewOrder(data, extra)
    default:
      return data
  }
}
