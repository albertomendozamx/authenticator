import passport from 'passport'
import * as PassportLocal from 'passport-local'
import { Accounts } from '../../api/models/Accounts.js'
import bcrypt from 'bcrypt'

passport.use(new PassportLocal.Strategy({
    usernameField: 'phone',
    passwordField: 'password'
}, async (phone, password, done) => {
    try {
        let userFound = await Accounts.findOne({ where: { phone, active: true, verified: true } })
        if (userFound == null) return done(null, false)
        userFound = userFound.toJSON()
        let isValid = await bcrypt.compare(password, userFound.password)
        if (!isValid) return done(null, false, { status: false, message: 'Unauthorized' })
        done(null, userFound)
    } catch (error) {
        done(error)
    }
}))