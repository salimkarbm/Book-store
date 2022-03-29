import express, { NextFunction, Request, Response } from 'express'
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
const index = async (req: Request, res: Response) => {
  try {
    const users = await store.index()
    res.status(200).json(users)
  } catch (err) {
    res.status(400).json({ err })
  }
}

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.id)
    res.status(200).json(user)
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
export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
      return res
        .status(401)
        .json({ error: 'You are not logged in! please login to gain access.' })
    }
    const decoded = jwt.verify(token, secret)
    next()
  } catch (error) {
    console.log(error)
    res.status(401)
  }
}

const userRoutes = (app: express.Application) => {
  app.get('/api/users', index)
  app.get('/api/users/:id', show)
  app.post('/api/users', verifyAuthToken, create)
  app.post('/api/login', authenticate)
}

export default userRoutes
