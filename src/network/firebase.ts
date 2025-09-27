import { initializeApp } from "firebase/app"
import * as fb from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCfmYLq4e_iEUDUq5w2kdKP1ExkAt9amGc",
  authDomain: "kp-back-5656d.firebaseapp.com",
  projectId: "kp-back-5656d",
  storageBucket: "kp-back-5656d.appspot.com",
  messagingSenderId: "1092414642735",
  appId: "1:1092414642735:web:3a0e846425eb7b134044da",
}

const app = initializeApp(firebaseConfig)

const firestore = fb.getFirestore(app)

// # Collections
export const collections = {
  users: fb.collection(firestore, "users"),
  clients: fb.collection(firestore, "clients"),
  colors: fb.collection(firestore, "colors"),
  emmitters: fb.collection(firestore, "emmitters"),
  models: fb.collection(firestore, "models"),
  orders: fb.collection(firestore, "orders"),
  productionLines: fb.collection(firestore, "productionLines"),
  products: fb.collection(firestore, "products"),
  productTypes: fb.collection(firestore, "productTypes"),
  representatives: fb.collection(firestore, "representatives"),
  workers: fb.collection(firestore, "workers"),

  // Locations
  cities: fb.collection(firestore, "cities"),
  states: fb.collection(firestore, "states"),

  // Statistics
  statistics: fb.collection(firestore, "statistics"),
}

// # Statistics documents
export const statisticsDocumentsNames = {
  orders: "orders",
}

export default app
