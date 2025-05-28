import pdfLib, { rgb, StandardFonts } from "pdf-lib"
import { TOrder } from "../../../types/data/order"
import { pdfColors } from ".."
import { formatMoney } from "../../../formatters/money"
import { formatCnpj } from "../../../formatters/cnpj"
import { formatCpf } from "../../../formatters/cpf"

export const getPdfSideInfo = async (
  page: pdfLib.PDFPage,
  pdfDoc: pdfLib.PDFDocument,
  startY: number,
  order: TOrder,
  forAdmin: boolean
): Promise<pdfLib.PDFPage> => {
  // Cores e tamanhos
  const baseX = 50
  const baseY = startY - 80
  const infoGroupHeight = 48

  const fontSize = 13

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Info Groups
  const igTitle: pdfLib.PDFPageDrawTextOptions = {
    x: baseX,
    y: baseY,
    size: fontSize,
    font,
    color: pdfColors.green,
  }
  const igValue: pdfLib.PDFPageDrawTextOptions = {
    x: baseX,
    y: baseY - 18,
    size: fontSize - 2,
    font,
    color: pdfColors.grey,
  }

  // Order info
  page.drawLine({
    start: { x: 160, y: baseY + 18 },
    end: { x: 160, y: baseY - 280 },
    color: pdfColors.grey,
  })

  const infos = [
    { title: "Cliente", value: order.client.clientName },
    ...(forAdmin
      ? [
          {
            title: "CPF / CNPJ",
            value:
              order.client.type === "juridical"
                ? formatCnpj(order.client.documents.register)
                : formatCpf(order.client.documents.register),
          },
        ]
      : []),
    { title: "Produtos:", value: String(order.totals.products) },
    { title: "Observações", value: "-" },
    ...(forAdmin
      ? [{ title: "Valor total", value: formatMoney(order.totals.value) }]
      : []),
  ]

  infos.forEach((info, iK) => {
    const newTitleY = igTitle.y - iK * infoGroupHeight
    const newValueY = igValue.y - iK * infoGroupHeight

    page.drawText(info.title, { ...igTitle, y: newTitleY })
    page.drawText(info.value, { ...igValue, y: newValueY })
  })
  page.drawText(order.client.clientName, igValue)

  return page
}
