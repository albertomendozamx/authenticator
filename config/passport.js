const passport = require('passport')
const LocalStrategy = require('./strategies/local.strategy.js')

passport.use(LocalStrategy)