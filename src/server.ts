import express, { Request, Response } from 'express'
import bookRoutes from './handlers/books'
import userRoutes from './handlers/users'
import orderRoutes from './handlers/orders'
import productRoutes from './handlers/products'
import dashboardRoutes from './handlers/dashboard'

const app: express.Application = express()
const address: string = '0.0.0.0:5000'

app.use(express.json())

app.get('/', async function (req: Request, res: Response) {
  res.send('hello world')
})

bookRoutes(app)
userRoutes(app)
orderRoutes(app)
productRoutes(app)
dashboardRoutes(app)

app.listen(5000, function () {
  console.log(`starting app on: ${address}`)
})
