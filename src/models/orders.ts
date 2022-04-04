import client from '../database'

export interface Order {
  id?: string
  status: string
  userId: string
}

export class orderStore {
  async create(order: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *'
      const values = [order.status, order.userId]
      const conn = await client.connect()
      const result = await conn.query(sql, values)
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`could not create order ${err}`)
    }
  }

  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      console.log(err)
      throw new Error(`unable to fetch orders from database ${err}`)
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const sql = `SELECT * FROM orders WHERE id=${id}`
      const conn = await client.connect()
      const result = await conn.query(sql)
      const order = result.rows[0]
      conn.release()
      return order
    } catch (err) {
      throw new Error(`could not find order with id ${id}. Error: ${err}`)
    }
  }

  async addProduct(
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<Order> {
    try {
      const sql = `INSERT INTO order_products (quantity, order_id, product_id) VALUES($1,$2,$3) RETURNING *`
      const conn = await client.connect()
      const result = await conn.query(sql, [quantity, orderId, productId])
      const addProduct = result.rows[0]
      conn.release()
      return addProduct
    } catch (err) {
      console.error(err)
      throw new Error(`unable to add product with  id ${productId} ${err}`)
    }
  }
}
