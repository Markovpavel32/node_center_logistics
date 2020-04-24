const Sequelize = require('sequelize')

const sequelize = new Sequelize('service', 'lk', 'AJFGrLs6azpwE3k', {
  dialect: 'postgres',
  host: '94.228.196.246',
  define: {
    timestamps: false
  },
  port: 5434,
  schema: 'site'
});

module.exports = sequelize
