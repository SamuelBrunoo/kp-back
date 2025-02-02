import { TFBModel, TModel } from "../../../types/data/model"
import { TFBProduct, TProduct } from "../../../types/data/product"

type Props = {
  product: TFBProduct
  models: TModel[]
}

const parseProduct = ({ product, models }: Props): TProduct => {
  const m = models.find((model) => model.id === product.model) as TFBModel

  let productData: TProduct = {
    ...product,
    price: m.price,
  }

  return productData
}

export default parseProduct
