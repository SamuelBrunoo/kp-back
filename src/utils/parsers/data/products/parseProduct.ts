import { TFBModel, TModel } from "../../../types/data/model"
import {
  TBasicProduct,
  TFBProduct,
  TProduct,
} from "../../../types/data/product"

type Props = {
  product: TBasicProduct
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
