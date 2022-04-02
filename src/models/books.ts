import client from '../database'

export interface Books {
  id?: string
  title: string
  totalPages: number
  author: string
  type: string
  summary: string
}

export class BookStore {
  async create(book: Books): Promise<Books[]> {
    try {
      const sql =
        'INSERT INTO books (title, author, total_pages, type, summary) VALUES($1,$2,$3,$4,$5) RETURNING *'
      const values = [
        book.title,
        book.author,
        book.totalPages,
        book.type,
        book.summary,
      ]
      const conn = await client.connect()
      const result = await conn.query(sql, values)
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`could not create book ${err}`)
    }
  }

  async index(): Promise<Books[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM books'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`could not fetch books from database ${err}`)
    }
  }

  async show(id: string): Promise<Books[]> {
    try {
      const sql = `SELECT * FROM books WHERE id=${id}`
      const conn = await client.connect()
      const result = await conn.query(sql)
      const book = result.rows[0]
      conn.release()
      return book
    } catch (err) {
      throw new Error(`could not find book with id ${id}. Error: ${err}`)
    }
  }

  async update(
    id: string,
    title: string,
    author: string,
    totalPages: number,
    type: string,
    summary: string
  ): Promise<Books> {
    try {
      const sql = `UPDATE books SET title = ($1), author = ($2),total_pages = ($3),type = ($4), summary = ($5) WHERE id=${id} RETURNING *`
      const values = [title, author, totalPages, type, summary]
      const conn = await client.connect()
      const result = await conn.query(sql, values)
      const book = result.rows[0]
      conn.release()
      return book
    } catch (err) {
      throw new Error(`could not update book ${title}, Error: ${err}`)
    }
  }

  async delete(id: string): Promise<Books> {
    try {
      const sql = `DELETE FROM books WHERE id=${id} RETURNING *`
      const conn = await client.connect()
      const result = await conn.query(sql)
      const book = result.rows[0]
      conn.release()
      return book
    } catch (err) {
      throw new Error(`could not delete book with ${id}, Error: ${err}`)
    }
  }
}
