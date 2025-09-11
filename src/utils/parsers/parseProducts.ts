/*
 *  Typing
 */

/* Color */
import { TColor } from "../types/data/color"

/* Model */
import { TBasicModel } from "../types/data/model/basicModel"

/* Product */
import { TBasicProduct } from "../types/data/product/basicProduct"
import { TProduct } from "../types/data/product"

type Props = {
  products: TBasicProduct[]
  models: TBasicModel[]
  colors: TColor[]
}

const parseProducts = ({ products, models, colors }: Props) => {
  let list: TProduct[] = []

  products.forEach((product) => {
    const m = models.find((model) => model.id === product.model) as TBasicModel
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
  models: TBasicModel[]
}) => {
  let list: TProduct[] = []

  products.forEach((product) => {
    const m = models.find((model) => model.id === product.model) as TBasicModel

    const obj: TProduct = { ...product, price: m.price }

    list.push(obj)
  })

  return list
}
