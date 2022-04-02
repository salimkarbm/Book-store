import bcrypt from 'bcrypt'
import client from '../database'

export interface User {
  id?: number
  username: string
  password: string
  role?: string
}
const pepper = process.env.BCRYPT_PASSWORD
export class userStore {
  async create(user: User): Promise<User> {
    const newUser = {
      username: user.username,
      password: user.password,
    }
    const saltRound = parseInt(process.env.SALT_ROUNDS as string, 10)

    try {
      const conn = await client.connect()
      const sql =
        'INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING * '
      const hash = await bcrypt.hash(newUser.password + pepper, saltRound)
      const result = await conn.query(sql, [newUser.username, hash])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Unable to create user ${newUser.username} Error ${err}`)
    }
  }
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`could not fetch users from database ${err}`)
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = `SELECT * FROM users WHERE id=${id}`
      const conn = await client.connect()
      const result = await conn.query(sql)
      const book = result.rows[0]
      conn.release()
      return book
    } catch (err) {
      throw new Error(`could not find user with id ${id}. Error: ${err}`)
    }
  }

  async update(id: string, username: string, role: string): Promise<User> {
    try {
      const sql = `UPDATE users SET username=($1),roles=($2) WHERE id=${id} RETURNING *`
      const conn = await client.connect()
      const result = await conn.query(sql, [username, role])
      const book = result.rows[0]
      conn.release()
      return book
    } catch (err) {
      console.error(err)
      throw new Error(`could not update user ${username}, Error: ${err}`)
    }
  }
  async updateMe(id: string, username: string): Promise<User> {
    try {
      const sql = `UPDATE users SET username=($1) WHERE id=${id} RETURNING *`
      const conn = await client.connect()
      const result = await conn.query(sql, [username])
      const book = result.rows[0]
      conn.release()
      return book
    } catch (err) {
      console.error(err)
      throw new Error(`could not update user ${username}, Error: ${err}`)
    }
  }
  async delete(id: string): Promise<User> {
    try {
      const sql = `DELETE FROM users WHERE id=${id} RETURNING *`
      const conn = await client.connect()
      const result = await conn.query(sql)
      const book = result.rows[0]
      conn.release()
      return book
    } catch (err) {
      throw new Error(`Unable to delete user with ${id}, Error: ${err}`)
    }
  }
  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT id, password_digest FROM users WHERE username = ($1)'
      const result = await conn.query(sql, [username])
      if (result.rows.length > 0) {
        const user = result.rows[0]
        if (await bcrypt.compare(password + pepper, user.password_digest)) {
          return user
        }
      }
      return null
    } catch (err) {
      throw new Error(`Unable to authenticate user ${err}`)
    }
  }
}
