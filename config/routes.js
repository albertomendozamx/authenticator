import { Router } from 'express'
import * as api from '../api/controllers/usersController.js'
import { tokenVerify } from './jwt.js'
import passport from 'passport'

const router = Router()

router.get('/', api.home)
router.post('/sign-up', api.createAccount)
router.put('/sign-up', api.associateAccount)
router.put('/account', tokenVerify, api.updateAccount)
router.post('/login', passport.authenticate('local', { session: false }), api.loginAccount)
router.get('/validate', api.validateAccount)
router.delete('account', tokenVerify, api.deleteAccount)
router.get('verify', tokenVerify, api.verifyToken)

export default router