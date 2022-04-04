import express, { Request, Response, NextFunction } from 'express'
import { Order, orderStore } from '../models/orders'
import { verifyAuthToken } from '../handlers/users'
const store = new orderStore()

const create = async (req: Request, res: Response) => {
  const order: Order = {
    status: req.body.status,
    userId: req.body.userId,
  }
  try {
    const orders = await store.create(order)
    res.status(201).json(orders)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

const index = async (req: Request, res: Response) => {
  try {
    const orders = await store.index()
    res.status(200).json(orders)
  } catch (err) {
    console.log(err)
    res.status(400).json({ err })
  }
}

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(req.params.id)
    res.status(200).json(order)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

const closedOrder = async (req: Request, res: Response, next: NextFunction) => {
  const order = await store.show(req.params.id)
  try {
    if (order.status === 'close') {
      return res.status(406).json({
        message: 'Order closed, cannot add product to closed order',
      })
    }
  } catch (err) {
    res.status(500).json(err)
  }
  next()
}

const addProduct = async (req: Request, res: Response) => {
  const orderId = req.params.id
  const productId = req.body.productId
  const quantity = parseInt(req.body.quantity, 10)
  try {
    const addProduct = await store.addProduct(quantity, orderId, productId)
    res.status(200).json(addProduct)
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err })
  }
}
const orderRoutes = (app: express.Application) => {
  app.post('/api/orders', verifyAuthToken, create)
  app.get('/api/orders', verifyAuthToken, index)
  app.get('/api/orders/:id', verifyAuthToken, show)
  app.post('/api/orders/:id/product', verifyAuthToken, closedOrder, addProduct)
}

export default orderRoutes
