import { getCustomError } from "../../utils/helpers/getCustomError"
import * as fb from "firebase/firestore"

/*
 *  Typing
 */

/* API */
import { TDefaultBodyRes } from "../../api/types"

/* Emmitter */
import { TStatisticsOrder } from "../../utils/types/data/statistics/orders"
import { collections, statisticsDocumentsNames } from "../../network/firebase"

export const getOrderStatistics = async (): Promise<
  TDefaultBodyRes<TStatisticsOrder>
> => {
  return new Promise(async (resolve, reject) => {
    try {
      const ref = fb.doc(
        collections.statistics,
        statisticsDocumentsNames.orders
      )
      const doc = await fb.getDoc(ref)

      if (doc.exists()) {
        const data: TStatisticsOrder = doc.data() as TStatisticsOrder
        resolve({ ok: true, data: data })
      } else
        throw new Error(
          "Não foi possível carregar as informações. Tente novamente mais tarde."
        )
    } catch (error) {
      reject({ ok: false, error: getCustomError(error).error })
    }
  })
}
