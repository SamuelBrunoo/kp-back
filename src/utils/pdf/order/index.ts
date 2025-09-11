import { PDFDocument, rgb } from "pdf-lib"
import { TOrder } from "../../types/data/order"

import { getPdfHeader } from "./contents/header"
import { getPdfSideInfo } from "./contents/sideInfo"
import { getPdfProductsTable } from "./contents/productsTable"
import { TProduct } from "../../types/data/product"

type Props = {
  order: TOrder
  products: TProduct[]
  forAdmin: boolean
}

export const generateOrderPdf = async ({
  order,
  products,
  forAdmin,
}: Props) => {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595, 842]) // A4 in points

  const { height } = page.getSize()

  const title = `Pedido ${String(order.code).padStart(2, "0")}`

  pdfDoc.setTitle(title)

  const startY = height - 50

  // Header
  const headeredPage = await getPdfHeader(page, pdfDoc, startY, order, title)
  page = headeredPage

  // Side Info
  const sidedPage = await getPdfSideInfo(page, pdfDoc, startY, order, forAdmin)
  page = sidedPage

  // Products Table
  const listedPage = await getPdfProductsTable(
    page,
    pdfDoc,
    startY,
    order,
    products,
    forAdmin
  )

  page = listedPage

  const docBytes = await pdfDoc.save()
  return docBytes
}

export const pdfColors = {
  orange: ((r, g, b) => rgb(r, g, b))(0, 0, 0), // (0.922, 0.49, 0.0),
  green: ((r, g, b) => rgb(r, g, b))(0, 0, 0), // (0.152, 0.623, 0.322),
  grey: ((r, g, b) => rgb(r, g, b))(0, 0, 0), // (0.5, 0.5, 0.5),
  black: ((r, g, b) => rgb(r, g, b))(0, 0, 0), // (0.1, 0.1, 0.1),
}
