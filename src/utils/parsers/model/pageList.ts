import { TColor } from "../../types/data/color"
import { TFBModel, TModel, TPageListModel } from "../../types/data/model"
import { TOrder } from "../../types/data/order"
import { TProdType } from "../../types/data/prodType"
import { TProduct } from "../../types/data/product"

type Props = {
  models: TFBModel[]
  colors: TColor[]
  prodTypes: TProdType[]
  products: TProduct[]
  orders: TOrder[]
}

export const parseModelsPageList = ({
  models,
  colors,
  prodTypes,
  products,
  orders,
}: Props): TPageListModel[] => {
  let list: any[] = []
  try {
    models.forEach((i) => {
      let cls: string[] = []

      i.colors.forEach((color) => {
        const c = colors.find((col) => col.code === color) as TColor
        cls.push(c.code)
      })
      const t = prodTypes.find((pt) => pt.code === i.type) as TProdType

      // Deletable

      const ordersWithModel = orders.filter((o) =>
        o.products.some((p) => p.model === i.code)
      )
      const modelsProducts = products.filter((p) => p.model === i.code)

      modelsProducts.forEach((p) => {
        if (p.storage.has) {
          if (!hasStorage) hasStorage = true
          storageQnt += p.storage.quantity
        }
      })

      // Storage
      let hasStorage = false
      let storageQnt = 0

      modelsProducts.forEach((p) => {
        if (p.storage.has) {
          if (!hasStorage) hasStorage = true
          storageQnt += p.storage.quantity
        }
      })

      const storage = { has: hasStorage, quantity: storageQnt }

      const obj: TPageListModel = {
        active: i.active,
        code: i.code,
        id: i.id,
        colors: cls.length,
        type: t.name,
        storage,
        name: i.name,
        price: !Number.isNaN(i.price) ? +i.price : 0,
        deletable: !(ordersWithModel.length > 0 || modelsProducts.length > 0),
      }

      list.push(obj)
    })
  } catch (error) {}

  return list
}
