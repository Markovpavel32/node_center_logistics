function sort_by ({ sort_by = '', sort_desc = 'true' }) {
  if (!sort_by) return ''
  const sort_desc_string = sort_desc === 'false' ? '' : ' DESC'
  return 'ORDER BY ' + sort_by + sort_desc_string
}

module.exports =  { sort_by }