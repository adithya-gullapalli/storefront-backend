import client from "../database"

export type Order = {
  id: number | null
  user_id: number
  status: string
}

export type Order_product = {
  id: number | null
  order_id: number
  product_id: string
  quantity: number
}

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const connect = await client.connect()
      const sql = "SELECT * FROM Orders"
      const res = await connect.query(sql)
      connect.release()
      return res.rows
    } catch (err) {
      throw new Error(`Cannot get the order: ${err}`)
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const connect = await client.connect()
      const sql = "SELECT * FROM Orders WHERE id=($1)"
      const res = await connect.query(sql, [id])
      const result = res.rows[0]
      connect.release()
      return result
    } catch (err) {
      throw new Error(`Cannot get Order : ${err}`)
    }
  }

  async showCurrentByUser(user_id: number): Promise<Order> {
    try {
      const connect = await client.connect()
      const sql = "SELECT * FROM Orders WHERE user_id=($1) ORDER BY id DESC LIMIT 1"
      const res = await connect.query(sql, [user_id])
      const result = res.rows[0]
      connect.release()
      return result
    } catch (err) {
      throw new Error(`Cannot get Order : ${err}`)
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const connect = await client.connect()
      const sql = "INSERT INTO Orders (user_id, status) VALUES($1, $2) RETURNING *"
      const res = await connect.query(sql, [order.user_id, order.status])
      const result = res.rows[0]
      result.user_id = parseInt(result.user_id)
      connect.release()
      return result
    } catch (err) {
      throw new Error(`Cannot add new order ${order.user_id}: ${err}`)
    }
  }

  async addProduct(product_id: number, order_id: number, quantity: number): Promise<Order_product> {
    try {
      const connect = await client.connect()
      const sql = "INSERT INTO Order_products (product_id,order_id,quantity) VALUES($1, $2, $3) RETURNING *"
      const res = await connect.query(sql, [product_id, order_id, quantity])
      const result = res.rows[0]
      result.order_id = parseInt(result.order_id)
      result.product_id = parseInt(result.product_id)
      connect.release()
      return result
    } catch (err) {
      throw new Error(`Cannot add new Product: ${err}`)
    }
  }
}
