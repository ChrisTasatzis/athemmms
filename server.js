  const express = require('express')
  const app = express()  
  const indexRouter = require('./routes/index')
  
  app.set('view engine', 'ejs')
  app.set('views', __dirname + '/views')
  app.use(express.static('public'))
  
  const mongoose = require('mongoose')
  mongoose.connect('mongodb+srv://user:1M0JVOcuHHYtmRmO@cluster0-2srjd.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  const db = mongoose.connection
  db.on('error', error => console.error(error))
  db.once('open', () => console.log('Connected to Mongoose'))
  
  app.use('/', indexRouter)
  
  app.listen(process.env.PORT || 3000)

 