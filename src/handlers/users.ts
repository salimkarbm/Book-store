import { promisify } from 'util'
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
const update = async (req: Request, res: Response) => {
  try {
    const updatedUsers = await store.update(
      req.params.id,
      req.body.username,
      req.body.role
    )
    res.status(200).json(updatedUsers)
  } catch (err) {
    res.status(404).json({ error: err })
  }
}
const updateMe = async (req: Request, res: Response) => {
  try {
    const updateUser = await store.updateMe(req.params.id, req.body.username)
    res.status(200).json(updateUser)
  } catch (err) {
    res.status(404).json({ error: err })
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const deletedBook = await store.delete(req.params.id)
    res.status(204)
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
    const token = jwt.sign({ userId: authenticateUser.id }, secret)
    res.status(200).json(token)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}
export const verifyAuthToken = async (
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
    interface myToken {
      userId: string
      iat: number
      exp: number
    }
    const decoded = jwt.verify(token, secret) as unknown as myToken
    const currentUser = await store.show(decoded.userId)

    //@ts-ignore
    req.user = currentUser
    next()
  } catch (error) {
    res.status(401).json({ message: 'invalid token' })
  }
}

export const roleAuthentication = (...role: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    if (!role.includes(req.user.roles)) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to perform this action' })
    }
    next()
  }
}

const userRoutes = (app: express.Application) => {
  app.get('/api/users', index)
  app.get('/api/users/:id', show)
  app.post('/api/users', verifyAuthToken, create)
  app.post('/api/login', authenticate)
  app.put('/api/users/:id', verifyAuthToken, updateMe)
  app.patch(
    '/api/users/:id',
    verifyAuthToken,
    roleAuthentication('admin'),
    update
  )
  app.delete(
    '/api/users/:id',
    verifyAuthToken,
    roleAuthentication('admin'),
    destroy
  )
}

export default userRoutes
