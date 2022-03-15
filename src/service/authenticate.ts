import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { user } from "../models/users"

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS as string)
const PEPPER = process.env.PEPPER as string

function hashing_password(plain_password: string): string {
  // Function to hash the given password

  const hashed_password = bcrypt.hashSync(plain_password + PEPPER, SALT_ROUNDS)
  return hashed_password
}

function checking_password(plain_password: string, hashed_password: string): boolean {
  const ifCorrect: boolean = bcrypt.compareSync(plain_password + PEPPER, hashed_password)
  return ifCorrect
}

function verify_jwt(token: string) {
  // Function to verify the jwt

  jwt.verify(token, process.env.TOKEN_SECRET as string)
}

function get_jwt(user: user): string {
  return jwt.sign({ user: user }, process.env.TOKEN_SECRET as string)
}

export default {
  hashing_password,
  checking_password,
  verify_jwt,
  get_jwt
}
