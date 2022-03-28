import bcrypt from 'bcrypt'
import client from '../database'

export interface User {
  username: string
  password: string
}
const pepper = process.env.BCRYPT_PASSWORD
export class userStore {
  async create(user: User): Promise<User[]> {
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

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT password_digest FROM users where username = ($1)'
      const result = await conn.query(sql, [username])
      if (result.rows.length) {
        const user = result.rows[0]
        if (!(await bcrypt.compare(password + pepper, user.password_digest))) {
          return null
        }
        return user
      }
      return null
    } catch (err) {
      throw new Error(`Unable to authenticate user ${err}`)
    }
  }
}
