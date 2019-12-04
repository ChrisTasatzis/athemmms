const express = require('express')
const app = express()
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('passport')
const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
  secret: 'kek',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  async email => await Users.findOne({email: email}),
  async id => await Users.findOne({_id: id})
)

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://user:nJNwnqOmJoxKlQMV@cluster0-2srjd.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/login', indexRouter)


app.listen(process.env.PORT || 3000)
