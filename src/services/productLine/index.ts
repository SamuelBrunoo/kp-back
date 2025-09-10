import * as fb from "firebase/firestore"
import { collections } from "../../network/firebase"
import { getCustomError } from "../../utils/helpers/getCustomError"
import { TBasicOrder } from "../../utils/types/data/order"
import { TProduct } from "../../utils/types/data/product"
import {
 TDBLineProductGroup,
 TDBProductionLine,
  TProductionLine,
} from "../../utils/types/data/productionLine"
import { generateProductionGroup } from "./helpers/generateProductionGroup"

const registerProductionLine = async (
  newOrder: TBasicOrder,
  orderProducts: TProduct[]
): Promise<
  { success: true; data: TProductionLine } | { success: false; error: string }
> => {
  return new Promise(async (resolve) => {
    try {
      let newProductionLine:TDBProductionLine = {
        order: newOrder.id,
        client: newOrder.client,
        status: "queued",
        quantity: 0,
        products: [],
      }

      newOrder.products.forEach((product) => {
        const prodObj = orderProducts.find((p) => p.id === product.id)

        if (prodObj && prodObj.storage.has) {
          const hasInStorage = prodObj.storage.quantity - product.quantity >= 0

          if (!hasInStorage) {
            const missing = product.quantity - prodObj.storage.quantity

            const plProdGroup:TDBLineProductGroup = generateProductionGroup(
              prodObj.id,
              missing
            )

            newProductionLine.quantity += plProdGroup.list.length
            newProductionLine.products.push(plProdGroup)
          }

          // update product quantity
          const stillTodo = product.quantity - prodObj.storage.quantity
          const willBeEmpty = prodObj.storage.quantity - stillTodo < 0

          fb.updateDoc(fb.doc(collections.products, prodObj.id), {
            storage: {
              has: prodObj.storage.has,
              quantity: willBeEmpty ? 0 : prodObj.storage.quantity - stillTodo,
            },
          })
        }
      })

      const register = await fb.addDoc(
        collections.productionLines,
        newProductionLine
      )

      const docData = {
        ...newProductionLine,
        id: register.id,
      } as TProductionLine

      resolve({ success: true, data: docData })
    } catch (error) {
      const errorMessage = getCustomError(error)
      resolve({ success: false, error: errorMessage.error })
    }
  })
}

const ProductionLineService = {
  registerProductionLine,
}

export default ProductionLineService
