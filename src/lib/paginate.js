function paginate (result, req, res) {
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  const start_index = (page - 1) * limit
  const end_index = page * limit
  res.json({ total: result.rows.length, result: result.rows.slice(start_index, end_index) })
}

module.exports =  { paginate }