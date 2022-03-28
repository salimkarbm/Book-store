import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User, userStore } from '../models/users'

const store = new userStore()
const secret = process.env.TOKEN_SECRET as string

const create = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    password: req.body.password,
  }

  try {
    const newUser = await store.create(user)
    const token = jwt.sign({ userId: newUser.id }, secret)
    res.status(201).json({ token: token })
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

const authenticate = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    password: req.body.password,
  }
  try {
    const authenticateUser = await store.authenticate(
      user.username,
      user.password
    )
    if (authenticateUser === null) {
      return res.status(401).json({ message: 'incorrect username or password' })
    }
    const token = jwt.sign({ userId: authenticateUser.username }, secret)
    res.status(200).json(token)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

const userRoutes = (app: express.Application) => {
  app.post('/api/users', create)
  app.post('/api/login', authenticate)
}

export default userRoutes
