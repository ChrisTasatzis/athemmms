const express = require('express')
const router = express.Router()
const Users = require('../models/user')

const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

const initializePassport = require('../passport-config')
initializePassport(
  passport,
  async email => await Users.findOne({email: email}),
  async id => await Users.findOne({_id: id})
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

router.get('/', checkNotAuthenticated, (req, res) => {
  res.render('index')
})

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login')
}) 

router.get('/home', checkAuthenticated, (req, res) => {
  res.render('home')
}) 

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}))

router.post('/register', checkNotAuthenticated, async (req, res) => {
  email = req.body.email
  password = await bcrypt.hash(req.body.password, 10)
  firstName = req.body.firstName
  lastName = req.body.lastName

  newUser = new Users({email: email, password: password, firstName: firstName, lastName: lastName, discounted: false, timedTicket: 0, singleTicket: 0, money: 0})
  
  newUser.save(function (err, book) {
    if (err) return console.error(err);
    console.log(newUser.email + " saved to the collection.");
  });
  res.render('login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home')
  }
  next()
}

module.exports = router