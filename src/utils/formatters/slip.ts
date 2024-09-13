export const formatSlip = (value: string) => {
  let val = value.replace(/\D/g, "")

  val = val.replace(
    /(\d{1,5})?(\d{1,5})?(\d{1,5})?(\d{1,6})?(\d{1,5})?(\d{1,6})?(\d{1,1})?(\d{1,14})/,
    "$1.$2 $3.$4 $5.$6 $7 $8"
  )

  return val
}
