import express, { Request, Response } from 'express'
import bookRoutes from './handlers/books'

const app: express.Application = express()
const address: string = '0.0.0.0:5000'

app.use(express.json())

app.get('/', async function (req: Request, res: Response) {
  res.send('hello world')
})

bookRoutes(app)

app.listen(5000, function () {
  console.log(`starting app on: ${address}`)
})
