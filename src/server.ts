import express, { Request, Response, ErrorRequestHandler } from "express"
import dotenv from "dotenv"
import cors from "cors"
import apiRoutes from "./routes/api"

dotenv.config()

const server = express()

server.use(cors({ origin: "*" }))

server.use(express.urlencoded({ extended: true }))
server.use(express.json())

server.use("/api", apiRoutes)

server.use((req: Request, res: Response) => {
  res
    .status(404)
    .json({ error: "Something goes wrong. Please contact our support." })
})

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  res
    .status(400)
    .json({ error: "Something goes wrong. Please contact our support." })
}
server.use(errorHandler)

server.listen(process.env.PORT, () => {
  console.log("Running server at port ", process.env.PORT)
})

export default server
