import express from 'express'
import { v4 } from 'uuid'

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.status(404)
    if (req.accepts('json'))
        return res.json({ status: false, error: "It isn't here!" })
})

app.get('/', async (req, res) => {
    return res.status(200).send("Some view...")
})

app.post('/sign-up', async (req, res) => {
    const { name, email, phone, password, app } = req.body
    if (!name || !email || !phone || !password || !app)
        return res.status(400).send({ status: false })
    let uuid = v4()
    return res.status(201).send({ status: true, uuid })
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

// app.get('/verify', (req, res) => {
//     res.status(401).send("Some view...")
// })

export default app