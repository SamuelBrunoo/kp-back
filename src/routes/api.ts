import { Router } from "express"

import * as AuthController from "../controllers/auth"
import * as ProductTypesController from "../controllers/productType"
import * as ColorsController from "../controllers/colors"
import * as ModelsController from "../controllers/model"
import * as ProductsController from "../controllers/product"
import * as ClientsController from "../controllers/client"
import * as RepsController from "../controllers/representative"
import * as OrderController from "../controllers/order"
import * as PLineController from "../controllers/productionLine"

import * as PageInfoController from "../controllers/pageInfo"
import * as DashboardController from "../controllers/dashboard"

import * as PaymentsController from "../controllers/payments"

import * as PdfController from "../controllers/pdf"
import { authenticate } from "../middlewares/auth"

const routes = Router()

// # Auth
routes.post("/auth/login", AuthController.login)
routes.post("/auth/refreshToken", AuthController.refreshToken)

routes.use(authenticate)

// # Dashboard
routes.get("/dashboard", DashboardController.getAdminDashboardInfo)

// # Form Bare
routes.get("/formBare/model", PageInfoController.getModelFormData)
routes.get("/formBare/product", PageInfoController.getProductFormData)
routes.get("/formBare/order", PageInfoController.getOrderFormData)
routes.get("/formBare/client", PageInfoController.getClientFormData)
routes.get(
  "/formBare/representative",
  PageInfoController.getRepresentativeFormData
)

// # Product Types
routes.get("/productTypes", ProductTypesController.getProductTypes)
routes.post("/productTypes", ProductTypesController.addProductType)

// # Colors
routes.get("/colors", ColorsController.getColors)
routes.post("/colors", ColorsController.addColor)

// # Models
routes.post("/models", ModelsController.addModel)
routes.get("/models", ModelsController.getModels)
routes.get("/models/listPage", ModelsController.getModelsListPage)
routes.delete("/models/:id", ModelsController.deleteModel)
routes.put("/models/:id", ModelsController.updateModel)
routes.get("/models/:id", ModelsController.getModel)

// # Products
routes.post("/products", ProductsController.addProduct)
routes.get("/products", ProductsController.getProducts)
routes.get("/products/listPage", ProductsController.getProductslistPage)
routes.delete("/products/:id", ProductsController.deleteProduct)
routes.put("/products/:id", ProductsController.updateProduct)
routes.get("/products/:id", ProductsController.getProduct)

// # Clients
routes.post("/clients", ClientsController.addClient)
routes.get("/clients", ClientsController.getClients)
routes.get("/clients/listPage", ClientsController.getClientsListPage)
routes.delete("/clients/:id", ClientsController.deleteClient)
routes.put("/clients/:id", ClientsController.updateClient)
routes.get("/clients/:id", ClientsController.getClient)

// # Representatives
routes.post("/representatives", RepsController.addRepresentative)
routes.get("/representatives", RepsController.getRepresentatives)
routes.get(
  "/representatives/listPage",
  RepsController.getRepresentativesListPage
)
routes.delete("/representatives/:id", RepsController.deleteRepresentative)
routes.put("/representatives/:id", RepsController.updateRepresentative)
routes.get("/representatives/:id", RepsController.getRepresentative)

// # Orders
routes.post("/orders", OrderController.addOrder)
routes.get("/orders", OrderController.getOrders)
routes.get("/orders/listPage", OrderController.getOrdersListPage)
routes.delete("/orders/:id", OrderController.deleteOrder)
routes.put("/orders/:id", OrderController.updateOrder)
routes.put("/orders/shipOrder/:id", OrderController.shipOrder)
routes.get("/orders/:id", OrderController.getOrder)

// # Production Lines
routes.post("/productionLines", PLineController.addProductionLine)
routes.get("/productionLines", PLineController.getProductionLines)
routes.get(
  "/productionLines/listPage/:showType",
  PLineController.getProductionLinesListPage
)
routes.delete("/productionLines/:id", PLineController.deleteProductionLine)
routes.put("/productionLines/:id", PLineController.updateProductionLine)
routes.get("/productionLines/:id", PLineController.getProductionLine)

// # Page info
routes.get("/pageInfo/orderForm", PageInfoController.getOrderFormData)

// # Payments
routes.post(
  "/payments/order/generate",
  PaymentsController.generateOrderPayments
)

// # PDF
routes.get("/pdfs/order", PdfController.getOrderPdf)

export default routes
