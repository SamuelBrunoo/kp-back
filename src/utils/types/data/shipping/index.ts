import { TShippingMethod } from "./shippingMethod"
import { TShippingType } from "./shippingType"

export type TShipping = {
  type: TShippingType
  method: null | TShippingMethod
  price: number
}
