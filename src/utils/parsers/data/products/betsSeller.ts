/*
 *  Typing
 */

/* Front */
import { TFront } from "../../../types/data/frontEnd"

/* Color */
import { TColor } from "../../../types/data/color"

/* Model */
import { TBasicModel } from "../../../types/data/model/basicModel"

/* Product Type */
import { TProdType } from "../../../types/data/prodType"

/* Product */
import { TBasicProduct } from "../../../types/data/product/basicProduct"

export type ParserBastSellerProps = {
  product: TBasicProduct & { key: number; count: number }
  models: TBasicModel[]
  productTypes: TProdType[]
  colors: TColor[]
}

export const parseProductToBestSeller = ({
  product,
  models,
  productTypes,
  colors,
}: ParserBastSellerProps): TFront["cards"]["list"] => {
  const m = models.find((model) => model.id === product.model) as TBasicModel
  const pt = productTypes.find((pt) => pt.code === product.type) as TProdType
  const c = colors.find((c) => c.code === product.color) as TColor

  let productData: TFront["cards"]["list"] = {
    id: product.key + 1,
    main: pt.name,
    secondary: m.name,
    tertiary: c.name,
    value: String(product.count).padStart(2, "0"),
  }

  return productData
}

type ListParserProps = {
  products: (TBasicProduct & { key: number; count: number })[]
  models: TBasicModel[]
  productTypes: TProdType[]
  colors: TColor[]
}

export const parseProductsToBestSeller = ({
  products,
  models,
  productTypes,
  colors,
}: ListParserProps) => {
  const list = products.map((p) =>
    parseProductToBestSeller({ product: p, models, productTypes, colors })
  )

  return list
}
