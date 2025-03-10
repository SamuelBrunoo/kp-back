export type TFBProduct = {
  active: boolean
  code: string
  model: string
  name: string
  color: string
  type: string
  storage: {
    has: boolean
    quantity: number
  }
}

export type TBasicProduct = TFBProduct & {
  id: string
}

export type TProduct = {
  id: string
  active: boolean
  code: string
  model: string
  name: string
  color: string
  price: number
  type: string
  storage: {
    has: boolean
    quantity: number
  }
}

export type TNewProduct = {
  active: boolean
  code: string
  name: string
  color: string
  type: string
  model: string
  storage: {
    has: boolean
    quantity: number
  }
}

/* *** ListPage *** */

export type TPageListProduct = {
  id: string
  type: string
  typeKey: string
  model: string
  name: string
  code: string
  color: string
  storage: string | number
  price: number
  active: boolean
  conflicted: boolean
  deletable: boolean
}
