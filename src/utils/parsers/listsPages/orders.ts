import { TCity } from "../../types/data/city"
import { TBaseClient } from "../../types/data/client"
import { TColor } from "../../types/data/color"
import { TBasicEmmitter } from "../../types/data/emmiter"
import { TModel } from "../../types/data/model"
import {
  TBasicOrder,
  TOPStatusWeight,
  TPageListOrder,
} from "../../types/data/order"
import { Slip } from "../../types/data/payment"
import { TProdType } from "../../types/data/prodType"
import { TBasicProduct } from "../../types/data/product"
import { TProductionLine } from "../../types/data/productionLine"
import { TBasicRepresentative } from "../../types/data/representative"
import { TState } from "../../types/data/state"
import dateFns from "date-fns"

type Props = {
  clients: TBaseClient[]
  orders: TBasicOrder[]
  cities: TCity[]
  states: TState[]
  representatives: TBasicRepresentative[]
  emmitters: TBasicEmmitter[]

  productTypes: TProdType[]
  products: TBasicProduct[]
  colors: TColor[]
  models: TModel[]
  productionLines: TProductionLine[]
}

export const parseOrdersPageList = ({
  clients,
  orders,
  cities,
  states,
  representatives,
  emmitters,

  productTypes,
  products,
  colors,
  models,
  productionLines,
}: Props): TPageListOrder[] => {
  let list: TPageListOrder[] = []

  try {
    orders.forEach((i) => {
      const client = clients.find((c) => c.id === i.client)

      const representative = i.representative
        ? representatives.find((r) => r.id === i.representative)
        : null

      // Address info

      const city = cities.find((c) => c.id === client.address.city)
      const state = states.find((s) => s.id === client.address.state)

      const addressTxt = `${client.address.street}, nº${
        client.address.number
      } - ${city && `${city.name}, `}${state.abbr}`

      // Payments
      const paidInstallments = 0

      // Value

      // Order Status
      let currentOrderStatusWeight = 1
      i.products.forEach((p) => {
        const statusWeight = TOPStatusWeight[p.status]
        currentOrderStatusWeight = Math.max(
          statusWeight,
          currentOrderStatusWeight
        )
      })

      // const orderStatus: TOPStatus =
      //   orderProductStatusRelation[currentOrderStatusWeight]

      // Emmitter
      const orderEmmitter = emmitters.find((e) => e.id === i.emmitter)

      console.log("Here")

      // Products
      const orderProductsDetails: TPageListOrder["details"]["products"] =
        i.products.map((p) => {
          const product = products.find((prod) => prod.id === p.id)
          console.log("[DEVELOPMENT] Product: \n", product)

          const color = colors.find((col) => col.code === product.color)
          console.log("[DEVELOPMENT] Color: \n", color)

          const model = models.find((mod) => mod.id === product.model)
          console.log("[DEVELOPMENT] Model: \n", model)

          const type = productTypes.find((type) => type.code === product.type)
          console.log("[DEVELOPMENT] Type: \n", type, productTypes)

          const obj: TPageListOrder["details"]["products"][number] = {
            id: p.id,
            code: product.code,
            color: color.name,
            model: model.name,
            name: product.name,
            price: model.price,
            status: p.status,
            quantity: p.quantity,
            type: type.name,
          }

          return obj
        })

      console.log("Here")

      // Production
      const productionLine = productionLines.find((pl) => pl.order === i.id)

      console.log("Here")

      const obj: TPageListOrder = {
        id: i.id,
        code: i.code,
        clientName: client.clientName,
        orderDate: dateFns.format(i.orderDate, "dd/MM/yyyy"),
        quantity: i.products
          .map((p) => p.quantity)
          .reduce((prev, next) => prev + next),
        status: i.status,
        value: i.totals.value,
        details: {
          productionLineId: productionLine ? productionLine.id : null,
          products: orderProductsDetails,
          additional: {
            clientName: client.personName,
            clientRegister: client.documents.register,
            clientStateInscription: client.documents.stateInscription,
            address: addressTxt,
            orderDate: dateFns.format(i.orderDate, "dd/MM/yyyy"),
            observations: i.observations,
            deadline: dateFns.format(i.deadline, "dd/MM/yyyy"),
            shippedAt: i.shippedAt
              ? dateFns.format(i.shippedAt, "dd/MM/yyyy")
              : null,
            emmitter: orderEmmitter.name,
            hasInstallments: i.payment.hasInstallments ? "Sim" : "Não",
            installments: i.payment.installments,
            paymentMethod: i.payment.type,
            paidInstallments: paidInstallments,
            representative: representative ? representative.name : null,
            valueCommission: i.totals.commission,
            valueLiquid: i.totals.liquid,
            valueTotal: i.totals.value,
          },
          paymentSlips: i.payment.slips as Slip[],
        },
      }

      console.log("Here")

      list.push(obj)
    })
  } catch (error) {
    console.log(error)
  }

  const sortedList = list.sort((a, b) => (a.code > b.code ? -1 : 1))

  return sortedList
}
