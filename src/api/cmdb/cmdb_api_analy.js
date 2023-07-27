import request from '@/axios/http'
const auth = process.env.VUE_APP_CLOUNDCMDB_SIGN_URL

// 界面模型API总访问情况统计接口
export function getVisitAnalyseApi (data) {
  return request({
    url: auth + 'cmdb_log/visit_analyse/',
    method: 'get',
    params: data
  })
}

// 界面各模型访问情况统计接口
export function getModelsApi (data) {
  return request({
    url: auth + 'cmdb_log/models/',
    method: 'get',
    params: data
  })
}

// 获取单个模型调用情况数据
export function getSingleModelApi (data) {
  return request({
    url: auth + 'cmdb_log/single_model/',
    method: 'get',
    params: data
  })
}

// OpenApi总调用情况统计接口
export function getOpenApi (data) {
  return request({
    url: auth + 'cmdb_log/open_api/',
    method: 'get',
    params: data
  })
}

// 各用户openApi调用情况统计接口
export function getOpenApiUserApi (data) {
  return request({
    url: auth + 'cmdb_log/open_api_user/',
    method: 'get',
    params: data
  })
}

// 用户-路径查询API调用情况统计接口
export function getUserPathApi (data) {
  return request({
    url: auth + 'cmdb_log/user_path_api/',
    method: 'get',
    params: data
  })
}

// 用户-模型查询API调用情况统计接口
export function getUserModelApi (data) {
  return request({
    url: auth + 'cmdb_log/user_model_api/',
    method: 'get',
    params: data
  })
}

// 用户-模型调用情况统计接口
export function getUserModelDetailApi (data) {
  return request({
    url: auth + 'cmdb_log/user_model_detail/',
    method: 'get',
    params: data
  })
}

// 模型查询次数排行榜接口
export function getModelRankApi (data) {
  return request({
    url: auth + 'cmdb_log/model_rank/',
    method: 'get',
    params: data
  })
}

// 获取字典
export function getDictionary (paramName) {
  return request({
    url: auth + 'config/config/',
    method: 'get',
    params: { param_name: paramName }
  })
}
