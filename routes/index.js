const express = require('express')
const router = express.Router()
const Users = require('../models/user')

const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/', checkNotAuthenticated, (req, res) => {
  res.render('index')
})

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login')
}) 

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register')
}) 

router.get('/home', checkAuthenticated, (req, res) => {
  res.render('home')
}) 

router.get('/ticket', checkAuthenticated, (req, res) => {
  res.render('ticket')
}) 

router.get('/billing', checkAuthenticated, (req, res) => {
  res.render('billing')
}) 

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}))

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
  email = req.body.email
  password = await bcrypt.hash(req.body.password, 10)
  firstName = req.body.firstName
  lastName = req.body.lastName

  if (await Users.findOne({email: email})) {
    req.flash('signupMessage', "Email exists already");
    res.locals.message = req.flash();
    res.render('register')
  } else if(req.body.password != req.body.repassword){
    req.flash('signupMessage', "Passwords must match");
    res.locals.message = req.flash();
    res.render('register')
  } else {
    newUser = new Users({email: email, password: password, firstName: firstName, lastName: lastName, discounted: false, timedTicket: 0, singleTicket: 0, money: 0})
  
    newUser.save(function (err) {
      if (err) 
        return console.error(err)

      res.render('login')
      console.log(newUser.email + " saved to the collection.")
    })
  }
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