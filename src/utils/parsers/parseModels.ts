import { TColor } from "../types/data/color"
import { TFBModel, TModel } from "../types/data/model"
import { TProdType } from "../types/data/prodType"
import { TProduct } from "../types/data/product"

type Props = {
  models: TFBModel[]
  colors: TColor[]
  prodTypes: TProdType[]
  products: TProduct[]
}

const parseModels = ({ models, colors, prodTypes, products }: Props) => {
  let list: any[] = []
  try {
    models.forEach((i) => {
      let cls: string[] = []

      i.colors.forEach((color) => {
        const c = colors.find((col) => col.code === color) as TColor
        cls.push(c.code)
      })
      const t = prodTypes.find((pt) => pt.code === i.type) as TProdType

      // Storage
      let hasStorage = false
      let storageQnt = 0

      products
        .filter((p) => p.model === i.code)
        .forEach((p) => {
          if (p.storage.has) {
            if (!hasStorage) hasStorage = true
            storageQnt += p.storage.quantity
          }
        })

      const storage = { has: hasStorage, quantity: storageQnt }

      const obj: TModel = {
        ...i,
        colors: cls,
        type: t.name,
        storage,
      }

      list.push(obj)
    })
  } catch (error) {}

  return list
}

export default parseModels
