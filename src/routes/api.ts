import { Router } from "express"
import * as ProductTypesController from "../controllers/productType"
import * as ModelsController from "../controllers/model"
import * as ProductsController from "../controllers/product"
import * as ColorsController from "../controllers/colors"

const routes = Router()

// # Product Types
routes.get("/productTypes", ProductTypesController.getProductTypes)
routes.post("/productTypes", ProductTypesController.addProductType)

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

// # Colors
routes.get("/colors", ColorsController.getColors)
routes.post("/colors", ColorsController.addColor)

export default routes
