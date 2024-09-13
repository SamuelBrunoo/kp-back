import { Router } from "express"
import * as ProductTypesController from "../controllers/productType"
import * as ColorsController from "../controllers/colors"
import * as ModelsController from "../controllers/model"
import * as ProductsController from "../controllers/product"
import * as ClientsController from "../controllers/client"
import * as RepresentativesController from "../controllers/representative"

const routes = Router()

// # Product Types
routes.get("/productTypes", ProductTypesController.getProductTypes)
routes.post("/productTypes", ProductTypesController.addProductType)

// # Colors
routes.get("/colors", ColorsController.getColors)
routes.post("/colors", ColorsController.addColor)

// # Models
routes.post("/models", ModelsController.addModel)
routes.get("/models", ModelsController.getModels)
routes.delete("/models/:id", ModelsController.deleteModel)
routes.put("/models/:id", ModelsController.updateModel)
routes.get("/models/:id", ModelsController.getModel)

// # Products
routes.post("/products", ProductsController.addProduct)
routes.get("/products", ProductsController.getProducts)
routes.delete("/products/:id", ProductsController.deleteProduct)
routes.put("/products/:id", ProductsController.updateProduct)
routes.get("/products/:id", ProductsController.getProduct)

// # Clients
routes.post("/clients", ClientsController.addClient)
routes.get("/clients", ClientsController.getClients)
routes.delete("/clients/:id", ClientsController.deleteClient)
routes.put("/clients/:id", ClientsController.updateClient)
routes.get("/clients/:id", ClientsController.getClient)

// # Representatives
routes.post("/representatives", RepresentativesController.addRepresentative)
routes.get("/representatives", RepresentativesController.getRepresentatives)
routes.delete(
  "/representatives/:id",
  RepresentativesController.deleteRepresentative
)
routes.put(
  "/representatives/:id",
  RepresentativesController.updateRepresentative
)
routes.get("/representatives/:id", RepresentativesController.getRepresentative)

export default routes
