import express from 'express'
import { Accounts } from '../models/Accounts.js'
import { Apps } from '../models/Accounts_apps.js'
import crypto from 'crypto'

const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
    return res.status(200).send("Some view...")
})

app.post('/sign-up', async (req, res) => {
    const { name, email, phone, password, app } = req.body
    if (!name || !email || !phone || !password || !app)
        return res.status(400).send({ status: false, error: 'fieldsRequired' })
    let salt = crypto.randomBytes(20).toString('hex')
    let verifiedtoken = crypto.randomBytes(50).toString('hex')
    var newAccount
    var newApp
    try {
        newAccount = await Accounts.create({
            name,
            email,
            phone,
            password,
            salt,
            nip: '1234',
            verifiedtoken
        })
        newAccount = newAccount.toJSON()
        newApp = await Apps.create({ user: newAccount.uuid, app })
    } catch (error) {
        return res.status(400).send({ status: false, error: error.name })
    }
    return res.status(201).send({ status: true })
})

app.put('/sign-up', async (req, res) => {
    const { email, phone, app } = req.body
    if (!email || !phone || !app)
        return res.status(400).send({ status: false, error: 'fieldsRequired' })
    var foundAccount
    var foundApp
    var associated
    try {
        foundAccount = await Accounts.findOne({ where: { email, phone } })
        console.log('🔥 foundAccount', foundAccount)
        if (foundAccount) return res.status(400).send({ status: false, error: 'accountNotFound' })
        foundApp = await Apps.findOne({ where: { user: foundAccount.uuid, app } })
        if (foundApp) return res.status(400).send({ status: false, error: 'appAlreadyAssociated' })
        associated = await Apps.create({ user: foundAccount.uuid, app })
    } catch (error) {
        console.log('🔥 error', error)
        return res.status(400).send({ status: false, error: error.name })
    }
    return res.status(201).send({ status: true })
})

app.post('/update-account', (req, res) => {
    const jwt = req.headers.authorization || false
    if (!jwt) return res.status(401).send({ status: false, message: 'Unauthorized' })
    const body = Object.keys(req.body).length
    if (!body) return res.status(400).send({ status: false, message: 'No data for update' })
    else return res.status(200).send({ status: true, message: 'Updated successfully' })
})

app.post('/log-in', (req, res) => {
    const { phone, password } = req.body
    if (!phone || !password)
        return res.status(400).send({ status: false })
    else if (phone == '9511967667' && password == 'OnePasswordForExample')
        return res.status(200).send({ status: true, jwt: { validity: '', token: 'The.powerfull.token.is.here' } })
    else
        return res.status(401).send({ status: false })
})

app.get('/validate', (req, res) => {
    const { code } = req.body
    if (!code) return res.status(400).send("Some view")
    else if (code == 'a-string-wit-valid-code-for-activation')
        return res.status(200).send("Some view...")
    else
        return res.status(400).send("Some view...")
})

app.delete('/delete-my-account', (req, res) => {
    const jwt = req.headers.authorization || false
    if (!jwt) return res.status(401).send({ status: false })
    else if (jwt == 'the.powerfull.token.is.here')
        return res.status(200).send({ status: true })
    else
        return res.status(401).send({ status: false })
})

app.get('/verify', (req, res) => {
    const jwt = req.headers.authorization || false
    if (!jwt) return res.status(400).send({ status: false })
    else if (jwt == 'the.powerfull.token.is.here')
        return res.status(200).send({ status: true })
    else
        return res.status(401).send({ status: false })
})

export default app