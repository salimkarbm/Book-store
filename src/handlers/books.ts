import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Books, BookStore } from '../models/books'
import { verifyAuthToken } from '../handlers/users'
const store = new BookStore()

const create = async (req: Request, res: Response) => {
  const book: Books = {
    title: req.body.title,
    author: req.body.author,
    type: req.body.type,
    totalPages: req.body.totalPages,
    summary: req.body.summary,
  }
  try {
    const books = await store.create(book)
    res.status(201).json(books)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

const index = async (req: Request, res: Response) => {
  try {
    const books = await store.index()
    res.status(200).json(books)
  } catch (err) {
    res.status(400).json({ err })
  }
}

const show = async (req: Request, res: Response) => {
  try {
    const book = await store.show(req.params.id)
    res.status(200).json(book)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}
const update = async (req: Request, res: Response) => {
  const book: Books = {
    title: req.body.title,
    author: req.body.author,
    totalPages: req.body.totalPages,
    type: req.body.type,
    summary: req.body.summary,
  }

  try {
    const updatedBooks = await store.update(
      req.params.id,
      book.title,
      book.author,
      book.totalPages,
      book.type,
      book.summary
    )
    res.status(200).json(updatedBooks)
  } catch (err) {
    console.log(err)
    res.status(404).json({ error: err })
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deletedBook = await store.delete(id)
    console.log(deletedBook)
    return res.status(204)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

const bookRoutes = (app: express.Application) => {
  app.post('/api/books', verifyAuthToken, create)
  app.get('/api/books', index)
  app.get('/api/books/:id', show)
  app.put('/api/books/:id', verifyAuthToken, update)
  app.delete('/api/books/:id', verifyAuthToken, destroy)
}

export default bookRoutes
