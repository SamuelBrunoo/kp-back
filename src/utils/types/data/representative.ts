export type TRepresentative = {
  id: string
  name: string
  cpf?: string
  cnpj?: string
  address: {
    full: string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    cep: string
  }
  email: string
  phone: string
  clients: string[]
  orders: string[]
}

export type TNewRepresentative = {
  name: string
  cpf?: string
  cnpj?: string
  address: {
    full: string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    cep: string
  }
  email: string
  phone: string
}
