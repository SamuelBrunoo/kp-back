export const matchDay = (
  targetDate: number | string | Date,
  baseDate: number | string | Date
) => {
  const t = new Date(targetDate)
  const b = new Date(baseDate)

  let baseInfo = {
    year: b.getFullYear(),
    month: b.getMonth(),
    day: b.getDate(),
  }

  let targetInfo = {
    year: t.getFullYear(),
    month: t.getMonth(),
    day: t.getDate(),
  }

  const status =
    baseInfo.year === targetInfo.year &&
    baseInfo.month === targetInfo.month &&
    baseInfo.day === targetInfo.day

  return status
}

export const matchMonth = (
  targetDate: number | string | Date,
  baseDate: number | string | Date
) => {
  const t = new Date(targetDate)
  const b = new Date(baseDate)

  let baseInfo = {
    year: b.getFullYear(),
    month: b.getMonth(),
  }

  let targetInfo = {
    year: t.getFullYear(),
    month: t.getMonth(),
  }

  const status =
    baseInfo.year === targetInfo.year && baseInfo.month === targetInfo.month

  return status
}

export const matchYear = (
  targetDate: number | string | Date,
  baseDate: number | string | Date
) => {
  const t = new Date(targetDate)
  const b = new Date(baseDate)

  let baseInfo = {
    year: b.getFullYear(),
  }

  let targetInfo = {
    year: t.getFullYear(),
  }

  const status = baseInfo.year === targetInfo.year

  return status
}
