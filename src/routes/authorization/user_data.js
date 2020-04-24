module.exports = app => {
  app.get('/user_data', function(req, res) {
    res.json(req.user)
  })
}
