import { incrementAmountByStatus } from "./orders/increments/incrementAmountByStatus"
import { getOrderStatistics } from "./serviceOrderStatistics"

const StatisticsService = {
  Order: {
    getOrderStatistics,
    incrementAmountByStatus: incrementAmountByStatus,
  },
}

export default StatisticsService
