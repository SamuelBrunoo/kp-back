import pdfLib, { rgb, StandardFonts } from "pdf-lib"
import { TOrder } from "../../../types/data/order"
import { formatDate } from "date-fns"

const companyLogo = "../../../../assets/images/logo192.png"

import fs from "fs"
import path from "path"
import { pdfColors } from ".."

export const getPdfHeader = async (
  page: pdfLib.PDFPage,
  pdfDoc: pdfLib.PDFDocument,
  startY: number,
  order: TOrder,
  title: string
): Promise<pdfLib.PDFPage> => {
  // Cores e tamanhos
  const headerFontSize = 16

  const fontTitle = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const orderDateStr = `Feito em: ${formatDate(order.orderDate, "dd/MM/yyyy")}`

  // Cabeçalho
  const docLogo: pdfLib.PDFPageDrawImageOptions = {
    width: 48,
    height: 48,
    x: 40,
    y: startY - 28,
  }
  const docTitle: pdfLib.PDFPageDrawTextOptions = {
    x: docLogo.x + docLogo.width + 20,
    y: startY,
    size: headerFontSize,
    font: fontTitle,
    color: pdfColors.green,
  }
  const docDate: pdfLib.PDFPageDrawTextOptions = {
    x: docLogo.x + docLogo.width + 20,
    y: startY - 18,
    size: headerFontSize - 4,
    font,
    color: pdfColors.grey,
  }

  const imagePath = path.join(__dirname, companyLogo)
  const imageBytes = fs.readFileSync(imagePath)

  const logoImage = await pdfDoc.embedPng(imageBytes)

  page.drawImage(logoImage, docLogo)
  page.drawText(title, docTitle)
  page.drawText(orderDateStr, docDate)

  return page
}
