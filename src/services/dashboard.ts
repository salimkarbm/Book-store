import client from '../database'

export class DashboardQueries {
  // Get all products that have been included in orders
  async productsInOrders(): Promise<
    { name: string; price: number; order_id: string }[]
  > {
    try {
      const conn = await client.connect()
      const sql =
        'SELECT name, price, order_id FROM products INNER JOIN order_products ON products.id = order_products.product_id'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      console.log(err)
      throw new Error(`unable get products and orders: ${err}`)
    }
  }
  //Get all user that have created order
  async usersWithOrders(): Promise<{ username: string; status: string }[]> {
    try {
      const conn = await client.connect()
      const sql =
        'SELECT username, status FROM users INNER JOIN orders ON users.id = orders.user_id'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      console.error(err)
      throw new Error(`unable get users that have created orders: ${err}`)
    }
  }
  //Get top 5 most expensive items
  async top5Products(): Promise<{ name: string; price: string }[]> {
    try {
      const conn = await client.connect()
      const sql = `SELECT Name, Price FROM Products ORDER BY price DESC, name ASC LIMIT 5`
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`unable get top 5 expensive products: ${err}`)
    }
  }
}
