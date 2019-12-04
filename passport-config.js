const LocalStrategy = require('passport-local').Strategy
const Users = require('./models/user')
const bcrypt = require('bcryptjs')


function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    try{
      const user = await Users.findOne({email: email})
      console.log(user.email)
      console.log(user.password)
      if (user == null) {
        return done(null, false, { message: 'No user with that email' })
      }
  
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password incorrect' })
        }
      } catch (e) {
        return done(e)
      }
    }
    catch(e)
    {
      console.log(e)
    }
    

    
  }

  passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize