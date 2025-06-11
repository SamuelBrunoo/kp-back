export const formatPhone = (v: string) => {
  const nMask = v.replace(/\D/g, "")

  const f = nMask
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(nMask.length >= 11 ? /(\d{5})(\d)/ : /(\d{4})(\d)/, "$1-$2")
    .slice(0, 15)

  return f
}
