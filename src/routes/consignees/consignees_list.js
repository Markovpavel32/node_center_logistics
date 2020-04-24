const { checkAuth } = require('../../lib/index')
const { paginate } = require('../../lib/paginate')
const { sort_by } = require('../../lib/sort_by')

module.exports = (app, client) => {
  app.get(
    '/application_log/to_issue/consignees',
    checkAuth(),
    function (req, res) {
      client.query(`WITH p(customer_id, filter) AS (SELECT '${req.user.customer_id}'::char(9), '${req.query.name}'::text)
                    SELECT "ид7" as id, "Наименование" as consignee_name, "Адрес" as consignee_address
                    FROM db."Грузополучатели", p
                    WHERE "Владелец" = p.customer_id AND NOT _del
                    AND UPPER("Наименование") LIKE CONCAT('%', UPPER(p.filter), '%')
                    ORDER BY "Наименование";`)
        .then(result => {
          res.json({ total: result.rowCount, result: result.rows })
        })
        .catch(e => console.error(e.stack))
    }
  )

  app.get(
    '/consignees_list',
    checkAuth(),
    function (req, res) {
      client.query(`SELECT
          t."ид7" AS id,
          t."Наименование" as consignee_name,
          t."Адрес" AS consignee_address
        FROM db."Грузополучатели" t
        WHERE
         t."Владелец" = '${req.user.customer_id}' AND 
        NOT t._del
        ${sort_by(req.query)}
        ;`)
        .then(result => {
            paginate(result, req, res)
          })
        .catch(e => console.error(e.stack))
    }
  )
}