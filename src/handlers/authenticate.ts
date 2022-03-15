import express from "express"
import { UserStore } from "../models/users"
import authenticate_service from "../service/authenticate"
const user_store = new UserStore()

const user_authorization = async (req: express.Request, res: express.Response) => {
  // This function checks whether the given jws token is correct.

  try {
    const user_id = parseInt(req.body.id) as number
    const user_password = req.body.password as string

    // get and check the user by user_id
    const user = await user_store.show(user_id)
    const hashed_password = user.password
    if (authenticate_service.checking_password(user_password, hashed_password)) {
      // build JWT Token
      const jwt_token = authenticate_service.get_jwt(user)
      res.send(jwt_token)
    } else {
      res.status(401).send("No authorization: wrong credentials")
    }
  } catch (error) {
    res.status(401).send("No authorization: " + error)
  }
}

const authenticate_router = (app: express.Application) => {
  app.use(express.json())
  app.post("/authorize", user_authorization)
}

export default authenticate_router
