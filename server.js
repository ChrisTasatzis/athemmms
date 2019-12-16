const express = require('express')
const app = express()
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('passport')
const indexRouter = require('./routes/index')
const Users = require('./models/user')
const schedule = require('node-schedule');


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
  async id => await Users.find({_id: id})
)

//Database connection
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://user:nJNwnqOmJoxKlQMV@cluster0-2srjd.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//Daily Task to remove one day from the users
var rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.second = 0;

var job = schedule.scheduleJob(rule, function(){
  console.log('kek')
  Users.updateMany({timedTicket: { $gt: 0} }, { $inc: {timedTicket: -1} }, function (err) {
    if (err) 
      return console.error(err) })
});


app.use('/', indexRouter)



app.listen(process.env.PORT || 3000)
