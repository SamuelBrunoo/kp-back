export type TFBCity = {
  code: number
  state: number
  name: string
}

export type TCity = TFBCity & {
  id: string
}
