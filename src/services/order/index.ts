import * as fb from "firebase/firestore"
import { collections } from "../../network/firebase"
import { getCustomError } from "../../utils/helpers/getCustomError"

/*
 *  Typing
 */

/* Order */
import { TDBOrder } from "../../utils/types/data/order/dbOrder"
import { TBasicOrder } from "../../utils/types/data/order/basicOrder"

const getLastOrderCode = async (): Promise<string | null> => {
  return new Promise(async (resolve) => {
    try {
      const lo = await fb.getDocs(
        fb.query(collections.orders, fb.orderBy("code", "desc"), fb.limit(1))
      )

      const lastOrder =
        lo.docs.length > 0 ? (lo.docs[0].data() as TDBOrder) : null

      const code = lastOrder ? Number(lastOrder.code) : 1

      resolve(code.toString())
    } catch (error) {
      resolve(null)
    }
  })
}

const getNewOrderCode = async (): Promise<string> => {
  return new Promise(async (resolve) => {
    const lastOrderCode = await getLastOrderCode()
    const newCode = lastOrderCode ? Number(lastOrderCode) + 1 : 1
    resolve(newCode.toString())
  })
}

const registerOrder = async (
  data: TDBOrder
): Promise<
  { success: true; data: TBasicOrder } | { success: false; error: string }
> => {
  return new Promise(async (resolve) => {
    try {
      const info: TDBOrder = data

      const doc = await fb.addDoc(collections.orders, info)
      const docData = { ...info, id: doc.id } as TBasicOrder

      resolve({ success: true, data: docData })
    } catch (error) {
      const errorMessage = getCustomError(error)
      resolve({ success: false, error: errorMessage.error })
    }
  })
}

const updateOrder = async (
  orderId: string,
  dataToUpdate: Partial<TDBOrder>
): Promise<
  { success: true; data: TBasicOrder } | { success: false; error: string }
> => {
  return new Promise(async (resolve) => {
    try {
      const info: Partial<TDBOrder> = dataToUpdate

      const doc = await fb.addDoc(collections.orders, info)
      const docData = { ...info, id: doc.id } as TBasicOrder

      resolve({ success: true, data: docData })
    } catch (error) {
      const errorMessage = getCustomError(error)
      resolve({ success: false, error: errorMessage.error })
    }
  })
}

const OrderService = {
  getNewOrderCode,
  getLastOrderCode,
  registerOrder,
  updateOrder
}

export default OrderService
