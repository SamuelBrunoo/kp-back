import pdfLib, { StandardFonts } from "pdf-lib"
import { TOrder } from "../../../types/data/order"
import { TProduct } from "../../../types/data/product"
import { pdfColors } from ".."

const iconStarted = "../../../../assets/images/icon_play_black.png"
const iconFinished = "../../../../assets/images/icon_check_black.png"
const iconPackaged = "../../../../assets/images/icon_box_approved_black.png"

import fs from "fs"
import path from "path"
import { formatMoney } from "../../../formatters/money"

type TRowItem = {
  type: "text" | "icon" | "checkbox"
  value?: string
}

export const getPdfProductsTable = async (
  page: pdfLib.PDFPage,
  pdfDoc: pdfLib.PDFDocument,
  startY: number,
  order: TOrder,
  products: TProduct[],
  forAdmin: boolean
): Promise<pdfLib.PDFPage> => {
  // Cores e tamanhos
  const baseX = 170
  const baseY = startY - 80
  const tableFontSize = 12

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Header
  const icons = {
    iconStarted,
    iconFinished,
    iconPackaged,
  }

  // Table Content
  const headers: TRowItem[] = [
    { type: "text", value: "Modelo" },
    { type: "text", value: "Cor" },
    { type: "text", value: "Código" },
    { type: "text", value: "Qtd" },

    ...((forAdmin
      ? [
          { type: "text", value: "Valor Un." },
          { type: "text", value: "Valor total" },
        ]
      : [
          { type: "icon", value: "iconStarted" },
          { type: "icon", value: "iconFinished" },
          { type: "icon", value: "iconPackaged" },
        ]) as TRowItem[]),
  ]
  const rows = order.products.map((op) => {
    const productInfo = products.find((p) => p.id === op.id)
    return getProductionInfo(op, productInfo, forAdmin)
  })

  const rowHeight = 25
  const colWidths = forAdmin
    ? [80, 80, 60, 50, 65, 65]
    : [80, 80, 60, 60, 40, 40, 40]

  let y = baseY

  headers.forEach(async (header, i) => {
    const x = baseX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5

    if (header.type === "text") {
      page.drawText(header.value, {
        x: x,
        y: y,
        size: tableFontSize,
        font: fontBold,
        color: pdfColors.orange,
      })
    } else {
      const imagePath = path.join(__dirname, icons[header.value])
      const imageBytes = fs.readFileSync(imagePath)

      const logoImage = await pdfDoc.embedPng(imageBytes)

      const size = 10

      page.drawImage(logoImage, {
        width: size,
        height: size,
        x: x,
        y: y,
      })
    }
  })

  // Linhas da tabela
  rows.forEach((row, rowK) => {
    const rowY = baseY - rowHeight * (rowK + 1)

    row.forEach((cell, i) => {
      if (cell.type === "text") {
        page.drawText(cell.value, {
          x: baseX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
          y: rowY + 5,
          size: 12,
          font,
          color: pdfColors.grey,
        })
      } else {
        page.drawRectangle({
          x: baseX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
          y: rowY + 5,
          width: 10,
          height: 10,
          borderWidth: 1,
          borderColor: pdfColors.grey,
        })
      }
    })
  })

  return page
}

const getProductionInfo = (
  op: TOrder["products"][number],
  product: TProduct,
  forAdmin: boolean
): TRowItem[] => {
  let content: TRowItem[] = []

  content = [
    { type: "text", value: String(product.name) },
    { type: "text", value: String(product.color) },
    { type: "text", value: String(product.code) },
    { type: "text", value: String(op.quantity) },
    ...((forAdmin
      ? [
          { type: "text", value: formatMoney(product.price) },
          { type: "text", value: formatMoney(product.price * op.quantity) },
        ]
      : [
          { type: "checkbox" },
          { type: "checkbox" },
          { type: "checkbox" },
        ]) as TRowItem[]),
  ]

  return content
}
