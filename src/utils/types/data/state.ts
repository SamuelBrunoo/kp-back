export type TFBState = {
  code: number
  name: string
  abbr: string
}

export type TState = TFBState & {
  id: string
}
