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
const authenticate = async (req: Request, res: Response) => {
  try {
    const user: User = {
      username: req.body.username,
      password: req.body.password,
    }
    const result = await store.authenticate(user.username, user.password)
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

const userRoutes = (app: express.Application) => {
  app.post('/api/users', create)
  app.post('/api/login', authenticate)
}

export default userRoutes
