export const formatMoney = (v: number) => {
  let value = "R$ "

  const integers = Math.floor(v / 100)
  const cents = v % 100

  value += integers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  value += `,${String(cents).padStart(2, "0")}`

  return value
}
