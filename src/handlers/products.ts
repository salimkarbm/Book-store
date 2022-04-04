import express, { Request, Response } from 'express'
import { Product, productStore } from '../models/products'
import { verifyAuthToken } from '../handlers/users'

const store = new productStore()

const create = async (req: Request, res: Response) => {
  const product: Product = {
    name: req.body.name,
    price: req.body.price,
  }
  try {
    const newProduct = await store.create(product)
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

const index = async (req: Request, res: Response) => {
  try {
    const products = await store.index()
    res.status(200).json(products)
  } catch (err) {
    res.status(400).json({ err })
  }
}

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(req.params.id)
    res.status(200).json(product)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

const productRoutes = (app: express.Application) => {
  app.post('/api/products', verifyAuthToken, create)
  app.get('/api/products', verifyAuthToken, index)
  app.get('/api/products/:id', verifyAuthToken, show)
}

export default productRoutes
