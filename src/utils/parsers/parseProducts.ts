import { TColor } from "../types/data/color"
import { TModel } from "../types/data/model"
import { TProduct } from "../types/data/product"
import { TProdType } from "../types/data/prodType"

type Props = {
  products: TProduct[]
  models: TModel[]
  colors: TColor[]
  prodTypes: TProdType[]
}

const parseProducts = ({ products, models, colors, prodTypes }: Props) => {
  let list: any[] = []

  products.forEach((i) => {
    const c = colors.find((col) => col.code === i.color) as TColor
    const m = models.find((mod) => mod.code === i.model) as TModel
    const t = prodTypes.find((pt) => pt.code === m.type) as TProdType

    const obj: TProduct = {
      ...i,
      color: c.name,
      model: m.name,
      type: t.name,
      price: m.price,
    }

    list.push(obj)
  })

  return list
}

export default parseProducts
