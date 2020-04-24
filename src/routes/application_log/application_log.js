const { checkAuth } = require('../../lib/index')

module.exports = (app, client) => {
  app.get(
    '/application_log',
    checkAuth(),
    function (req, res) {
      client.query(`SELECT 
        "ид7" doc_id
        ,(CASE
        WHEN "ДатаДок" = '0001-01-01'::date THEN null
        ELSE "ДатаДок"
        END ) doc_date --дата приема
        ,"НомерЗаявки" app_number -- 
        ,"ДатаЗаявки" app_date
        ,"НомерАкта" act_number  
        ,"Стоимость" service_cost
        ,(CASE
        WHEN "Выполнена" THEN 'Выполнена'
        WHEN "Статус">=3 THEN 'Принимается'
        WHEN "Акцептована" THEN 'Акцептована'
        ELSE ''
        END ) status
        FROM db."Приемы"
        WHERE
        "Контрагент" = '${req.user.customer_id}'
        AND NOT _del 
        ORDER BY "ДатаЗаявки", "ид7" 
        ;`)
        .then(result => {
          console.log(result)
          res.json(result.rows)
        })
        .catch(e => console.error(e.stack))
    }
  )
}
