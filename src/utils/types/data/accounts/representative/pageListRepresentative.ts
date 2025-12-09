import { TBasicClient } from "../../client/basicClient"

export type TPageListRepresentative = {
  id: string
  name: string
  clients: number
  monthTotal: number
  monthSells: number
  yearTotal: number
  yearSells: number
  deletable: boolean
  details: TRepresentativeDetails
}

export type TRepresentativeDetails = {
  clients: TBasicClient[]
}
