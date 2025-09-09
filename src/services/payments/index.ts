import { generateSlip } from "./serviceGenerateSlip"
import { serviceGenerateOrderPayment } from "./serviceOrderPayment"

const PaymentsService = {
  generateSlip,
  generateOrderPayment: serviceGenerateOrderPayment,
}

export default PaymentsService
