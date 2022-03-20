import express, { Request, Response } from 'express'

const app: express.Application = express()
const address: string = '0.0.0.0:3001'

app.use(express.json())

app.get('/', async function (req: Request, res: Response) {
  res.send('hello world')
})

app.listen(3000, function () {
  console.log(`starting app on: ${address}`)
})
