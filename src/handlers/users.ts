import express, { Request, Response } from 'express'
import { User, userStore } from '../models/users'

const store = new userStore()

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      username: req.body.username,
      password: req.body.password,
    }
    const users = await store.create(user)
    res.status(201).json(users)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

const userRoutes = (app: express.Application) => {
  app.post('/api/users', create)
  // app.get('/api/books', index)
  // app.get('/api/books/:id', show)
  // app.put('/api/books/:id', update)
  // app.delete('/api/books/:id', destroy)
}

export default userRoutes
