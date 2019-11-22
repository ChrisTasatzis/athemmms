const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/login', (req, res) => {
    res.render('login')
}) 

router.post('/login', (req, res) => {
  console.log('kek2')
  res.render('index')
})

module.exports = router