export type TFBWorker = {
  userId: string
  name: string
}

export type TWorker = TFBWorker & {
  id: string
}
