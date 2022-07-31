import { Accounts } from '../models/Accounts.js'
import { Apps } from '../models/Accounts_apps.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import '../../config/strategies/local.strategy.js'

/**
 * Project's root
 * 
 * @param {*} req - Object
 * @param {*} res - Object
 * @returns A view...
 */
export async function home(req, res) {
    return res.status(200).send("Main view...")
}

/**
 * Register new account
 * 
 * @param {*} req - Payload with user data
 * @param {*} res - Object
 * @returns A JSON Object
 */
export async function createAccount(req, res) {
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
        return res.status(400).send({ status: false, error })
    }
}

/**
 * Associate an account with a new application
 * 
 * @param {*} req - Payload with user data
 * @param {*} res - Object
 * @returns A JSON Object
 */
export async function associateAccount(req, res) {
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
        return res.status(400).send({ status: false, error })
    }
}

/**
 * Update user data
 * 
 * @param {*} req - Payload with user data
 * @param {*} res - Object
 * @returns A JSON Object
 */
export async function updateAccount(req, res) {
    const body = (Object.keys(req.body).length) ? req.body : false
    if (!body) return res.status(400).send({ status: false, message: 'No data for update' })
    try {
        let updated = await Accounts.update(body, { where: { uuid: req.user.uuid } })
        return res.status(200).send({ status: true, message: 'Updated successfully' })
    } catch (error) {
        return res.status(400).send({ status: false, error })
    }
}

/**
 * Log in
 * 
 * @param {*} req - Payload with user's credentials
 * @param {*} res - Object
 * @returns A JSON Object with JWT
 */
export async function loginAccount(req, res) {
    try {
        let token = await jwt.sign(
            { user: req.user.uuid },
            'theSecretIsHere',
            { expiresIn: '120s' }
        )
        return res.status(200).send({ status: true, token, message: 'You are inside!' })
    } catch (error) {
        return res.status(500).send({ status: false, error })
    }
}

/**
 * Validate account
 * 
 * @param {*} req - Code sent 
 * @param {*} res - Object
 * @returns Maybe should return a view, but currently returns a JSON Object
 */
export async function validateAccount(req, res) {
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
        return res.status(400).send({ status: false, error })
    }
}

/**
 * Soft delete account
 * 
 * @param {*} req - Authorization header with JWT
 * @param {*} res - Object
 * @returns A JSON Object
 */
export async function deleteAccount(req, res) {
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
        return res.status(400).send({ status: false, error })
    }
}

/**
 * Validate JWt
 * 
 * @param {*} req - Authorization header with JWT
 * @param {*} res - Object
 * @returns A JSON Object
 */
export async function verifyToken(req, res) {
    return res.status(200).send({ status: true })
}