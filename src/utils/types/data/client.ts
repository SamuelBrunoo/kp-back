export type TClient = {
  id: string
  name: string
  socialRole: string
  cpf?: string
  cnpj?: string
  stateRegister: string
  address: {
    street: string
    city: string
    state: string
    cep: string
  }
  email: string
  phone: string
}
