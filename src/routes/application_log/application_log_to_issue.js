const { checkAuth } = require('../../lib/index')
const { paginate } = require('../../lib/paginate')
const { sort_by } = require('../../lib/sort_by')

module.exports = (app, client) => {
  app.get(
    '/application_log/to_issue',
    checkAuth(),
    function (req, res) {
      client.query(`SELECT 
        "Выдачи"."ид7" id
        ,"НомерЗаявки" document_number
        ,"ДатаЗаявки" document_date
        ,"Грузополучатели"."Наименование" consignee_name
        ,"Грузополучатели"."ид7" consignee_id
        ,(CASE
        WHEN "Статус"=-1 THEN 'Отменена'
        WHEN "КОтгрузке" THEN 'КОтгрузке'
        WHEN "Скомплектован" AND "ПодобранПолностью" THEN 'Скомплектована'
        WHEN "Скомплектован" THEN 'Скомплектована частично'
        WHEN "Статус">=1 THEN 'Комплектуется'
        WHEN "Акцептована" THEN 'Акцептована'
        WHEN "НеАкцептована" THEN 'Не акцептована'
        ELSE 'Ожидает акцептования'
        END ) status
        ,"Грузополучатели"."Наименование" грузополучатель
        ,(CASE
        WHEN "ДатаОтгрузки" = '0001-01-01'::date THEN null
        ELSE "ДатаОтгрузки"
        END ) scheduled_date
        FROM db."Выдачи"
        LEFT JOIN db."Грузополучатели" ON "Грузополучатели"."ид7" = "Грузополучатель"
        WHERE
        "Контрагент" = '${req.user.customer_id}'
        AND NOT "Выдачи"._del
        AND "ДатаДок" = '0001-01-01'::date 
        ${sort_by(req.query)}
        ;`)
        .then(result => {
          paginate(result, req, res)
        })
        .catch(e => console.error(e.stack))
    }
  )

  app.get(
    '/application_log/to_issue/products',
    checkAuth(),
    function (req, res) {
      client.query(`
        SELECT 
          t."ид7" AS id, 
          t."Код" AS barcode, 
          t."Наименование" AS name, 
          t."Артикул" AS vendor_code, 
          t."Характеристика" AS size, 
          e."ид7" AS product_detail_id, 
          e."Наименование" AS product_detail_name, 
          v."КоличествоПоЗаявке" AS quantity, 
          v."Количество"
        FROM 
          db."тчВыдача" v, 
          db."Товары" t, 
          db."ЕдиницыТМЦ" e
        WHERE 
          t."ид7" = v."ВидТМЦ" AND
          e."ид7" = v."Единица" AND
          v."Нст" != 0 AND 
          NOT v._del  AND 
          v."Владелец" = '${req.query.id}'
        ORDER BY
          v."Нст" ASC;`)
        .then(result => {
          res.json({ total: result.rows.length, result: result.rows })
        })
        .catch(e => console.error(e.stack))
    }
  )

  app.post(
    '/application_log/to_issue',
    checkAuth(),
    function (req, res) {
      const { document_date, scheduled_date, document_number, document_lines, note, need_delivery, consignee} = req.body
      const model = JSON.stringify({
        document_date,
        scheduled_date,
        document_number,
        document_lines,
        note,
        need_delivery,
        customer_id: req.user.customer_id,
        consignee
      })
      client.query(`SELECT site.shipment_from_storage('${model}');`)
        .then(result => {
          res.json(result.rows)
        })
      .catch(e => console.error(e))
    }
  )
}
