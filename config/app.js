import express from 'express'
import passport from 'passport'

const app = express()

app.use(express.json())

import accounts from './routes.js'

app.use(accounts)
export default app