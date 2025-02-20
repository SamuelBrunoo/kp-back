import { TModel } from "../types/data/model"
import { TBasicProduct, TProduct } from "../types/data/product"

type Props = {
  products: TBasicProduct[]
  models: TModel[]
}

const parseProducts = ({ products, models }: Props) => {
  let list: TProduct[] = []

  products.forEach((product) => {
    const m = models.find((model) => model.id === product.model) as TModel

    const obj: TProduct = {
      ...product,
      price: m.price,
    }

    list.push(obj)
  })

  return list
}

export default parseProducts
