import { TNewOrderPaymentConfig } from "./configNewOrder"
import { TRepresentativePaymentConfig } from "./configRepresentative"

export type TPaymentConfig = {
  newOrder: TNewOrderPaymentConfig
  representative: TRepresentativePaymentConfig
}
