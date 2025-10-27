import * as fb from "firebase/firestore"
import {
  collections,
  statisticsDocumentsNames,
} from "../../../network/firebase"
import { getCustomError } from "../../../utils/helpers/getCustomError"
import { TStatisticsOrder } from "../../../utils/types/data/statistics/orders"
import { TOrderStatus } from "../../../utils/types/data/status/order"

export const incrementAmountByStatus = async (status: TOrderStatus) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ref = fb.doc(
        collections.statistics,
        statisticsDocumentsNames.orders
      )
      const doc = await fb.getDoc(ref)

      if (doc.exists()) {
        const data: TStatisticsOrder = doc.data() as TStatisticsOrder

        const newData: TStatisticsOrder = {
          ...data,
          amountByStatus: {
            ...data.amountByStatus,
            [status]: data.amountByStatus[status] + 1,
          },
        }

        await fb.updateDoc(ref, newData)

        resolve({ ok: true, data: newData })
      } else
        throw new Error(
          "Não foi possível atualizar os dados. Tente novamente mais tarde."
        )
    } catch (error) {
      reject({
        ok: false,
        error: getCustomError(error).error,
      })
    }
  })
}
