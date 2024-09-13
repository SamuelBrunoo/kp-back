export type TEmmitter = {
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
  orders: string[]
}
