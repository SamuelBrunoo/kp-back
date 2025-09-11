/*
 *  Typing
 */

/* Model */
import { TDBModel } from "../../../types/data/model/dbModel"
import { TModel } from "../../../types/data/model"

/* Product */
import { TBasicProduct } from "../../../types/data/product/basicProduct"
import { TProduct } from "../../../types/data/product"

type Props = {
  product: TBasicProduct
  models: TModel[]
}

const parseProduct = ({ product, models }: Props): TProduct => {
  const m = models.find((model) => model.id === product.model) as TDBModel

  let productData: TProduct = {
    ...product,
    price: m.price,
  }

  return productData
}

export default parseProduct
