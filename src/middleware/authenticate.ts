import express from "express"

import authenticate_service from "../service/authenticate"

const verify_token = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.headers.authorization) {
    res.status(401).send("Authorization missing")
    return
  }
  try {
    const authorization_header = req.headers.authorization as string
    const token = authorization_header.split(" ")[1]
    //throws error if the jtw is wrong or manipulated.
    authenticate_service.verify_jwt(token)
    next()
  } catch (error) {
    res.status(401).send("Not authorized: " + error)
    return
  }
}

export default { verify_token }
