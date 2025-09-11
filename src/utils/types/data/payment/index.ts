import { TNewOrderPaymentConfig } from "./configNewOrder"
import { TOrderPaymentConfig } from "./configOrder"
import { TRepresentativePaymentConfig } from "./configRepresentative"

export type TPaymentConfig = {
  newOrder: TNewOrderPaymentConfig
  order: TOrderPaymentConfig
  representative: TRepresentativePaymentConfig
}
