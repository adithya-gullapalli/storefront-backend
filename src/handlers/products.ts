import express from "express"
import { product, ProductStore } from "../models/products"
import authenticate_middleware from "../middleware/authenticate"
import "dotenv/config"

const store = new ProductStore()

const index = async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const products: product[] = await store.index()
    res.json(products)
  } catch (err) {
    res.status(400)
    res.json(`Error in showing all products: ${err}`)
  }
}

const show = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const product_id = parseInt(req.params.id)
    const product = await store.show(product_id)
    res.json(product)
  } catch (err) {
    res.status(400)
    res.json(`Error in showing product: ${err}`)
  }
}

const create = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const name = req.body.name as string
    const price = req.body.price as number
    const product: product = {
      id: null,
      name: name,
      price: price
    }
    const product_response = await store.create(product)
    res.json(product_response)
  } catch (err) {
    res.status(400)
    res.json(`Error in creating product: ${err}`)
  }
}

const product_router = (app: express.Application) => {
  app.use(express.json())
  app.get("/products", index)
  app.get("/products/:id", show)
  app.post("/products", authenticate_middleware.verify_token, create)
}

export default product_router
