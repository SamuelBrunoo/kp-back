export const formatCpf = (v: string) => {
  const nMask = v.replace(/\D/g, "")

  const f = nMask.replace(
    /(\d{3})(\d{1,3})?(\d{1,3})?(\d{1,2})?/,
    function (_regex, $1, $2, $3, $4) {
      return (
        $1 + ($2 ? "." + $2 : "") + ($3 ? "." + $3 : "") + ($4 ? "-" + $4 : "")
      )
    }
  )

  return f.slice(0, 14)
}
