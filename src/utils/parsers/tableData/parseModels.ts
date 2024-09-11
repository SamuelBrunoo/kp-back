import { TProductType } from "../../../@types/data/productType"

const parseModels = (data: any[], extra: any) => {
  const prodTypes: any[] = extra.prodTypes

  let list: any[] = []

  data.forEach((m) => {
    const obj = {
      ...m,
      type: (prodTypes.find((pt) => pt.key === m.type) as TProductType).name,
    }

    list.push(obj)
  })

  return list
}

export default parseModels
