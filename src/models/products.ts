import client from "../database"

export type product = {
  id: number | null
  name: string
  price: number
}

export class ProductStore {
  async index(): Promise<product[]> {
    try {
      const connect = await client.connect()
      const sql = "SELECT * FROM Products"
      const res = await connect.query(sql)
      connect.release()
      return res.rows
    } catch (err) {
      throw new Error(`Cannot get product: ${err}`)
    }
  }

  async show(id: number): Promise<product> {
    try {
      const connect = await client.connect()
      const sql = "SELECT * FROM Products WHERE id=($1)"
      const res = await connect.query(sql, [id])
      const result = res.rows[0]
      connect.release()
      return result
    } catch (err) {
      throw new Error(`Cannot get product with id: ${err}`)
    }
  }

  async create(product: product): Promise<product> {
    try {
      const connect = await client.connect()
      const sql = "INSERT INTO Products (name,price) VALUES($1, $2) RETURNING *"
      const res = await connect.query(sql, [product.name, product.price])
      const result = res.rows[0]
      connect.release()
      return result
    } catch (err) {
      throw new Error(`Cannot add new product : ${err}`)
    }
  }
}
