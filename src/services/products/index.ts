import * as fb from "firebase/firestore"
import { collections } from "../../network/firebase"

const reduceStorageCount = async (
  productId: string,
  amount: number
): Promise<{ success: boolean }> => {
  return new Promise(async (resolve) => {
    try {
      await fb.updateDoc(fb.doc(collections.products, productId), {
        storage: {
          has: true,
          quantity: amount > 0 ? amount : 0,
        },
      })
      resolve({ success: true })
    } catch (error) {
      resolve({ success: false })
    }
  })
}

const ProductsService = {
  reduceStorageCount,
}

export default ProductsService
