import request from '@/axios/http'

const auth = process.env.VUE_APP_CMDB_SIGN_URL

export function cmdbSingleModelAPI (data, path, model) {
  path.page = data.pageData.page
  path.page_size = data.pageData.rowsPerPage
  if (data.filterData !== null) {
    const nameFilter = {
      $like: '%' + data.filterData + '%'
    }
    path.query.$and[0].name = nameFilter
  }
  return request({
    url: auth + `/cmdb_resource/object/${model}/instance/_search`,
    method: 'post',
    data: path
  })
}

export function cmdbInstanceSearchlAPI (data, model) {
  return request({
    url: auth + `/cmdb_resource/object/${model}/instance/_search`,
    method: 'post',
    data
  })
}
