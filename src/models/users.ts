import client from "../database"

export type user = {
  id: number | null
  first_name: string
  last_name: string
  password: string
}

export class UserStore {
  async index(): Promise<user[]> {
    try {
      const connect = await client.connect()
      const sql = "SELECT * FROM Users"
      const res = await connect.query(sql)
      connect.release()
      return res.rows
    } catch (err) {
      throw new Error(`Cannot get user: ${err}`)
    }
  }

  async show(id: number): Promise<user> {
    try {
      const connect = await client.connect()
      const sql = "SELECT * FROM Users WHERE id=($1)"
      const res = await connect.query(sql, [id])
      const result = res.rows[0] as user
      connect.release()
      return result
    } catch (err) {
      throw new Error(`Cannot get user with id: ${err}`)
    }
  }

  async create(current_user: user): Promise<user> {
    try {
      const connect = await client.connect()
      const sql = "INSERT INTO Users (first_name,last_name,password) VALUES($1, $2, $3) RETURNING *"
      const res = await connect.query(sql, [current_user.first_name, current_user.last_name, current_user.password])
      const result = res.rows[0]
      connect.release()
      return result
    } catch (err) {
      throw new Error(`Cannot add new user: ${err}`)
    }
  }
}
