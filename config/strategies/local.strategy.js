const { Strategy } = require('passport-local')
const { Account } = require('../../api/models/Accounts.js')
const { bcrypt } = require('bcrypt.js')

const LocalStrategy = new Strategy(async (email, password, done) => {
  try {
    const user = await Account.findOne({ where: { email, active: true, verified: true } })
    if (!user[0]) return done(null, false)
    let isValid = await bcrypt.compare(password, user[0].password)
    if (!isValid) return done(null, false)
    return done(null, user[0])
  } catch (error) {
    done(error, false)
  }

})

module.exports = LocalStrategy