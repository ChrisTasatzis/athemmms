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


router.get('/home', checkAuthenticated, async (req, res) => {
  user = await Users.findById(req.session.passport.user)
  if(user.timedTicket>=30)
    var prog=100
  else 
    var prog = Math.round(user.timedTicket/0.3)
  res.render('home', {user: user, prog: prog})
}) 

router.get('/ticket', checkAuthenticated, async (req, res) => {
  user = await Users.findById(req.session.passport.user)
  res.render('ticket', {money: user.money, discounted: user.discounted})
}) 

router.post('/ticket', checkAuthenticated, async (req, res) => {
  user = await Users.findById(req.session.passport.user)
  tickets = req.body.tickets
  months = req.body.months
  money = req.body.moneyInp

  newTickets = user.singleTicket + Number(tickets)
  newMonths = user.timedTicket + Number(months)*30
  newBal = req.body.newBalInp

  if(newBal<0) {
    req.flash('moneyWarning', "Not enought money to complete the purchase");
    res.locals.message = req.flash();
    res.render('ticket', {money: user.money, discounted: user.discounted})
  } else { 
    newUser = await Users.updateOne({_id: req.session.passport.user}, {singleTicket: newTickets, timedTicket: newMonths, money: newBal}, function (err) {
      if (err) 
        return console.error(err) 

      res.redirect('home')
    })
  }
 
}) 

router.get('/money', checkAuthenticated, async (req, res) => {
  user = await Users.findById(req.session.passport.user)
  res.render('money', {money: user.money})
}) 

router.post('/money', checkAuthenticated, async (req, res) => {
  user = await Users.findById(req.session.passport.user)
  money = req.body.moneyInp

  newBal = req.body.newBalInp

  if(newBal<0) {
    req.flash('moneyWarning', "Amount of money can't be negative or 0");
    res.locals.message = req.flash();
    res.render('money', {money: user.money})
  } else { 
    newUser = await Users.updateOne({_id: req.session.passport.user}, {money: newBal}, function (err) {
      if (err) 
        return console.error(err) 
      res.redirect('billing')
    })
  }
})

router.get('/billing', checkAuthenticated, async (req, res) => {
  user = await Users.findById(req.session.passport.user)
  res.render('billing', {money: user.money})
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