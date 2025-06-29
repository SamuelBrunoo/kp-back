export const getSlipsValues = (total: number, installmentsCount: number) => {
  const installments = []
  const baseValue = Math.floor((total / installmentsCount) * 10) / 10
  let relativeTotal = baseValue * installmentsCount

  let diff = Math.round((total - relativeTotal) * 10) / 10

  for (let i = 0; i < installmentsCount; i++) {
    if (i === 0) {
      installments.push(Math.round((baseValue + diff) * 10) / 10)
    } else {
      installments.push(baseValue)
    }
  }

  return installments
}

export const getSlipDue = (slipStep: number, dueDate: string) => {
  let str = ""

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const nextDueMonth =
    today.getDate() <= +dueDate ? currentMonth : currentMonth + 1

  const getsNextYear = nextDueMonth + slipStep > 12

  const slipMonth = getsNextYear
    ? nextDueMonth + slipStep - 12
    : nextDueMonth + slipStep
  const slipYear = getsNextYear ? currentYear + 1 : currentYear

  const strSlipDate = dueDate.padStart(2, "0")
  const strSlipMonth = String(slipMonth).padStart(2, "0")

  str = `${slipYear}-${strSlipMonth}-${strSlipDate}`

  return str
}

export const getFormattedSlipDue = (slipStep: number, dueDate: string) => {
  let str = ""

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const nextDueMonth =
    today.getDate() <= +dueDate ? currentMonth : currentMonth + 1

  const getsNextYear = nextDueMonth + slipStep > 12

  const slipMonth = getsNextYear
    ? nextDueMonth + slipStep - 12
    : nextDueMonth + slipStep
  const slipYear = getsNextYear ? currentYear + 1 : currentYear

  const strSlipDate = dueDate.padStart(2, "0")
  const strSlipMonth = String(slipMonth).padStart(2, "0")

  str = `${strSlipDate}/${strSlipMonth}/${slipYear}`

  return str
}
