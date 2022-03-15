import express, { Request, Response } from "express"
import { UserStore } from "../models/users"
import authenticate_middleware from "../middleware/authenticate"
import { Order, OrderStore } from "../models/orders"
import "dotenv/config"

const store = new OrderStore()
const user_store = new UserStore()

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result: Order[] = await store.index()
    res.json(result)
  } catch (err) {
    res.status(400)
    res.json(`${err}`)
  }
}

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_id = parseInt(req.params.id)
    const result = await store.show(order_id)
    res.json(result)
  } catch (err) {
    res.status(400)
    res.json(`${err}`)
  }
}

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = parseInt(req.body.user_id)
    const status = req.body.status as string
    const user = await user_store.show(user_id)
    if (user) {
      const order: Order = {
        id: null,
        user_id: user_id,
        status: status
      }
      const result = await store.create(order)
      res.json(result)
    } else {
      res.status(404)
      res.json(`user_id:${user_id} not found`)
    }
  } catch (err) {
    res.status(400)
    res.json(`${err}`)
  }
}

const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_id = parseInt(req.params.id)
    const product_id = parseInt(req.body.product_id)
    const quantity = parseInt(req.body.quantity)
    const result = await store.addProduct(product_id, order_id, quantity)
    res.json(result)
  } catch (err) {
    res.status(400)
    res.json(`${err}`)
  }
}

const showCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = parseInt(req.params.id)
    const result = await store.showCurrentByUser(user_id)
    if (result) {
      res.json(result)
    } else {
      res.status(404)
      res.json(`No order found with user_id:${user_id}`)
    }
  } catch (err) {
    res.status(400)
    res.json(`${err}`)
  }
}

const order_router = (app: express.Application) => {
  app.use(express.json())
  app.get("/orders", authenticate_middleware.verify_token, index)
  app.get("/orders/:id", authenticate_middleware.verify_token, show)
  app.post("/orders", authenticate_middleware.verify_token, create)
  app.post("/orders/:id/products", authenticate_middleware.verify_token, addProduct)
  app.get("/orders/users/:id/current", authenticate_middleware.verify_token, showCurrentUser)
}

export default order_router
