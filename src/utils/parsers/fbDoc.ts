import { DocumentData, QuerySnapshot } from "firebase/firestore"

export const parseFbDocs = (
  list: QuerySnapshot<DocumentData>
): any & { id: string } => {
  return list.docs.map((d) => ({ ...d.data(), id: d.id }))
}
