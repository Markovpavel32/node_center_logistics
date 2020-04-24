const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('../config/config')
const session = require('express-session')
const { Client } = require('pg')
const app = express()
const passport = require('../src/passport/passport')
const { User } = require('./models/user')

const whitelist = ['http://localhost:8080', 'https://elated-colden-9b09d4.netlify.app', 'https://elegant-dijkstra-ecdefa.netlify.app']
app.use(morgan('combined'))
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
  secret: 'you secret key',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

app.listen(process.env.PORT || config.port,
  () => console.log(`Server start on port ${config.port} ...`))
  const client = new Client({
    host: '94.228.196.246',
    port: 5434,
    user: 'lk',
    password: 'AJFGrLs6azpwE3k',
    database: 'service'
  })

  client.connect(err => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('connected')
    }
  })
require('./routes/authorization/login')(app, passport)
require('./routes/authorization/registration')(app, User)
require('./routes/reception_documents/index')(app, client)
require('./routes/application_log/application_log_appointment')(app, client)
require('./routes/application_log/application_log_to_issue')(app, client)
require('./routes/consignees/consignees_list')(app, client)
require('./routes/products/products_list')(app, client)
require('./routes/authorization/user_data')(app)
