const { checkAuth } = require('../../lib/index')

module.exports = (app, client) => {
  app.get(
    '/reception_documents',
    checkAuth(),
    function (req, resp) {
      client.query(`SELECT site.receptiondocuments('{"customer_id" : "     YSEL" , "start_date" : "2019-09-01" , "stop_date" : "2019-12-01", "maximum_rows" : 600}');`)
        .then(result => resp.json(result.rows[0].receptiondocuments))
        .catch(e => console.error(e.stack))
    }
  )
}
