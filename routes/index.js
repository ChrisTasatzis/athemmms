const express = require('express')
const router = express.Router()
const Users = require('../models/user')

const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('../passport-config')
initializePassport(
  passport,
  email => Users.findOne({email: email}),
  id => Users.findOne({_id: id})
)

router.use(flash())
router.use(session({
  secret: 'kek',
  resave: false,
  saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/login', (req, res) => {
    res.render('login')
}) 

router.get('/home', (req, res) => {
  res.render('home')
}) 

router.post('/login', (req, res) => {
  email = req.body.email
  password = req.body.password

  console.log(email)
  console.log(password)
  
  newUser = Users.findOne({email: email})

  console.log(newUser.email)
})

module.exports = router