import dateFns from "date-fns"

/*
 *  Typing
 */

/* Address */
import { TCity } from "../../types/data/address/city"
import { TState } from "../../types/data/address/state"

/* Client */
import { TBasicClient } from "../../types/data/client/basicClient"

/* Color */
import { TColor } from "../../types/data/color"

/* Emmitter */
import { TBasicEmmitter } from "../../types/data/accounts/emmitter/basicEmmitter"

/* Model */
import { TModel } from "../../types/data/model"

/* Order */
import { TBasicOrder } from "../../types/data/order/basicOrder"
import { TOrder } from "../../types/data/order"
import { TPageListOrder } from "../../types/data/order/pageListOrder"

/* Payment */
import { OrderSlip } from "../../types/data/payment/slipOrder"

/* Product Type */
import { TProdType } from "../../types/data/prodType"

/* Product */
import { TBasicProduct } from "../../types/data/product/basicProduct"

/* Production Line */
import { TProductionLine } from "../../types/data/productionLine"

/* Representative */
import { TBasicRepresentative } from "../../types/data/accounts/representative/basicRepresentative"

/* Status */
import { TOPStatusWeight } from "../../types/data/status/orderProductStatusWeight"
import { TPaymentConfig } from "../../types/data/payment"

type Props = {
  clients: TBasicClient[]
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

      // Products
      const orderProductsDetails: TPageListOrder["details"]["products"] =
        i.products.map((p) => {
          const product = products.find((prod) => prod.id === p.id)
          const color = colors.find((col) => col.code === product.color)
          const model = models.find((mod) => mod.id === product.model)
          const type = productTypes.find((type) => type.code === product.type)

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

      // Production
      const productionLine = productionLines.find((pl) => pl.order === i.id)

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
          paymentSlips: (i.payment as TPaymentConfig["order"])
            .slips as OrderSlip[],
        },
      }

      list.push(obj)
    })
  } catch (error) {
    console.log(error)
  }

  const sortedList = list.sort((a, b) => (a.code > b.code ? -1 : 1))

  return sortedList
}
