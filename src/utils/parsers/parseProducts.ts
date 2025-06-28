import { TColor } from "../types/data/color"
import { TFBModel } from "../types/data/model"
import { TBasicProduct, TProduct } from "../types/data/product"

type Props = {
  products: TBasicProduct[]
  models: TFBModel[]
  colors: TColor[]
}

const parseProducts = ({ products, models, colors }: Props) => {
  let list: TProduct[] = []

  products.forEach((product) => {
    const m = models.find((model) => model.id === product.model) as TFBModel
    const c = colors.find((color) => color.code === product.color) as TColor

    const obj: TProduct = {
      ...product,
      price: m.price,
      name: m.name,
      color: c.name,
    }

    list.push(obj)
  })

  return list
}

export default parseProducts

export const getProductsPrices = ({
  products,
  models,
}: {
  products: TBasicProduct[]
  models: TFBModel[]
}) => {
  let list: TProduct[] = []

  products.forEach((product) => {
    const m = models.find((model) => model.id === product.model) as TFBModel

    const obj: TProduct = { ...product, price: m.price }

    list.push(obj)
  })

  return list
}
