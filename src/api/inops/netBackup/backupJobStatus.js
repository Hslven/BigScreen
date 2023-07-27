import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/backupJobStatus`

// 任务结果详情
export function getCreateByListAPI () {
  return request({
    url: `${url}/getCreateByList`,
    method: 'get'
  })
}
