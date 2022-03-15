import express from "express"
import cors from "cors"

import authenticate_router from "./handlers/authenticate"
import users_router from "./handlers/users"
import product_router from "./handlers/products"
import order_router from "./handlers/orders"

const app = express()
const port = 3000 // default port to listen
app.use(cors())

authenticate_router(app)
users_router(app)
product_router(app)
order_router(app)

app.get("/", (_req: express.Request, res: express.Response) => {
  res.status(200).send("Server started")
})

// starting the Express server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
