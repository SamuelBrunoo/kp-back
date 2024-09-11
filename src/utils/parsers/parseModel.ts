import { TColor } from "../types/data/color"
import { TFBModel, TModel } from "../types/data/model"
import { TProdType } from "../types/data/prodType"
import { TProduct } from "../types/data/product"

type Props = {
  model: TFBModel
  colors: TColor[]
  prodTypes: TProdType[]
  products: TProduct[]
}

const parseModel = ({ model, colors, prodTypes, products }: Props) => {
  let data: { model: TModel; variations: any[] }

  let cls: string[] = []

  model.colors.forEach((color) => {
    const c = colors.find((col) => col.code === color) as TColor
    cls.push(c.code)
  })

  // Storage
  let hasStorage = false
  let storageQnt = 0

  const variations = products
    .filter((p) => p.model === model.code)
    .map((p) => {
      return {
        ...p,
        color: (colors.find((col) => col.code === p.color) as TColor).name,
        price: model.price,
      }
    })

  const storage = { has: hasStorage, quantity: storageQnt }

  const obj: TModel = {
    ...model,
    colors: cls,
    storage,
  }

  data = { model: obj, variations }

  return data
}

export default parseModel
