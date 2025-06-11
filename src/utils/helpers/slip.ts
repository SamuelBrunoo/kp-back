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
