import express, { Request, Response } from 'express'
import { Books, BookStore } from '../models/books'

const store = new BookStore()

const index = async (req: Request, res: Response) => {
  try {
    const books = await store.index()
    res.json(books)
  } catch (err) {
    res.status(404).json({ error: err })
  }
}
const create = async (req: Request, res: Response) => {
  try {
    const book: Books = {
      title: req.body.title,
      author: req.body.author,
      type: req.body.type,
      totalPages: req.body.totalPages,
      summary: req.body.summary,
    }
    const books = await store.create(book)
    res.json(books)
  } catch (err) {
    res.status(404).json({ error: err })
  }
}
const show = async (req: Request, res: Response) => {
  try {
    const book = await store.show(req.params.id)
    res.json(book)
  } catch (err) {
    res.status(404).json({ error: err })
  }
}
const update = async (req: Request, res: Response) => {
  const book: Books = {
    title: req.body.title,
    author: req.body.author,
    type: req.body.type,
    totalPages: req.body.totalPages,
    summary: req.body.summary,
  }
  try {
    const updatedBooks = await store.update(
      req.params.id,
      req.body.title,
      req.body.author,
      req.body.type,
      req.body.totalPages,
      req.body.summary
    )
    res.json(updatedBooks)
  } catch (err) {
    res.status(404).json({ error: err })
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const deletedBook = await store.delete(req.params.id)
    res.json(deletedBook)
  } catch (err) {
    res.status(404).json({ error: err })
  }
}

const bookRoutes = (app: express.Application) => {
  app.get('/api/books', index)
  app.post('/api/books', create)
  app.get('/api/books:', show)
  app.put('/api/books:id', update)
  app.delete('/api/books:id', destroy)
}

export default bookRoutes
