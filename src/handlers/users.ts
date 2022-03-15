import express, { Request, Response } from "express"
import "dotenv/config"

import { User, UserStore } from "../models/users"
import authenticate_service from "../service/authenticate"
import authenticate_middleware from "../middleware/authenticate"

const store = new UserStore()

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users: User[] = await store.index()
    res.json(users)
  } catch (err) {
    res.status(400)
    res.json(`Error in showing all users: ${err}`)
  }
}

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = parseInt(req.params.id)
    const user = await store.show(user_id)
    res.json(user)
  } catch (err) {
    res.status(400)
    res.json(`Error in showing user: ${err}`)
  }
}

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const first_name = req.body.first_name as string
    const last_name = req.body.last_name as string
    const password = req.body.password as string
    const hashed_password = authenticate_service.hashing_password(password)
    const user: User = {
      id: null,
      first_name: first_name,
      last_name: last_name,
      password: hashed_password
    }

    const user_response = await store.create(user)
    // getting jwtToken from /authenticate via API call

    res.json(user_response)
  } catch (err) {
    res.status(400)
    res.json(`Error in creating user: ${err}`)
  }
}

const user_router = (app: express.Application) => {
  app.use(express.json())
  app.get("/users", authenticate_middleware.verify_token, index)
  app.get("/users/:id", authenticate_middleware.verify_token, show)
  app.post("/users", create)
}

export default user_router
