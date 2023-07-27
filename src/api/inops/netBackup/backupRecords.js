import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/backupRecords`

// 任务结果详情
export function recordsListPageAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params,
    data
  })
}
