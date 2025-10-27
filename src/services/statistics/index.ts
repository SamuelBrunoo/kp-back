import { incrementAmountByStatus } from "./orders/incrementAmountByStatus"
import { updateAmountByStatuses } from "./orders/updateAmountByStatuses"
import { getOrderStatistics } from "./serviceOrderStatistics"

const StatisticsService = {
  Order: {
    getOrderStatistics,
    incrementAmountByStatus: incrementAmountByStatus,
    updateAmountForStatuses: updateAmountByStatuses,
  },
}

export default StatisticsService
