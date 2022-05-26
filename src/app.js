import express from 'express'
import { json, urlencoded } from 'body-parser'
import cookieParser from 'cookie-parser'
import config from './config'

import UserRouter from './resources/User/UserRouter'

export const app = express()

app.disable('x-powered-by')

app.use(json({ limit: '50mb' }))
app.use(cookieParser())
app.use(
  urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
)

app.use('/user', UserRouter)

export const start = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/`)
    })
  } catch (e) {
    console.error(e)
  }
}
