import {
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore"

export const parseFbDocs = (
  list: QuerySnapshot<DocumentData>
): any & { id: string } => {
  return list.docs.map((d) => ({ ...d.data(), id: d.id }))
}

export const parseFbDoc = (
  item: DocumentSnapshot<DocumentData>
): any & { id: string } => {
  return { ...item.data(), id: item.id }
}
