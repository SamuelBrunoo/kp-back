import { TColor } from "../../types/data/color"
import {TDBModel } from "../../types/data/model"
import {
 TDBProduct,
  TProduct,
  TPageListProduct,
  TBasicProduct,
} from "../../types/data/product"
import { TOrder } from "../../types/data/order"
import { TProdType } from "../../types/data/prodType"

type Props = {
  models:TDBModel[]
  colors: TColor[]
  prodTypes: TProdType[]
  products: TBasicProduct[]
  orders: TOrder[]
}

export const parseProductsPageList = ({
  models,
  colors,
  prodTypes,
  products,
  orders,
}: Props): TPageListProduct[] => {
  let list: any[] = []
  products.forEach((product) => {
    try {
      const productProductType = prodTypes.find((p) => p.code === product.type)
      const productModel = models.find((m) => m.id === product.model)
      const productColor = colors.find((c) => c.code === product.color)

      // Deletable

      const ordersWithProduct = orders.filter((o) =>
        o.products.some((p) => p.id === product.id)
      )

      const obj: TPageListProduct = {
        id: product.id,
        type: productProductType.name,
        typeKey: productProductType.code,
        model: productModel.name,
        name: product.name,
        code: product.code,
        color: productColor.name,
        storage: product.storage.has ? product.storage.quantity : "Não possui",
        price: productModel.price,
        active: product.active,
        deletable: ordersWithProduct.length === 0,

        conflicted: !productModel.colors.includes(product.color),
      }

      list.push(obj)
    } catch (error) {}
  })

  return list
}
