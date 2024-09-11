import { DocumentData, QuerySnapshot } from "firebase/firestore"

export const parseFbDocs = (list: QuerySnapshot<DocumentData>) => {
  return list.docs.map((d) => ({ ...d.data(), id: d.id }))
}
