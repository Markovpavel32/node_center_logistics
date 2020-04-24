const passport = require('passport')
const LocalStrategy = require('passport-local')
const { User } = require('../models/user')

const local_strategy = new LocalStrategy({
  usernameField: 'login'
}, (login, password, done) => {
  User.findOne({ where: { login } })
    .then((user) => {
      if (!user) return done(null, false, { message: 'Пользователь не найден' });
      if (user.password != password) return done(null, false, { message: 'Неверный пароль' });
      return done(null, user)
    })
})

passport.use(local_strategy)

module.exports = passport