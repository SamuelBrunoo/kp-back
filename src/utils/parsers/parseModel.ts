import { TColor } from "../types/data/color"
import { TFBModel, TModel } from "../types/data/model"
import { TOrder } from "../types/data/order"
import { TProdType } from "../types/data/prodType"
import { TProduct } from "../types/data/product"

type Props = {
  model: TFBModel
  colors: TColor[]
  prodTypes: TProdType[]
  products: TProduct[]
  orders: TOrder[]
}

const parseModel = ({ model, colors, prodTypes, products, orders }: Props) => {
  let data: { model: TModel; variations: any[] }

  let cls: string[] = []

  model.colors.forEach((color) => {
    const c = colors.find((col) => col.code === color) as TColor
    cls.push(c.code)
  })

  // Deletable

  const ordersWithModel = orders.filter((o) =>
    o.products.some((p) => p.model === model.code)
  )
  const modelsProducts = products.filter((p) => p.model === model.code)

  modelsProducts.forEach((p) => {
    if (p.storage.has) {
      if (!hasStorage) hasStorage = true
      storageQnt += p.storage.quantity
    }
  })

  // Storage
  let hasStorage = false
  let storageQnt = 0

  const variations = modelsProducts.map((p) => {
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
    deletable: !(ordersWithModel.length > 0 || modelsProducts.length > 0),
  }

  data = { model: obj, variations }

  return data
}

export default parseModel
