import bcrypt from 'bcrypt'
import client from '../database'

export interface User {
  username: string
  password: string
}

export class userStore {
  create = async (user: User): Promise<User[]> => {
    const newUser = {
      username: user.username,
      password: user.password,
    }
    const saltRound = parseInt(process.env.SALT_ROUNDS as string, 10)
    const pepper = process.env.BCRYPT_PASSWORD
    try {
      const conn = await client.connect()
      const sql =
        'INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING * '
      const hash = await bcrypt.hash(newUser.password + pepper, saltRound)
      const result = await conn.query(sql, [newUser.username, hash])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Unable to create user ${user.username} Error ${err}`)
    }
  }
}
