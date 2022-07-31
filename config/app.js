import express from 'express'
import passport from 'passport'
import 'dotenv/config'

const app = express()
app.use(passport.initialize())

app.use(express.json())

import accounts from './routes.js'

app.use(accounts)
export default app