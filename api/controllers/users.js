import express from 'express'
import { Accounts } from '../models/Accounts.js'
import { Apps } from '../models/Accounts_apps.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import passport from 'passport'
import '../../config/strategies/local.strategy.js'

const app = express()

var tokenVerify = (req, res, next) => {
    const token = req.headers.authorization || false
    if (!token) return res.status(401).send({ status: false, error: 'tokenExpected' })
    var decode
    try {
        decode = jwt.verify(token, 'theSecretIsHere')
        req.user = {
            uuid: decode.user
        }
        next()
    } catch (error) {
        return res.status(401).send({ status: false, error: message })
    }
}

app.use(passport.initialize())
app.use(express.json())

app.get('/', async (req, res) => {
    return res.status(200).send("Some view...")
})

app.post('/sign-up', async (req, res) => {
    const { name, email, phone, password, app } = req.body
    if (!name || !email || !phone || !password || !app)
        return res.status(400).send({ status: false, error: 'fieldsRequired' })
    let salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    let verifiedtoken = crypto.randomBytes(25).toString('hex')
    var newAccount
    var newApp
    try {
        newAccount = await Accounts.create({
            name,
            email,
            phone,
            password: hashPassword,
            salt,
            verifiedtoken
        })
        newAccount = newAccount.toJSON()
        newApp = await Apps.create({ user: newAccount.uuid, app })
        return res.status(201).send({ status: true, data: newAccount })
    } catch (error) {
        return res.status(400).send({ status: false, error: error.name })
    }
})

app.put('/sign-up', async (req, res) => {
    const { email, phone, app } = req.body
    if (!email || !phone || !app)
        return res.status(400).send({ status: false, error: 'fieldsRequired' })
    var foundAccount
    var foundApp
    try {
        foundAccount = await Accounts.findOne({ where: { email, phone } })
        if (foundAccount == null) return res.status(400).send({ status: false, error: 'accountNotFound' })
        foundApp = await Apps.findOne({ where: { user: foundAccount.uuid, app } })
        if (foundApp) return res.status(400).send({ status: false, error: 'appAlreadyAssociated' })
        let associated = await Apps.create({ user: foundAccount.uuid, app })
        return res.status(201).send({ status: true })
    } catch (error) {
        return res.status(400).send({ status: false, error: error.name })
    }
})

app.post('/update-account', tokenVerify, async (req, res) => {
    const body = (Object.keys(req.body).length) ? req.body : false
    if (!body) return res.status(400).send({ status: false, message: 'No data for update' })
    try {
        let updated = await Accounts.update(body, { where: { uuid: req.user.uuid } })
        return res.status(200).send({ status: true, message: 'Updated successfully' })
    } catch (error) {
        return res.status(400).send({ status: false, error: error.name })
    }
})

app.post('/log-in', passport.authenticate('local', { session: false }), async (req, res) => {
    try {
        let token = await jwt.sign(
            { user: req.user.uuid },
            'theSecretIsHere',
            { expiresIn: '120s' }
        )
        return res.status(200).send({ status: true, token, message: 'You are inside!' })
    } catch (error) {
        return res.status(500).send({ status: false, message: 'WTF?', error })
    }
})

app.get('/validate', async (req, res) => {
    if (!req.query.code) return res.status(400).send("Some view")
    var activatedUser
    try {
        activatedUser = await Accounts.update(
            { active: true, verified: true, verifiedtoken: '' },
            { where: { verifiedtoken: req.query.code, active: false, verified: false } }
        )
        if (!activatedUser[0]) return res.status(400).send({ status: false, message: 'userNotFound' })
        return res.status(200).send({ status: true, message: 'Validated' })
    } catch (error) {
        return res.status(400).send({ status: false, error: error.name })
    }
})

app.delete('/delete-my-account', tokenVerify, async (req, res) => {
    let foundAccount = await Accounts.findOne({ where: { uuid: req.user.uuid } })
    let account = {
        active: false,
        deleted: true,
        email: await bcrypt.hash(foundAccount.email, foundAccount.salt),
        phone: await bcrypt.hash(foundAccount.phone, foundAccount.salt)
    }
    try {
        let deleted = await Accounts.update(account, { where: { uuid: req.user.uuid } })
        return res.status(200).send({ status: true, message: 'Deleted successfully' })
    } catch (error) {
        return res.status(400).send({ status: false, error: error.name })
    }
})

app.get('/verify', tokenVerify, async (req, res) => {
    return res.status(200).send({ status: true })
})

export default app