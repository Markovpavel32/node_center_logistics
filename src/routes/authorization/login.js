module.exports = (app, passport) => {
  app.post('/login', (req, res) => {
    passport.authenticate('local', (err, user, info) => {
      if (!user) res.status(401).send(info.message)
      else {
        req.login(user, function(error) {
            if (error) return next(error);
            return res.json(user);
        })
      }
    })(req,res)
  })
}
