import express, { Request, Response } from 'express'

import { DashboardQueries } from '../services/dashboard'

const dashboard = new DashboardQueries()

const productsInOrders = async (req: Request, res: Response) => {
  const products = await dashboard.productsInOrders()
  res.status(200).json(products)
}
const usersWithOrders = async (req: Request, res: Response) => {
  const users = await dashboard.usersWithOrders()
  res.status(200).json(users)
}
const top5Products = async (req: Request, res: Response) => {
  const mostExpensiveProducts = await dashboard.top5Products()
  res.status(200).json(mostExpensiveProducts)
}
const dashboardRoutes = (app: express.Application) => {
  app.get('/api/products-in-orders', productsInOrders)
  app.get('/api/users-with-orders', usersWithOrders)
  app.get('/api/top-5-products', top5Products)
}
export default dashboardRoutes
