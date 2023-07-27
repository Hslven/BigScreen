const cmdbSingleModelPath = {
  query: {
    $and: [{
      data_src_type: {
        $like: '%C9%'
      }
    }]
  },
  fields: {
    name: true
  },
  only_relation_view: true,
  page: 1,
  page_size: 20
}

module.exports = {
  cmdbSingleModelPath
}
