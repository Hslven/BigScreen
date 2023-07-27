import Mock from 'mockjs'
import qs from 'qs'
import { getBeforeDate } from '@/utils'

function regUrl (url) {
  return RegExp(url + '.*')
}

function parseQuery (url) {
  const urlStr = url.split('?')[1]
  const result = qs.parse(urlStr)
  return result
}

// 获取cmdb-server、cmdb-login服务每天的可用时长指标API
Mock.mock('/mock/cloundcmdb/api/v1/server_avail/all/', 'get', {
  code: 0,
  msg: '操作成功',
  data: [
    {
      datetime: '2023/02/09',
      cmdbServer: 1,
      cmdbLogin: 1
    },
    {
      datetime: '2023/02/10',
      cmdbServer: 1,
      cmdbLogin: 1
    },
    {
      datetime: '2023/02/11',
      cmdbServer: 0.64,
      cmdbLogin: 1
    },
    {
      datetime: '2023/02/12',
      cmdbServer: 0.92,
      cmdbLogin: 1
    },
    {
      datetime: '2023/02/13',
      cmdbServer: 0.86,
      cmdbLogin: 1
    },
    {
      datetime: '2023/02/14',
      cmdbServer: 1,
      cmdbLogin: 1
    },
    {
      datetime: '2023/02/15',
      cmdbServer: 0.21,
      cmdbLogin: 1
    },
    {
      datetime: '2023/02/16',
      cmdbServer: 0.48,
      cmdbLogin: 1
    }
  ]
})

// 获取cmdb-server、cmdb-login服务在指定时间段内的可用时长指标API
Mock.mock(
  '/mock/cloundcmdb/api/v1/server_avail_duration/days',
  'get',
  (data) => {
    return {
      code: 0,
      msg: '操作成功',
      data: {
        cmdbServer: 0.4,
        cmdbLogin: 0.72
      }
    }
  }
)

// 获取cmdb-server、cmdb-login服务在指定时间段内每小时的可用时长指标API
Mock.mock(
  '/mock/cloundcmdb/api/v1/server_avail_duration/hours',
  'get',
  (data) => {
    return {
      code: 0,
      msg: '操作成功',
      data: [
        {
          datetime: '2023-02-15 03:00:00',
          cmdbServer: 0.8,
          cmdbLogin: 1
        },
        {
          datetime: '2023-02-15 04:00:00',
          cmdbServer: 1,
          cmdbLogin: 1
        },
        {
          datetime: '2023-02-15 05:00:00',
          cmdbServer: 1,
          cmdbLogin: 1
        },
        {
          datetime: '2023-02-15 06:00:00',
          cmdbServer: 1,
          cmdbLogin: 1
        },
        {
          datetime: '2023-02-15 07:00:00',
          cmdbServer: 0.45,
          cmdbLogin: 1
        },
        {
          datetime: '2023-02-15 08:00:00',
          cmdbServer: 1,
          cmdbLogin: 1
        },
        {
          datetime: '2023-02-15 09:00:00',
          cmdbServer: 1,
          cmdbLogin: 0.21
        },
        {
          datetime: '2023-02-15 10:00:00',
          cmdbServer: 1,
          cmdbLogin: 1
        },
        {
          datetime: '2023-02-15 11:00:00',
          cmdbServer: 0.87,
          cmdbLogin: 1
        },
        {
          datetime: '2023-02-15 12:00:00',
          cmdbServer: 1,
          cmdbLogin: 1
        },
        {
          datetime: '2023-02-15 13:00:00',
          cmdbServer: 1,
          cmdbLogin: 1
        }
      ]
    }
  }
)

// 登陆模拟
Mock.mock(regUrl('/mock/authority/login'), (data) => {
  console.log('接收到的参数：', data)
  if (data.type === 'POST' && !data.body) {
    const query = parseQuery(data.url)
    console.log('接收到的参数：', query)
  }
  return require('./json/loginSuccess.json')
})

// token刷新模拟
Mock.mock(regUrl('/mock/authority/getLoginUser'), (data) => {
  console.log('接收到的参数：', data)
  if (data.type === 'POST' && !data.body) {
    const query = parseQuery(data.url)
    console.log('接收到的参数：', query)
  }
  return require('./json/loginSuccess.json')
})

// 获取用户列表
Mock.mock('/mock/authority/sys/user', 'get', (data) => {
  return require('./json/userList.json')
})

// 获取权限列表
Mock.mock('/mock/authority/sys/permission', 'get', (data) => {
  return require('./json/permissionList.json')
})

// 获取APP列表
Mock.mock('/mock/authority/sys/app', 'get', (data) => {
  return require('./json/appList.json')
})

// 获取APP详情列表
Mock.mock(
  '/mock/authority/sys/app/109bf96488a243d2b4a162c92d21b6d7',
  'get',
  (data) => {
    return require('./json/appInfo.json')
  }
)

// 获取角色列表
Mock.mock('/mock/authority/sys/role', 'get', (data) => {
  return require('./json/roleList.json')
})

// 获取角色详情列表
Mock.mock('/mock/authority/sys/role/10001', 'get', (data) => {
  return require('./json/roleInfo.json')
})

// 获取菜单列表
Mock.mock('/mock/authority/sys/menu/tree', 'get', (data) => {
  return require('./json/menuList.json')
})

// 脚本执行记录
Mock.mock(
  '/mock/inops/jobStatus/scriptDebug/listPage?pageNum=1&pageSize=10',
  'post',
  (data) => {
    return require('./json/executeLog.json')
  }
)
// 获取作业脚本
Mock.mock(
  '/mock/inops/script/listPage?pageSize=10&pageNum=1',
  'post',
  (data) => {
    return require('./json/jobscript.json')
  }
)
// 获取验收结果查询
Mock.mock(
  '/mock/inops/accept/taskResult/countOfTask?pageSize=10&pageNum=1',
  'post',
  (data) => {
    return require('./json/records.json')
  }
)
// 获取验收结果查询
Mock.mock(
  '/mock/inops/acceptJob/listPage?pageSize=10&pageNum=1',
  'post',
  (data) => {
    return require('./json/result.json')
  }
)
// 验收任务管理-自动执行-验收项选择
Mock.mock('/mock/inops/taskItem/list', 'post', (data) => {
  return require('./json/taskItem.json')
})
// 验收任务管理-自动执行-验收项选择-选择验收项
Mock.mock(
  '/mock/inops/taskItem/get/922784420e794b0991876cdd21fd22f8',
  'get',
  (data) => {
    return require('./json/taskItemGet.json')
  }
)

// 故障方案-故障方案查询
Mock.mock(
  '/mock/inops/faultCase/listPage?pageSize=10&pageNum=1',
  'post',
  (data) => {
    return require('./json/faultCase.json')
  }
)
// 故障方案-故障方案编排
Mock.mock('/mock/inops/faultCase/alarmEnumList', 'get', (data) => {
  return require('./json/alarmEnumList.json')
})
// 故障方案-故障方案推荐
Mock.mock('/mock/inops/faultCase/bindingList', 'get', (data) => {
  return require('./json/bindingList.json')
})
Mock.mock(
  '/mock/inops/cos/fault/listPage?pageNum=1&pageSize=10',
  'post',
  (data) => {
    return require('./json/bindingListlistPage.json')
  }
)

// 主动运维-故障记录资源池
Mock.mock('/mock/monitor/optical/getResourcePoolList', 'get', (data) => {
  return require('./json/getResourcePoolList.json')
})

// 主动运维-故障标记列表
Mock.mock('/mock/monitor/optical/fault/page', 'post', (data) => {
  return require('./json/signListAPI.json')
})
// 主动运维-故障标记更新列表
Mock.mock('/mock/monitor/optical/fault/update', 'put', (data) => {
  return require('./json/signListAPI.json')
})

// 资源变更检查-变更检查模板编排
Mock.mock('/mock/inops/taskItem/list', 'post', (data) => {
  return require('./json/changeCheck/list.json')
})
// 资源变更检查-变更检查任务
Mock.mock(
  '/mock/inops/changeJob/listPage?pageSize=10&pageNum=1',
  'post',
  (data) => {
    return require('./json/changeCheck/listPage.json')
  }
)
// 资源变更检查-配置信息检查结果
Mock.mock(
  '/mock/inops/accept/taskResult/countOfTask?pageSize=10&pageNum=1',
  'post',
  (data) => {
    return require('./json/changeCheck/countOfTask.json')
  }
)

// 开局配置-配置项模块
Mock.mock(
  '/mock/inops/taskItem/get/9498f0db850d4ba1b4b5189edaa71de4',
  'get',
  (data) => {
    return require('./json/config/get.json')
  }
)
Mock.mock(
  '/mock/inops/taskItem/getTaskScript/922784420e794b0991876cdd21fd22f8',
  'get',
  (data) => {
    return require('./json/config/getTaskScript.json')
  }
)

// 开局配置-配置结果查询
Mock.mock('/mock/inops/jobStatus/listPage', 'post', (data) => {
  return require('./json/config/listPage.json')
})
Mock.mock(
  '/mock/inops/jobStatus/listPage?pageSize=10&pageNum=1',
  'post',
  (data) => {
    return require('./json/config/listPage.json')
  }
)

const beforeTenDate = getBeforeDate(10)
const nowDate = getBeforeDate(0)

// CMDB界面API统计分析
Mock.mock(
  `/mock/cloundcmdb/api/v1/cmdb_log/visit_analyse/?dimension=day&begin_time=${beforeTenDate}&end_time=${nowDate}`,
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: {
        collect: {
          total: 51231,
          fail: 12421,
          avail_rate: 0.85
        },
        detail: [
          {
            time: '2023-04-24 00:00:00',
            total: 546,
            success: 446,
            fail: 100
          },
          {
            time: '2023-04-25 00:00:00',
            total: 546,
            success: 446,
            fail: 100
          },
          {
            time: '2023-04-26 00:00:00',
            total: 546,
            success: 446,
            fail: 100
          },
          {
            time: '2023-04-27 00:00:00',
            total: 546,
            success: 446,
            fail: 100
          },
          {
            time: '2023-04-28 00:00:00',
            total: 546,
            success: 446,
            fail: 100
          },
          {
            time: '2023-04-29 00:00:00',
            total: 546,
            success: 446,
            fail: 100
          }
        ]
      }
    }
  }
)

Mock.mock(
  `/mock/cloundcmdb/api/v1/cmdb_log/models/?dimension=day&begin_time=${beforeTenDate}&end_time=${nowDate}`,
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: {
        mv_rank: [
          {
            model: 'VM',
            mv: 412
          },
          {
            model: 'SRV',
            mv: 112
          },
          {
            model: 'ROUTER',
            mv: 12
          }
        ],
        fail_mv_rank: [
          {
            model: 'VM',
            mv: 12
          },
          {
            model: 'SRV',
            mv: 5
          },
          {
            model: 'ROUTER',
            mv: 12
          }
        ],
        detail: [
          {
            time: '2023-04-25 00:00:00',
            model: 'VM',
            total: 21
          },
          {
            time: '2023-04-25 00:00:00',
            model: 'SRV',
            total: 121
          },
          {
            time: '2023-04-25 00:00:00',
            model: 'ROUTER',
            total: 121
          },
          {
            time: '2023-04-26 00:00:00',
            model: 'VM',
            total: 21
          },
          {
            time: '2023-04-26 00:00:00',
            model: 'SRV',
            total: 121
          },
          {
            time: '2023-04-26 00:00:00',
            model: 'ROUTER',
            total: 121
          },
          {
            time: '2023-04-27 00:00:00',
            model: 'VM',
            total: 21
          },
          {
            time: '2023-04-27 00:00:00',
            model: 'SRV',
            total: 121
          },
          {
            time: '2023-04-27 00:00:00',
            model: 'ROUTER',
            total: 121
          },
          {
            time: '2023-04-28 00:00:00',
            model: 'VM',
            total: 21
          },
          {
            time: '2023-04-28 00:00:00',
            model: 'SRV',
            total: 121
          },
          {
            time: '2023-04-28 00:00:00',
            model: 'ROUTER',
            total: 121
          },
          {
            time: '2023-04-29 00:00:00',
            model: 'VM',
            total: 21
          },
          {
            time: '2023-04-29 00:00:00',
            model: 'SRV',
            total: 121
          },
          {
            time: '2023-04-29 00:00:00',
            model: 'ROUTER',
            total: 121
          }
        ]
      }
    }
  }
)

Mock.mock(
  `/mock/cloundcmdb/api/v1/cmdb_log/single_model/?dimension=day&begin_time=${beforeTenDate}&end_time=${nowDate}&model=VM`,
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: [
        {
          time: '2023-04-23 00:00:00',
          total: 152,
          success: 120,
          fail: 32
        },
        {
          time: '2023-04-24 00:00:00',
          total: 152,
          success: 120,
          fail: 32
        },
        {
          time: '2023-04-25 00:00:00',
          total: 152,
          success: 120,
          fail: 32
        },
        {
          time: '2023-04-26 00:00:00',
          total: 152,
          success: 120,
          fail: 32
        },
        {
          time: '2023-04-27 00:00:00',
          total: 152,
          success: 120,
          fail: 32
        },
        {
          time: '2023-04-28 00:00:00',
          total: 152,
          success: 120,
          fail: 32
        },
        {
          time: '2023-04-29 00:00:00',
          total: 152,
          success: 120,
          fail: 32
        },
        {
          time: '2023-04-30 00:00:00',
          total: 152,
          success: 120,
          fail: 32
        },
        {
          time: '2023-05-01 00:00:00',
          total: 152,
          success: 120,
          fail: 32
        }
      ]
    }
  }
)

// CMDB消费API统计分析
Mock.mock(
  `/mock/cloundcmdb/api/v1/cmdb_log/open_api/?dimension=day&begin_time=${beforeTenDate}&end_time=${nowDate}`,
  'get',
  (data) => {
    return {
      code: 0,
      message: 'path',
      data: {
        open_api: {
          total: 51231,
          fail: 12421,
          avail_rate: 0.85,
          detail: [
            {
              time: '2023-04-24 00:00:00',
              total: 546,
              path: 446,
              model: 100
            },
            {
              time: '2023-04-25 00:00:00',
              total: 546,
              path: 446,
              model: 100
            },
            {
              time: '2023-04-26 00:00:00',
              total: 546,
              path: 446,
              model: 100
            },
            {
              time: '2023-04-27 00:00:00',
              total: 546,
              path: 446,
              model: 100
            },
            {
              time: '2023-04-28 00:00:00',
              total: 546,
              path: 446,
              model: 100
            },
            {
              time: '2023-04-29 00:00:00',
              total: 546,
              path: 446,
              model: 100
            }
          ]
        },
        path_api: {
          total: 51231,
          fail: 12421,
          avail_rate: 0.85,
          detail: [
            {
              time: '2023-04-24 00:00:00',
              total: 546,
              success: 446,
              fail: 100
            },
            {
              time: '2023-04-25 00:00:00',
              total: 546,
              success: 446,
              fail: 100
            },
            {
              time: '2023-04-26 00:00:00',
              total: 546,
              success: 446,
              fail: 100
            },
            {
              time: '2023-04-27 00:00:00',
              total: 546,
              success: 446,
              fail: 100
            },
            {
              time: '2023-04-28 00:00:00',
              total: 546,
              success: 446,
              fail: 100
            },
            {
              time: '2023-04-29 00:00:00',
              total: 546,
              success: 446,
              fail: 100
            }
          ]
        },
        model_api: {
          total: 51231,
          fail: 12421,
          avail_rate: 0.85,
          detail: [
            {
              time: '2023-04-24 00:00:00',
              total: 546,
              success: 446,
              fail: 100
            },
            {
              time: '2023-04-25 00:00:00',
              total: 546,
              success: 446,
              fail: 100
            },
            {
              time: '2023-04-26 00:00:00',
              total: 546,
              success: 446,
              fail: 100
            },
            {
              time: '2023-04-27 00:00:00',
              total: 546,
              success: 446,
              fail: 100
            },
            {
              time: '2023-04-28 00:00:00',
              total: 546,
              success: 446,
              fail: 100
            },
            {
              time: '2023-04-29 00:00:00',
              total: 546,
              success: 446,
              fail: 100
            }
          ]
        }
      }
    }
  }
)

Mock.mock(
  `/mock/cloundcmdb/api/v1/cmdb_log/open_api_user/?dimension=day&begin_time=${beforeTenDate}&end_time=${nowDate}`,
  'get',
  (data) => {
    return {
      code: 0,
      message: 'path',
      data: [
        {
          user: 'dwxiezongxin',
          path_api: 124,
          model_api: 24
        },
        {
          user: 'admin',
          path_api: 124,
          model_api: 24
        },
        {
          user: 'dwxiaoming',
          path_api: 124,
          model_api: 24
        },
        {
          user: 'modops',
          path_api: 124,
          model_api: 24
        },
        {
          user: 'dwzhanghaowen',
          path_api: 124,
          model_api: 24
        },
        {
          user: 'cloudcmdb',
          path_api: 124,
          model_api: 24
        }
      ]
    }
  }
)

Mock.mock(
  `/mock/cloundcmdb/api/v1/cmdb_log/user_path_api/?dimension=day&begin_time=${beforeTenDate}&end_time=${nowDate}&user=dwxiezongxin`,
  'get',
  (data) => {
    return {
      code: 0,
      message: 'path',
      data: [
        {
          time: '2023-04-24 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-04-25 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-04-26 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-04-27 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-04-28 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-04-29 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-04-30 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-05-01 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        }
      ]
    }
  }
)

Mock.mock(
  `/mock/cloundcmdb/api/v1/cmdb_log/user_model_api/?dimension=day&begin_time=${beforeTenDate}&end_time=${nowDate}&user=dwxiezongxin`,
  'get',
  (data) => {
    return {
      code: 0,
      message: 'path',
      data: [
        {
          time: '2023-04-24 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-04-25 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-04-26 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-04-27 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-04-28 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-04-29 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-04-30 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        },
        {
          time: '2023-05-01 00:00:00',
          total: 124,
          success: 100,
          fail: 24
        }
      ]
    }
  }
)

Mock.mock(
  `/mock/cloundcmdb/api/v1/cmdb_log/user_model_detail/?dimension=day&begin_time=${beforeTenDate}&end_time=${nowDate}`,
  'get',
  (data) => {
    return {
      code: 0,
      message: 'path',
      data: [
        {
          name: 'dwxiezongxin',
          value: 1231,
          children: [
            {
              name: '模型1',
              value: 231,
              children: [
                {
                  name: 'success',
                  value: 201
                },
                {
                  name: 'fail',
                  value: 30
                }
              ]
            },
            {
              name: '模型2',
              value: 45,
              children: [
                {
                  name: 'success',
                  value: 40
                },
                {
                  name: 'fail',
                  value: 5
                }
              ]
            },
            {
              name: '模型3',
              value: 45,
              children: [
                {
                  name: 'success',
                  value: 40
                },
                {
                  name: 'fail',
                  value: 5
                }
              ]
            },
            {
              name: '模型4',
              value: 910,
              children: [
                {
                  name: 'success',
                  value: 900
                },
                {
                  name: 'fail',
                  value: 10
                }
              ]
            }
          ]
        },
        {
          name: 'modops',
          value: 231,
          children: [
            {
              name: '模型1',
              value: 23,
              children: [
                {
                  name: 'success',
                  value: 20
                },
                {
                  name: 'fail',
                  value: 3
                }
              ]
            },
            {
              name: '模型2',
              value: 100,
              children: [
                {
                  name: 'success',
                  value: 70
                },
                {
                  name: 'fail',
                  value: 30
                }
              ]
            },
            {
              name: '模型3',
              value: 108,
              children: [
                {
                  name: 'success',
                  value: 100
                },
                {
                  name: 'fail',
                  value: 8
                }
              ]
            }
          ]
        },
        {
          name: 'cloudcmdb',
          value: 100,
          children: [
            {
              name: '模型1',
              value: 30,
              children: [
                {
                  name: 'success',
                  value: 20
                },
                {
                  name: 'fail',
                  value: 10
                }
              ]
            },
            {
              name: '模型2',
              value: 40,
              children: [
                {
                  name: 'success',
                  value: 20
                },
                {
                  name: 'fail',
                  value: 20
                }
              ]
            },
            {
              name: '模型3',
              value: 30,
              children: [
                {
                  name: 'success',
                  value: 24
                },
                {
                  name: 'fail',
                  value: 6
                }
              ]
            }
          ]
        }
      ]
    }
  }
)

Mock.mock(
  `/mock/cloundcmdb/api/v1/cmdb_log/model_rank/?dimension=day&begin_time=${beforeTenDate}&end_time=${nowDate}`,
  'get',
  (data) => {
    return {
      code: 0,
      message: 'path',
      data: [
        {
          name: '模型1',
          value: 456
        },
        {
          name: '模型2',
          value: 454
        },
        {
          name: '模型3',
          value: 453
        },
        {
          name: '模型4',
          value: 452
        },
        {
          name: '模型5',
          value: 451
        },
        {
          name: '模型6',
          value: 446
        },
        {
          name: '模型7',
          value: 436
        }
      ]
    }
  }
)

Mock.mock('/mock/monitor/largeScreen/getCountOfAlarmEvents', 'get', (data) => {
  return {
    code: 0,
    msg: '操作成功',
    data: [
      {
        project_period: '一期',
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        eventAlarmSum: 0,
        oneAlarmSum: 0,
        twoAlarmSum: 0,
        threeAlarmSum: 0
      },
      {
        project_period: '二期',
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        eventAlarmSum: 0,
        oneAlarmSum: 0,
        twoAlarmSum: 0,
        threeAlarmSum: 0
      },
      {
        project_period: '一期',
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        eventAlarmSum: 0,
        oneAlarmSum: 0,
        twoAlarmSum: 0,
        threeAlarmSum: 0
      },
      {
        project_period: '三期',
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        eventAlarmSum: 0,
        oneAlarmSum: 0,
        twoAlarmSum: 0,
        threeAlarmSum: 0
      },
      {
        project_period: '一期',
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        eventAlarmSum: 0,
        oneAlarmSum: 0,
        twoAlarmSum: 1,
        threeAlarmSum: 0
      },
      {
        project_period: '二期',
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        eventAlarmSum: 0,
        oneAlarmSum: 0,
        twoAlarmSum: 0,
        threeAlarmSum: 1
      }
    ]
  }
})

Mock.mock('/mock/monitor/largeScreen/getAlarmEventsData', 'get', (data) => {
  return {
    code: 0,
    msg: '操作成功',
    data: [
      {
        level: 1,
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        type: '告警',
        title:
          '描述1:【AI智荐】AI识别到NFV-D-HNZJI-07A-1301-AF02-M-FW-01 产生 [主备设备的配置不一致] 告警事件。',
        date_time: '2023-05-18 04:11:11'
      },
      {
        level: 1,
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        type: '告警',
        title:
          '描述1:【AI智荐】AI识别到NFV-D-HNZJI-07A-1301-AF02-M-FW-01 产生 [主备设备的配置不一致] 告警事件。',
        date_time: '2023-05-18 04:11:11'
      },
      {
        level: 1,
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        type: '告警',
        title:
          '描述1:【AI智荐】AI识别到NFV-D-HNZJI-07A-1301-AF02-M-FW-01 产生 [主备设备的配置不一致] 告警事件。',
        date_time: '2023-05-18 04:11:11'
      },
      {
        level: 1,
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        type: '告警',
        title:
          '描述1:【AI智荐】AI识别到NFV-D-HNZJI-07A-1301-AF02-M-FW-01 产生 [主备设备的配置不一致] 告警事件。',
        date_time: '2023-05-18 04:11:11'
      },
      {
        level: 1,
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        type: '告警',
        title:
          '描述1:【AI智荐】AI识别到NFV-D-HNZJI-07A-1301-AF02-M-FW-01 产生 [主备设备的配置不一致] 告警事件。',
        date_time: '2023-05-18 04:11:11'
      },
      {
        level: 1,
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        type: '告警',
        title:
          '描述1:【AI智荐】AI识别到NFV-D-HNZJI-07A-1301-AF02-M-FW-01 产生 [主备设备的配置不一致] 告警事件。',
        date_time: '2023-05-18 04:11:11'
      },
      {
        level: 1,
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        type: '告警',
        title:
          '描述1:【AI智荐】AI识别到NFV-D-HNZJI-07A-1301-AF02-M-FW-01 产生 [主备设备的配置不一致] 告警事件。',
        date_time: '2023-05-18 04:11:11'
      },
      {
        level: 1,
        name: 'DMZ',
        pool_name: 'NFV-RP-HNGZ-00A',
        type: '告警',
        title:
          '描述1:【AI智荐】AI识别到NFV-D-HNZJI-07A-1301-AF02-M-FW-01 产生 [主备设备的配置不一致] 告警事件。',
        date_time: '2023-05-18 04:11:11'
      }
    ]
  }
})

Mock.mock(
  '/mock/monitor/largeScreen/getPoolAlarmDetail?resourcePool=NFV-RP-HNGZ-00A',
  'get',
  (data) => {
    return {
      code: 0,
      msg: '操作成功',
      data: {
        eventAlarmSum: 85,
        oneAlarmSum: 44,
        twoAlarmSum: 22,
        threeAlarmSum: 11,
        detail: [
          {
            level: 1,
            type: '告警',
            status: false,
            title:
              '描述1:【AI智荐】AI识别到NFV-D-HNZJI-07A-1301-AF02-M-FW-01 产生 [主备设备的配置不一致] 告警事件。',
            start_time: '2023-05-18 04:11:11',
            device_name: 'NFV-D-HNZJI-07A-1301-AF02-M-FW-01'
          },
          {
            level: 1,
            type: '告警',
            status: false,
            title:
              '描述1:【AI智荐】AI识别到NFV-D-HNZJI-07A-1301-AF02-M-FW-01 产生 [主备设备的配置不一致] 告警事件。',
            start_time: '2023-05-18 04:11:11',
            device_name: 'NFV-D-HNZJI-07A-1301-AF02-M-FW-01'
          },
          {
            level: 1,
            type: '告警',
            status: false,
            title:
              '描述1:【AI智荐】AI识别到NFV-D-HNZJI-07A-1301-AF02-M-FW-01 产生 [主备设备的配置不一致] 告警事件。',
            start_time: '2023-05-18 04:11:11',
            device_name: 'NFV-D-HNZJI-07A-1301-AF02-M-FW-01'
          }
        ]
      }
    }
  }
)

// 热力视图数据
Mock.mock('/mock/monitor/largeScreen/resourcePoolTemp', 'get', (data) => {
  return require('./json/bigScreen/temperatureComp/resourcePoolTemp.json')
})
Mock.mock('/mock/monitor/largeScreen/resourcePoolAzTemp', 'post', (data) => {
  return require('./json/bigScreen/temperatureComp/resourcePoolAzTemp.json')
})
// 热力视图画布数据
Mock.mock('/mock/monitor/largeScreen/getCanvasData', 'post', (data) => {
  const result = {
    code: 0,
    msg: '操作成功',
    data: {
      nodes: [],
      edges: [],
      table: [
        {
          name: 'NFV-D-HNGZ-06A-2403-AH03-M-SRV-01',
          temperature: 20,
          status: '正常'
        },
        {
          name: 'NFV-D-HNGZ-06A-2403-AH03-M-SRV-02',
          temperature: 0,
          status: '正常'
        },
        {
          name: 'NFV-D-HNGZ-06A-2403-AH03-M-SRV-03',
          temperature: 21,
          status: '正常'
        },
        {
          name: 'NFV-D-HNGZ-06A-2403-AH03-M-SRV-04',
          temperature: 21,
          status: '正常'
        },
        {
          name: 'NFV-D-HNGZ-06A-2403-AH03-M-SRV-05',
          temperature: 23,
          status: '正常'
        },
        {
          name: 'NFV-D-HNGZ-06A-2403-AH04-M-SRV-01',
          temperature: 21,
          status: '正常'
        },
        {
          name: 'NFV-D-HNGZ-06A-2403-AH04-M-SRV-02',
          temperature: 21,
          status: '正常'
        },
        {
          name: 'NFV-D-HNGZ-06A-2403-AH04-M-SRV-03',
          temperature: 22,
          status: '正常'
        },
        {
          name: 'NFV-D-HNGZ-06A-2403-AH04-M-SRV-04',
          temperature: 20,
          status: '正常'
        },
        {
          name: 'NFV-D-HNGZ-06A-2403-AH04-M-SRV-05',
          temperature: 21,
          status: '正常'
        }
      ]
    }
  }
  const sum = 100
  for (let i = 1; i <= sum; i++) {
    result.data.nodes.push({
      id: `node${i}`,
      label: `NFV-D-HNGZ-06A-2403-AH04-M-SRV-0${i}`
    })
  }

  for (let i = 2; i <= sum; i++) {
    result.data.edges.push({
      source: 'node1',
      target: `node${i}`
    })
  }
  console.log(result)
  return result
})
Mock.mock(
  '/mock/monitor/largeScreen/resourcePoolModulesTemp',
  'post',
  (data) => {
    return require('./json/bigScreen/temperatureComp/resourcePoolModulesTemp.json')
  }
)

// 流量视图
Mock.mock('/mock/monitor/largeScreenPortView/getViewById', 'get', (data) => {
  return require('./json/bigScreen/flowComp/graphList.json')
})

Mock.mock('/mock/monitor/largeScreenPortView/getPortData', 'post', (data) => {
  const ls = JSON.parse(data.body).length
  const result = []
  // 生成随机数保留两位随机数
  const random = (min, max) => {
    return Math.floor((Math.random() * (max - min) + min) * 100) / 10
  }
  // {
  //   id: JSON.parse(data.body)[`${'0|+1'}`].id,
  //   source: 'NFV-D-HNGZ-01A-2302-AD12-S-EOR-01',
  //   target: 'NFV-D-HNGZ-01A-2302-AD12-S-EOR-01',
  //   sourcePort: '40GE5/0/4',
  //   targetPort: '40GE5/0/4',
  //   sourcePortData: 435.63,
  //   targetPortData: 597.37,
  //   bandwidth: '40GE',
  //   dataProportion: 9.14,
  //   dataUnit: 'MB/s'
  // }
  for (let i = 0; i < ls; i++) {
    result.push({
      id: JSON.parse(data.body)[i].id,
      source: JSON.parse(data.body)[i].source,
      target: JSON.parse(data.body)[i].target,
      sourcePort: JSON.parse(data.body)[i].sourcePort,
      targetPort: JSON.parse(data.body)[i].targetPort,
      // 'sourcePortData|10-1000.2': 1, // 这样不行，因为自己用了数据处理，不算是mock的格式，只能自己写一个随机了
      sourcePortData: random(10, 1000),
      targetPortData: random(10, 1000),
      bandwidth: '40GE',
      dataProportion: random(1, 10),
      dataUnit: 'MB/s'
    })
  }
  return {
    code: 0,
    msg: '操作成功',
    data: result
  }
})
// 获取所有大屏
Mock.mock('/mock/monitor/largeScreenPortView/getViewName', 'get', (data) => {
  return {
    code: 0,
    msg: '操作成功',
    data: ['广州DMZ', '广州可信1']
  }
})

Mock.mock(
  /\/mock\/monitor\/largeScreenPortView\/getViewByViewName\?*/,
  'get',
  (data) => {
    return require('./json/bigScreen/flowComp/getViewByResourcePool.json')
  }
)
// 图类型
Mock.mock(
  '/mock/monitor/largeScreenPortView/getViewTypeOrViewName',
  'get',
  (data) => {
    return {
      code: 0,
      msg: '操作成功',
      data: ['大屏', 'largeScreen']
    }
  }
)
// 图名称
Mock.mock(
  /\/mock\/monitor\/largeScreenPortView\/getViewTypeOrViewName\?viewType=*/,
  'get',
  (data) => {
    return {
      code: 0,
      msg: '操作成功',
      data: ['广州DMZ', '广州可信1']
    }
  }
)
Mock.mock('http://localhost/graphList', 'get', (data) => {
  return require('./json/bigScreen/flowComp/graphList.json')
})

// 流量视图管理保存接口
Mock.mock('/mock/monitor/largeScreenPortView/saveOrUpdate', 'post', (data) => {
  return {
    code: 0,
    msg: '操作成功',
    data: ''
  }
})
// 流量视图管理删除接口
Mock.mock('/mock/monitor/largeScreenPortView/delete', 'delete', (data) => {
  return {
    code: 0,
    msg: '操作成功',
    data: ''
  }
})
// 流量视图获取设备名称
Mock.mock(
  '/mock/monitor/largeScreenPortView/getHostNameList?resourcePool=NFV-RP-HNGZ-00A&device=LB',
  'get',
  (data) => {
    return {
      code: 0,
      msg: '操作成功',
      data: ['GDGZ-NETCN00-CE01-ZTEM60008S', 'GDGZ-NETCN00-CE02-ZTEM60008S']
    }
  }
)
// 流量视图获取端口
Mock.mock(
  '/mock/monitor/largeScreenPortView/getPortsByHostName?hostName=GDGZ-NETCN00-CE01-ZTEM60008S',
  'get',
  (data) => {
    return {
      code: 0,
      msg: '操作成功',
      data: [
        'cgei-0/2/0/1',
        'cgei-0/2/0/1.1100',
        'cgei-0/2/0/1.1207',
        'cgei-0/2/0/1.1208',
        'cgei-0/2/0/1.1400',
        'cgei-0/2/0/1.4018',
        'cgei-0/2/0/1.4020',
        'cgei-0/2/0/1.412',
        'cgei-0/2/0/1.413',
        'cgei-0/2/0/1.414',
        'cgei-0/2/0/1.421',
        'cgei-0/2/0/1.423',
        'cgei-0/2/0/1.425',
        'cgei-0/2/0/1.612',
        'cgei-0/2/0/1.615',
        'cgei-0/2/0/1.616',
        'cgei-0/2/0/1.699',
        'cgei-0/2/0/1.816',
        'cgei-0/2/0/1.990',
        'cgei-0/2/0/1.991',
        'cgei-0/2/0/2',
        'cgei-0/2/1/1',
        'cgei-0/2/1/2',
        'cgei-0/3/0/1',
        'cgei-0/3/0/2',
        'cgei-0/3/1/1',
        'cgei-0/3/1/2',
        'gei-0/1/0/1',
        'mgmt_eth',
        'null1',
        'qx1',
        'qx_eth-0/10/0/1',
        'qx_eth-0/11/0/1',
        'spi-0/0/0/1',
        'spi-0/0/0/2',
        'spi-0/1/0/1',
        'spi-0/1/0/2',
        'spi-0/2/0/1',
        'spi-0/2/0/2',
        'spi-0/2/0/3',
        'spi-0/2/0/4',
        'spi-0/3/0/1',
        'spi-0/3/0/2',
        'spi-0/3/0/3',
        'spi-0/3/0/4',
        'xgei-0/0/0/1',
        'xgei-0/0/0/10',
        'xgei-0/0/0/2',
        'xgei-0/0/0/3',
        'xgei-0/0/0/4',
        'xgei-0/0/0/5',
        'xgei-0/0/0/6',
        'xgei-0/0/0/7',
        'xgei-0/0/0/8',
        'xgei-0/0/0/9',
        'xgei-0/1/0/10',
        'xgei-0/1/0/2',
        'xgei-0/1/0/3',
        'xgei-0/1/0/4',
        'xgei-0/1/0/5',
        'xgei-0/1/0/6',
        'xgei-0/1/0/7',
        'xgei-0/1/0/8',
        'xgei-0/1/0/9'
      ]
    }
  }
)
Mock.mock(
  /\/mock\/monitor\/largeScreenPortView\/getViewByViewNameAndViewType\?viewName=*/,
  'get',
  (data) => {
    return require('./json/bigScreen/flowComp/getViewByResourcePool.json')
  }
)

Mock.mock('/mock/monitor/largeScreen/Gedge', 'post', (data) => {
  if (JSON.parse(data.body).device === 'EOR') {
    return {
      code: 0,
      msg: '操作成功',
      data: [
        'NFV-D-HNGZ-00A-2501-AD16-M-EOR-01',
        'NFV-D-HNGZ-00A-2501-AE16-M-EOR-02'
      ]
    }
  } else if (JSON.parse(data.body).device === 'FW') {
    return {
      code: 0,
      msg: '操作成功',
      data: [
        'NFV-D-HNGZ-00A-2501-AD10-M-FW-01',
        'NFV-D-HNGZ-00A-2501-AD10-M-FW-02'
      ]
    }
  } else if (JSON.parse(data.body).device === 'CE') {
    return {
      code: 0,
      msg: '操作成功',
      data: ['GDGZ-NETNMS-CE01-HWNE40EX16A', 'GDGZ-NETNMS-CE01-HWNE40EX17A']
    }
  } else if (JSON.parse(data.body).device === 'LB') {
    return {
      code: 0,
      msg: '操作成功',
      data: [
        'NFV-D-HNGZ-00A-2501-AE17-S-LB-04',
        'NFV-D-HNGZ-00A-2501-AE17-S-LB-05',
        'NFV-D-HNGZ-00A-2501-AE17-S-LB-03',
        'NFV-D-HNGZ-00A-2501-AE17-S-LB-02',
        'NFV-D-HNGZ-00A-2501-AE17-S-LB-01'
      ]
    }
  } else if (JSON.parse(data.body).device === 'DCGW') {
    return {
      code: 0,
      msg: '操作成功',
      data: [
        'NFV-D-HNGZ-00A-2501-AD13-E-RT-01',
        'NFV-D-HNGZ-00A-2501-AE13-E-RT-02',
        'NFV-D-HNGZ-00A-2501-AE13-E-RT-03',
        'NFV-D-HNGZ-00A-2501-AE13-E-RT-04'
      ]
    }
  }
})

Mock.mock(
  '/mock/modserver/mod/62426691420693003a695aac?user_id=10001&operation_type=look',
  'get',
  (data) => {
    return require('./json/62426691420693003a695aac.json')
  }
)

Mock.mock(
  '/mock/modserver/mod/630474d49e1bff005763c6cd?user_id=10001&operation_type=look',
  'get',
  (data) => {
    return require('./json/630474d49e1bff005763c6cd.json')
  }
)

Mock.mock(
  '/mock/modserver/mod/639850229d656d005b903383?user_id=10001&operation_type=look',
  'get',
  (data) => {
    return require('./json/639850229d656d005b903383.json')
  }
)

Mock.mock(
  '/mock/modserver/mod/6344e8641adee1003b8e953a?user_id=10001&operation_type=look',
  'get',
  (data) => {
    return require('./json/6344e8641adee1003b8e953a.json')
  }
)

Mock.mock(
  '/mock/modserver/mod?page=1&page_size=200&user_id=10001&operation_type=look',
  'get',
  (data) => {
    return require('./json/mod_list.json')
  }
)

Mock.mock(
  '/mock/modserver/service?page=1&page_size=400&user_id=10001&operation_type=use',
  'get',
  (data) => {
    return require('./json/service_list.json')
  }
)

// 机房概览
Mock.mock(
  '/mock/cloundcmdb/api/v1/machine_rooms/machine_rooms',
  'get',
  (data) => {
    return require('./json/machine_rooms.json')
  }
)

// 计算模块数据
Mock.mock(
  '/mock/cloundcmdb/api/v1/machine_rooms/module_detail?id=121',
  'get',
  (data) => {
    return {
      code: 0,
      message: '操作成功',
      data: {
        equipment_cabinets: [
          {
            name: '机柜名01',
            hardware_partition: '所属硬件分区A',
            network_devices: ['网络设备1', '网络设备2'],
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16'
            ],
            storage_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          },
          {
            name: '机柜名021',
            hardware_partition: '所属硬件分区B',
            network_devices: ['网络设备1', '网络设备2'],
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],
            storage_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          },
          {
            name: '机柜名022',
            hardware_partition: '所属硬件分区B',
            network_devices: ['网络设备1', '网络设备2'],
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],
            storage_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          },
          {
            name: '机柜名023',
            hardware_partition: '所属硬件分区B',
            network_devices: ['网络设备1', '网络设备2'],
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],
            storage_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          },
          {
            name: '机柜名024',
            hardware_partition: '所属硬件分区B',
            network_devices: ['网络设备1', '网络设备2'],
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],
            storage_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          },
          {
            name: '机柜名025',
            hardware_partition: '所属硬件分区B',
            network_devices: ['网络设备1', '网络设备2'],
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],
            storage_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          },
          {
            name: '机柜名026',
            hardware_partition: '所属硬件分区B',
            network_devices: ['网络设备1', '网络设备2'],
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],
            storage_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          },
          {
            name: '机柜名027',
            hardware_partition: '所属硬件分区B',
            network_devices: ['网络设备1', '网络设备2'],
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],
            storage_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          },
          {
            name: '机柜名028',
            hardware_partition: '所属硬件分区B',
            network_devices: ['网络设备1', '网络设备2'],
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],
            storage_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          },
          {
            name: '机柜名029',
            hardware_partition: '所属硬件分区B',
            network_devices: ['网络设备1', '网络设备2'],
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],
            storage_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          },
          {
            name: '机柜名0210',
            hardware_partition: '所属硬件分区B',
            network_devices: ['网络设备1', '网络设备2'],
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],
            storage_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          }
        ],
        has: [
          {
            name: '主机组名称01',
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],
            storage_cluster: 'NFV-DS-HNGZ-00A-HW-01',
            storage_pools: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],
            storage_servers: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          },
          {
            name: '主机组名称02',
            computer_devices: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ],

            storage_cluster: 'NFV-DS-HNGZ-00A-HW-01',
            storage_pools: [
              'NFV-DSP-HNGZ-00A-HW-01-TRU-02',
              'NFV-DSP-HNGZ-00A-HW-01-TRU-03',
              'NFV-DSP-HNGZ-00A-HW-01-TRU-04',
              'NFV-DSP-HNGZ-00A-HW-01-TRU-05'
            ],
            storage_servers: [
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-15',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-16',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-17',
              'NFV-D-HNGZ-00A-2501-AFO3-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-18',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-19',
              'NFV-D-HNGZ-00A-2501-AFO1-S-SRV-21',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-20',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-22',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-23',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-24',
              'NFV-D-HNGZ-00A-2501-AFO2-S-SRV-25'
            ]
          }
        ]
      }
    }
  }
)

// cmdb界面分析api数据
Mock.mock(
  '/mock/cloundcmdb/api/v1/cmdb_log/models/?dimension=hour&begin_time=2023-06-01&end_time=2023-06-02',
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: {
        mv_rank: [
          { model: 'HARDWARE', total: 79 },
          { model: 'MACHINE_ROOM', total: 32 },
          { model: 'HA', total: 22 },
          { model: 'VNF', total: 16 },
          { model: 'MANAGEMENT_SYSTEM', total: 10 },
          { model: 'HAS', total: 5 },
          { model: 'PRIVATE_VNFBUSINESS_IP_T', total: 2 },
          { model: 'PRIVATE_GW_IP_T', total: 1 }
        ],
        fail_mv_rank: [
          { model: 'HARDWARE', total: 5 },
          { model: 'HA', total: 2 },
          { model: 'HAS', total: 2 },
          { model: 'VNF', total: 2 },
          { model: 'MACHINE_ROOM', total: 1 },
          { model: 'PRIVATE_VNFBUSINESS_IP_T', total: 1 }
        ],
        detail: [
          { time: '2023-06-01T15:00:00', total: 25, model: 'MACHINE_ROOM' },
          {
            time: '2023-06-01T15:00:00',
            total: 2,
            model: 'PRIVATE_VNFBUSINESS_IP_T'
          },
          { time: '2023-06-01T16:00:00', total: 27, model: 'HARDWARE' },
          { time: '2023-06-01T16:00:00', total: 8, model: 'MACHINE_ROOM' },
          {
            time: '2023-06-01T16:00:00',
            total: 10,
            model: 'MANAGEMENT_SYSTEM'
          },
          { time: '2023-06-01T16:00:00', total: 1, model: 'PRIVATE_GW_IP_T' },
          {
            time: '2023-06-01T16:00:00',
            total: 1,
            model: 'PRIVATE_VNFBUSINESS_IP_T'
          },
          { time: '2023-06-01T16:00:00', total: 18, model: 'VNF' },
          { time: '2023-06-01T17:00:00', total: 24, model: 'HA' },
          { time: '2023-06-01T17:00:00', total: 57, model: 'HARDWARE' },
          { time: '2023-06-01T17:00:00', total: 7, model: 'HAS' }
        ]
      }
    }
  }
)
Mock.mock(
  '/mock/cloundcmdb/api/v1/cmdb_log/visit_analyse/?dimension=hour&begin_time=2023-06-01&end_time=2023-06-02',
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: {
        collect: { total: 180, fail: 13, avail_rate: 0.93 },
        detail: [
          { time: '2023-06-01T15:00:00', total: 27, success: 25, fail: 2 },
          { time: '2023-06-01T16:00:00', total: 65, success: 60, fail: 5 },
          { time: '2023-06-01T17:00:00', total: 88, success: 82, fail: 6 }
        ]
      }
    }
  }
)
Mock.mock(
  '/mock/cloundcmdb/api/v1/cmdb_log/models/?dimension=hour&begin_time=2023-06-01&end_time=2023-06-02&model=HA',
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: [{ time: '2023-06-01T17:00:00', total: 24, success: 22, fail: 2 }]
    }
  }
)
Mock.mock(
  '/mock/cloundcmdb/api/v1/cmdb_log/single_model/?dimension=hour&begin_time=2023-06-01&end_time=2023-06-02&model=MACHINE_ROOM',
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: [{ time: '2023-06-01', total: 24, success: 22, fail: 2 }]
    }
  }
)
Mock.mock(
  '/mock/cloundcmdb/api/v1/cmdb_log/open_api_user/?dimension=hour&begin_time=2023-06-01&end_time=2023-06-02',
  'get',
  (data) => {
    return require('./json/openUserAPI.json')
  }
)
// 字典数据mock

Mock.mock(
  '/mock/cloundcmdb/api/v1/config/config/?param_name=model_chname_dict',
  'get',
  (data) => {
    return require('./json/model_chname_dict.json')
  }
)

Mock.mock(
  '/mock/cloundcmdb/api/v1/config/config/?param_name=user_chname_dict',
  'get',
  (data) => {
    return require('./json/user_chname_dict.json')
  }
)

// 消费api数据mock
Mock.mock(
  '/mock/cloundcmdb/api/v1/cmdb_log/open_api/?dimension=day&begin_time=2023-06-08&end_time=2023-06-09',
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: {
        open_api: {
          total: 11958,
          fail: 531,
          avail_rate: 0.96,
          detail: [
            { time: '2023-06-08', total: 8058, model: 3334, path: 4724 },
            { time: '2023-06-09', total: 3900, model: 2062, path: 1838 }
          ]
        },
        path_api: {
          total: 6562,
          fail: 433,
          avail_rate: 0.93,
          detail: [
            { time: '2023-06-08', total: 4724, success: 4447, fail: 277 },
            { time: '2023-06-09', total: 1838, success: 1682, fail: 156 }
          ]
        },
        model_api: {
          total: 5396,
          fail: 98,
          avail_rate: 0.98,
          detail: [
            { time: '2023-06-08', total: 3334, success: 3265, fail: 69 },
            { time: '2023-06-09', total: 2062, success: 2033, fail: 29 }
          ]
        }
      }
    }
  }
)
Mock.mock(
  '/mock/cloundcmdb/api/v1/cmdb_log/open_api_user/?dimension=day&begin_time=2023-06-08&end_time=2023-06-09',
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: [
        { user: 'Modops', model_api: 23, path_api: 517 },
        { user: 'Modops', model_api: 2, path_api: 517 },
        { user: 'Modops', model_api: 1, path_api: 517 },
        { user: 'Modops', model_api: 1, path_api: 517 },
        { user: 'Modops', model_api: 9, path_api: 517 },
        { user: 'Modops', model_api: 2, path_api: 517 },
        { user: 'Modops', model_api: 108, path_api: 517 },
        { user: 'Modops', model_api: 2, path_api: 517 },
        { user: 'Modops', model_api: 1, path_api: 517 },
        { user: 'Modops', model_api: 2, path_api: 517 },
        { user: 'Modops', model_api: 1, path_api: 517 },
        { user: 'Modops', model_api: 1, path_api: 517 },
        { user: 'Modops', model_api: 1, path_api: 517 },
        { user: 'Modops', model_api: 2, path_api: 517 },
        { user: 'Modops', model_api: 2, path_api: 517 },
        { user: 'Modops', model_api: 8, path_api: 517 },
        { user: 'Modops', model_api: 8, path_api: 517 },
        { user: 'Modops', model_api: 2, path_api: 517 },
        { user: 'Modops', model_api: 2, path_api: 517 },
        { user: 'Modops', model_api: 159, path_api: 517 },
        { user: 'Modops', model_api: 79, path_api: 517 },
        { user: 'Modops', model_api: 2, path_api: 517 },
        { user: 'Rmc', model_api: 19, path_api: 0 },
        { user: 'Rmc', model_api: 3, path_api: 0 },
        { user: 'Rmc', model_api: 96, path_api: 0 },
        { user: 'Rmc', model_api: 17, path_api: 0 },
        { user: 'Rmc', model_api: 1, path_api: 0 },
        { user: 'Rmc', model_api: 372, path_api: 0 },
        { user: 'Rmc', model_api: 225, path_api: 0 },
        { user: 'business_butler', model_api: 2, path_api: 1276 },
        { user: 'business_butler', model_api: 450, path_api: 1276 },
        { user: 'business_butler', model_api: 4, path_api: 1276 },
        { user: 'business_butler', model_api: 17, path_api: 1276 },
        { user: 'business_butler', model_api: 3, path_api: 1276 },
        { user: 'business_butler', model_api: 12, path_api: 1276 },
        { user: 'business_butler', model_api: 3, path_api: 1276 },
        { user: 'business_butler', model_api: 2, path_api: 1276 },
        { user: 'business_butler', model_api: 4, path_api: 1276 },
        { user: 'business_butler', model_api: 4, path_api: 1276 },
        { user: 'business_butler', model_api: 4, path_api: 1276 },
        { user: 'business_butler', model_api: 3, path_api: 1276 },
        { user: 'business_butler', model_api: 3, path_api: 1276 },
        { user: 'business_butler', model_api: 16, path_api: 1276 },
        { user: 'business_butler', model_api: 2, path_api: 1276 },
        { user: 'business_butler', model_api: 6, path_api: 1276 },
        { user: 'business_butler', model_api: 26, path_api: 1276 },
        { user: 'business_butler', model_api: 95, path_api: 1276 },
        { user: 'business_butler', model_api: 41, path_api: 1276 },
        { user: 'business_butler', model_api: 9, path_api: 1276 },
        { user: 'business_butler', model_api: 2, path_api: 1276 },
        { user: 'business_butler', model_api: 1804, path_api: 1276 },
        { user: 'business_butler', model_api: 391, path_api: 1276 },
        { user: 'business_butler', model_api: 960, path_api: 1276 },
        { user: 'business_butler', model_api: 3, path_api: 1276 },
        { user: 'navi-framework', model_api: 9, path_api: 104 },
        { user: 'navi-framework', model_api: 13, path_api: 104 },
        { user: 'navi-framework', model_api: 7, path_api: 104 },
        { user: 'navi-framework', model_api: 120, path_api: 104 },
        { user: 'navi-framework', model_api: 2, path_api: 104 },
        { user: 'navi-framework', model_api: 1, path_api: 104 },
        { user: 'navi-framework', model_api: 10, path_api: 104 },
        { user: 'navi-framework', model_api: 51, path_api: 104 },
        { user: 'navi-framework', model_api: 3, path_api: 104 },
        { user: 'network_butler', model_api: 16, path_api: 160 },
        { user: 'network_butler', model_api: 1, path_api: 160 },
        { user: 'network_butler', model_api: 30, path_api: 160 },
        { user: 'network_butler', model_api: 2, path_api: 160 },
        { user: 'network_butler', model_api: 1, path_api: 160 },
        { user: 'network_butler', model_api: 84, path_api: 160 },
        { user: 'nfvi_kpi_configurable', model_api: 16, path_api: 4284 },
        { user: 'nfvi_kpi_configurable', model_api: 12, path_api: 4284 },
        { user: 'nfvi_kpi_configurable', model_api: 1, path_api: 4284 },
        { user: 'WatchingGo', model_api: 0, path_api: 221 }
      ]
    }
  }
)
Mock.mock(
  '/mock/cloundcmdb/api/v1/cmdb_log/user_path_api/?dimension=day&begin_time=2023-06-08&end_time=2023-06-09&user=Modops',
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: [
        { fail: 0, time: '2023-06-08', total: 495, success: 495 },
        { fail: 0, time: '2023-06-09', total: 22, success: 22 }
      ]
    }
  }
)

Mock.mock(
  '/mock/cloundcmdb/api/v1/cmdb_log/user_model_detail/?dimension=day&begin_time=2023-06-08&end_time=2023-06-09',
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: [
        {
          name: 'navi-framework',
          value: 216,
          children: [
            {
              name: 'PUBLIC_CMNET_IP',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'COMPUTER_SERVER',
              value: 9,
              children: [
                { name: 'success', value: 9 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'DISTRIBUTED_STORAGE_CLUSTER',
              value: 13,
              children: [
                { name: 'fail', value: 13 },
                { name: 'success', value: 0 }
              ]
            },
            {
              name: 'STORAGE_SERVER',
              value: 10,
              children: [
                { name: 'success', value: 10 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'PORT',
              value: 120,
              children: [
                { name: 'success', value: 120 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'ROUTER',
              value: 1,
              children: [
                { name: 'success', value: 1 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'VNF',
              value: 3,
              children: [
                { name: 'success', value: 3 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'SWITCH',
              value: 51,
              children: [
                { name: 'success', value: 51 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'HARDWARE',
              value: 7,
              children: [
                { name: 'success', value: 7 },
                { name: 'fail', value: 0 }
              ]
            }
          ]
        },
        {
          name: 'business_butler',
          value: 3866,
          children: [
            {
              name: 'FIREWALL_INFO',
              value: 3,
              children: [
                { name: 'success', value: 3 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'PLAN_MGM_SYSTEM',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'AZ',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'VIRTUAL_RESOURCE_POOL',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'STORAGE_SERVER',
              value: 95,
              children: [
                { name: 'success', value: 95 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'NETWORK_ELEMENT',
              value: 16,
              children: [
                { name: 'success', value: 16 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'ROUTER',
              value: 26,
              children: [
                { name: 'success', value: 26 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'HA',
              value: 3,
              children: [
                { name: 'success', value: 3 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'VNF',
              value: 1804,
              children: [
                { name: 'fail', value: 14 },
                { name: 'success', value: 1790 }
              ]
            },
            {
              name: 'LB',
              value: 4,
              children: [
                { name: 'success', value: 4 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'VOLUME',
              value: 391,
              children: [
                { name: 'success', value: 391 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'VRITUAL_MACHINE',
              value: 960,
              children: [
                { name: 'fail', value: 18 },
                { name: 'success', value: 942 }
              ]
            },
            {
              name: 'VIM_TENANTS',
              value: 9,
              children: [
                { name: 'success', value: 9 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'IS',
              value: 4,
              children: [
                { name: 'success', value: 4 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'SWITCH',
              value: 41,
              children: [
                { name: 'success', value: 41 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'DISTRIBUTED_STORAGE_POOL',
              value: 17,
              children: [
                { name: 'success', value: 17 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'HARDWARE_RESOURCE_POOL',
              value: 4,
              children: [
                { name: 'success', value: 4 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'COMPUTER_SERVER',
              value: 450,
              children: [
                { name: 'success', value: 450 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'HARDWARE_PARTITION',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'FRAME',
              value: 12,
              children: [
                { name: 'success', value: 12 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'MACHINE_ROOM',
              value: 3,
              children: [
                { name: 'success', value: 3 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'PLAN_VNF',
              value: 6,
              children: [
                { name: 'success', value: 6 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'DDOS',
              value: 4,
              children: [
                { name: 'success', value: 4 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'MANAGEMENT_SYSTEM',
              value: 3,
              children: [
                { name: 'success', value: 3 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'WAF',
              value: 3,
              children: [
                { name: 'success', value: 3 },
                { name: 'fail', value: 0 }
              ]
            }
          ]
        },
        {
          name: 'Rmc',
          value: 733,
          children: [
            {
              name: 'VIM_TENANTS',
              value: 17,
              children: [
                { name: 'success', value: 17 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'NETWORK_INTERFACE_CARD',
              value: 96,
              children: [
                { name: 'fail', value: 6 },
                { name: 'success', value: 90 }
              ]
            },
            {
              name: 'HA',
              value: 19,
              children: [
                { name: 'success', value: 19 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'VNF',
              value: 1,
              children: [
                { name: 'success', value: 1 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'MANAGEMENT_SYSTEM',
              value: 3,
              children: [
                { name: 'success', value: 3 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'VOLUME',
              value: 372,
              children: [
                { name: 'fail', value: 16 },
                { name: 'success', value: 356 }
              ]
            },
            {
              name: 'VRITUAL_MACHINE',
              value: 225,
              children: [
                { name: 'success', value: 225 },
                { name: 'fail', value: 0 }
              ]
            }
          ]
        },
        {
          name: 'nfvi_kpi_configurable',
          value: 29,
          children: [
            {
              name: 'COMPUTER_SERVER',
              value: 16,
              children: [
                { name: 'fail', value: 1 },
                { name: 'success', value: 15 }
              ]
            },
            {
              name: 'SWITCH',
              value: 1,
              children: [
                { name: 'success', value: 1 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'HARDWARE_RESOURCE_POOL',
              value: 12,
              children: [
                { name: 'success', value: 12 },
                { name: 'fail', value: 0 }
              ]
            }
          ]
        },
        {
          name: 'network_butler',
          value: 134,
          children: [
            {
              name: 'COMPUTER_SERVER',
              value: 16,
              children: [
                { name: 'success', value: 16 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'HARDWARE_RESOURCE_POOL',
              value: 1,
              children: [
                { name: 'success', value: 1 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'PRIVATE_GW_IP_T',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'INTERFACE',
              value: 30,
              children: [
                { name: 'fail', value: 30 },
                { name: 'success', value: 0 }
              ]
            },
            {
              name: 'VLAN_T',
              value: 1,
              children: [
                { name: 'success', value: 1 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'VRITUAL_MACHINE',
              value: 84,
              children: [
                { name: 'success', value: 84 },
                { name: 'fail', value: 0 }
              ]
            }
          ]
        },
        {
          name: 'Modops',
          value: 418,
          children: [
            {
              name: 'FIREWALL_INFO',
              value: 1,
              children: [
                { name: 'success', value: 1 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'PLAN_MGM_SYSTEM',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'VIRTUAL_RESOURCE_POOL',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'STORAGE_SERVER',
              value: 8,
              children: [
                { name: 'success', value: 8 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'NETWORK_ELEMENT',
              value: 1,
              children: [
                { name: 'success', value: 1 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'ROUTER',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'HA',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'VNF',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'LB',
              value: 1,
              children: [
                { name: 'success', value: 1 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'VOLUME',
              value: 159,
              children: [
                { name: 'success', value: 159 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'VRITUAL_MACHINE',
              value: 79,
              children: [
                { name: 'success', value: 79 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'IS',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'SWITCH',
              value: 8,
              children: [
                { name: 'success', value: 8 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'DISTRIBUTED_STORAGE_POOL',
              value: 1,
              children: [
                { name: 'success', value: 1 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'HARDWARE',
              value: 108,
              children: [
                { name: 'success', value: 108 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'COMPUTER_SERVER',
              value: 23,
              children: [
                { name: 'success', value: 23 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'HARDWARE_RESOURCE_POOL',
              value: 1,
              children: [
                { name: 'success', value: 1 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'HARDWARE_PARTITION',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'FRAME',
              value: 9,
              children: [
                { name: 'success', value: 9 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'DDOS',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'MANAGEMENT_SYSTEM',
              value: 1,
              children: [
                { name: 'success', value: 1 },
                { name: 'fail', value: 0 }
              ]
            },
            {
              name: 'WAF',
              value: 2,
              children: [
                { name: 'success', value: 2 },
                { name: 'fail', value: 0 }
              ]
            }
          ]
        }
      ]
    }
  }
)
Mock.mock(
  '/mock/cloundcmdb/api/v1/cmdb_log/model_rank/?dimension=day&begin_time=2023-06-08&end_time=2023-06-09',
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: [
        { model: 'VNF', total: 1810 },
        { model: 'VRITUAL_MACHINE', total: 1348 },
        { model: 'VOLUME', total: 922 },
        { model: 'COMPUTER_SERVER', total: 514 },
        { model: 'PORT', total: 120 },
        { model: 'HARDWARE', total: 115 },
        { model: 'STORAGE_SERVER', total: 113 },
        { model: 'SWITCH', total: 101 },
        { model: 'NETWORK_INTERFACE_CARD', total: 96 },
        { model: 'INTERFACE', total: 30 },
        { model: 'ROUTER', total: 29 },
        { model: 'VIM_TENANTS', total: 26 },
        { model: 'HA', total: 24 },
        { model: 'FRAME', total: 21 },
        { model: 'HARDWARE_RESOURCE_POOL', total: 18 },
        { model: 'DISTRIBUTED_STORAGE_POOL', total: 18 },
        { model: 'NETWORK_ELEMENT', total: 17 },
        { model: 'DISTRIBUTED_STORAGE_CLUSTER', total: 13 },
        { model: 'MANAGEMENT_SYSTEM', total: 7 },
        { model: 'IS', total: 6 },
        { model: 'PLAN_VNF', total: 6 },
        { model: 'DDOS', total: 6 },
        { model: 'WAF', total: 5 },
        { model: 'LB', total: 5 },
        { model: 'PLAN_MGM_SYSTEM', total: 4 },
        { model: 'VIRTUAL_RESOURCE_POOL', total: 4 },
        { model: 'HARDWARE_PARTITION', total: 4 },
        { model: 'FIREWALL_INFO', total: 4 },
        { model: 'MACHINE_ROOM', total: 3 },
        { model: 'PUBLIC_CMNET_IP', total: 2 },
        { model: 'PRIVATE_GW_IP_T', total: 2 },
        { model: 'AZ', total: 2 },
        { model: 'VLAN_T', total: 1 }
      ]
    }
  }
)
Mock.mock(
  '/mock/cloundcmdb/api/v1/cmdb_log/user_model_api/?dimension=day&begin_time=2023-06-08&end_time=2023-06-09&user=Modops',
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: [
        { fail: 0, time: '2023-06-08', total: 313, success: 313 },
        { fail: 0, time: '2023-06-09', total: 105, success: 105 }
      ]
    }
  }
)
// 网络资源管理-公网CMNET_IP
Mock.mock(
  '/mock/cmdbNew/cmdb_resource/object/PUBLIC_CMNET_IP/instance/_search',
  'post',
  (data) => {
    return require('./json/search.json')
  }
)

// 模型检查项详情
Mock.mock(
  '/mock/cloundcmdb/api/v1/compliance_check/pools_infos/',
  'get',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: [
        { name: '可信资源池2', label: 'NFV-RP-HNGZ-02A' },
        { name: '可信资源池3', label: 'NFV-RP-HNGZ-03A' },
        { name: 'DMZ资源池', label: 'NFV-RP-HNGZ-00A' },
        { name: '可信资源池4', label: 'NFV-RP-HNGZ-04A' },
        { name: '可信资源池1', label: 'NFV-RP-HNGZ-01A' },
        { name: '可信资源池5', label: 'NFV-RP-HNGZ-05A' },
        { name: '网管资源池', label: 'NFV-RP-HNGZ-09A' },
        { name: '可信资源池7', label: 'NFV-RP-HNGZ-07A' },
        { name: '可信资源池8', label: 'NFV-RP-HNGZ-08A' },
        { name: '可信资源池6', label: 'NFV-RP-HNGZ-06A' },
        { name: '湛江可信2', label: 'NFV-RP-HNZJI-02A' },
        { name: '湛江可信3', label: 'NFV-RP-HNZJI-03A' },
        { name: '湛江可信1', label: 'NFV-RP-HNZJI-01A' },
        { name: '湛江DMZ', label: 'NFV-RP-HNZJI-00A' },
        { name: '广州新建资源池11', label: 'NFV-RP-HNGZ-11A' },
        { name: '湛江可信6', label: 'NFV-RP-HNZJI-06A' },
        { name: '未查询到资源池', label: 'pool-tag-none' }
      ]
    }
  }
)
Mock.mock(
  '/mock/cloundcmdb/api/v1/compliance_check/cmdb_violation_data/',
  'post',
  (data) => {
    return {
      code: 0,
      message: 'success',
      data: [
        {
          model_name: 'HA',
          model_total: [
            190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190, 190,
            190, 190, 190, 190, 190, 190, 190, 190, 190
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
          ],
          check_data: [
            {
              check_id: 'HA_1',
              check_name: 'HA异常',
              check_desc: '当HA所属AZ为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153,
                153, 153, 153, 153, 153, 153, 153, 153, 153
              ]
            }
          ]
        },
        {
          model_name: 'WAF',
          model_total: [
            12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
            12, 12, 12, 12, 12
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.3333333333333333, 0.3333333333333333, 0.3333333333333333,
            0.3333333333333333, 0.3333333333333333, 0.3333333333333333,
            0.3333333333333333, 0.3333333333333333, 0.3333333333333333,
            0.3333333333333333, 0.3333333333333333, 0.3333333333333333,
            0.3333333333333333, 0.3333333333333333, 0.3333333333333333,
            0.3333333333333333, 0.3333333333333333, 0.3333333333333333,
            0.3333333333333333, 0.3333333333333333, 0.16666666666666666,
            0.16666666666666666
          ],
          check_data: [
            {
              check_id: 'WAF_1',
              check_name: 'WAF硬件分区异常',
              check_desc: 'WAF所属硬件分区为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
                0
              ],
              check_sum: [
                6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                6
              ]
            },
            {
              check_id: 'WAF_2',
              check_name: 'WAF机架异常',
              check_desc: 'WAF所在机架为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
                2
              ],
              check_sum: [
                6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                6
              ]
            }
          ]
        },
        {
          model_name: '机房',
          model_total: [
            26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
            26, 26, 26, 26, 26
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.038461538461538464, 0.038461538461538464, 0.038461538461538464,
            0.038461538461538464, 0.038461538461538464, 0.038461538461538464,
            0.038461538461538464, 0.038461538461538464, 0.038461538461538464,
            0.038461538461538464, 0.038461538461538464, 0.038461538461538464,
            0.038461538461538464, 0.038461538461538464, 0.038461538461538464,
            0.038461538461538464, 0.038461538461538464, 0.038461538461538464,
            0.038461538461538464, 0.038461538461538464, 0.038461538461538464,
            0.038461538461538464
          ],
          check_data: [
            {
              check_id: 'MACHINE_ROOM_1',
              check_name: '机房异常',
              check_desc: '当机房所属硬件资源池为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1
              ],
              check_sum: [
                26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
                26, 26, 26, 26, 26, 26
              ]
            }
          ]
        },
        {
          model_name: '硬件资源池',
          model_total: [
            23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
            23, 23, 23, 23, 23
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
          ],
          check_data: [
            {
              check_id: 'HARDWARE_RESOURCE_POOL_1',
              check_name: '硬件资源池异常',
              check_desc: '当硬件资源池所属资源池节点为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17,
                17, 17, 17, 17, 17, 17
              ]
            }
          ]
        },
        {
          model_name: 'DDOS',
          model_total: [
            26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
            26, 26, 26, 26, 26
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
          ],
          check_data: [
            {
              check_id: 'DDOS_1',
              check_name: 'DOSS硬件分区异常',
              check_desc: 'DDOS所属硬件分区为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
                18, 18, 18, 18, 18, 18
              ]
            },
            {
              check_id: 'DDOS_2',
              check_name: 'DOSS机架异常',
              check_desc: 'DDOS所在机架为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
                18, 18, 18, 18, 18, 18
              ]
            }
          ]
        },
        {
          model_name: '硬件分区',
          model_total: [
            60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60,
            60, 60, 60, 60, 60
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
          ],
          check_data: [
            {
              check_id: 'HARDWARE_PARTITION_1',
              check_name: '硬件分区异常',
              check_desc: '当硬件分区所属硬件资源池为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46,
                46, 46, 46, 46, 46, 46
              ]
            }
          ]
        },
        {
          model_name: '规划管理系统',
          model_total: [
            144, 144, 144, 144, 144, 144, 144, 144, 144, 144, 144, 144, 144,
            144, 144, 144, 144, 144, 144, 144, 144, 144
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
          ],
          check_data: [
            {
              check_id: 'PLAN_MGM_SYSTEM_1',
              check_name: '规划管理系统异常',
              check_desc: '关联管理系统为空时，则判断为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                144, 144, 144, 144, 144, 144, 144, 144, 144, 144, 144, 144, 144,
                144, 144, 144, 144, 144, 144, 144, 144, 144
              ],
              check_sum: [
                144, 144, 144, 144, 144, 144, 144, 144, 144, 144, 144, 144, 144,
                144, 144, 144, 144, 144, 144, 144, 144, 144
              ]
            }
          ]
        },
        {
          model_name: '网元',
          model_total: [
            895, 895, 895, 895, 895, 895, 895, 895, 895, 895, 895, 895, 895,
            895, 895, 895, 895, 895, 895, 895, 894, 894
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.00039824771007566706, 0.00039824771007566706,
            0.00039824771007566706, 0.00039824771007566706,
            0.00039824771007566706, 0.0007964954201513341,
            0.0007964954201513341, 0.0007964954201513341, 0.0011947431302270011,
            0.0011947431302270011, 0.0011947431302270011, 0.0011947431302270011,
            0.0011947431302270011, 0.0011947431302270011, 0.0011947431302270011,
            0.0011947431302270011, 0.0011947431302270011, 0.0011947431302270011,
            0.0011947431302270011, 0.0011947431302270011,
            0.00039872408293460925, 0.00039872408293460925
          ],
          check_data: [
            {
              check_id: 'NETWORK_ELEMENT_2',
              check_name: 'VIM租户为空',
              check_desc: '关联VIM租户不应为空，如果为空，需在备注里加以说明',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                0
              ],
              check_sum: [
                837, 837, 837, 837, 837, 837, 837, 837, 837, 837, 837, 837, 837,
                837, 837, 837, 837, 837, 837, 837, 836, 836
              ]
            },
            {
              check_id: 'NETWORK_ELEMENT_3',
              check_name: '规划网元为空',
              check_desc: '关联规划网元不应为空，如果为空，需在备注里加以说明',
              error_duration: 1,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1
              ],
              check_sum: [
                837, 837, 837, 837, 837, 837, 837, 837, 837, 837, 837, 837, 837,
                837, 837, 837, 837, 837, 837, 837, 836, 836
              ]
            },
            {
              check_id: 'NETWORK_ELEMENT_1',
              check_name: '包含VNF为空',
              check_desc: '当网元包含VNF为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                0
              ],
              check_sum: [
                837, 837, 837, 837, 837, 837, 837, 837, 837, 837, 837, 837, 837,
                837, 837, 837, 837, 837, 837, 837, 836, 836
              ]
            }
          ]
        },
        {
          model_name: '防火墙',
          model_total: [
            123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123,
            123, 123, 123, 123, 123, 123, 123, 123, 123
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
          ],
          check_data: [
            {
              check_id: 'FIREWALL_INFO_1',
              check_name: '型号异常',
              check_desc: '防火墙型号为空，则判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85,
                85, 85, 85, 85, 85, 85
              ]
            }
          ]
        },
        {
          model_name: 'AZ',
          model_total: [
            67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67,
            67, 67, 67, 67, 67
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
          ],
          check_data: [
            {
              check_id: 'AZ_1',
              check_name: 'AZ异常',
              check_desc: '当AZ所属虚拟资源池为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53,
                53, 53, 53, 53, 53, 53
              ]
            }
          ]
        },
        {
          model_name: '虚拟资源池',
          model_total: [
            25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
            25, 25, 25, 25, 25
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
          ],
          check_data: [
            {
              check_id: 'VIRTUAL_RESOURCE_POOL_1',
              check_name: '虚拟资源池异常',
              check_desc: '当虚拟资源池所属硬件资源池为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                19, 19, 19, 19, 19, 19
              ]
            }
          ]
        },
        {
          model_name: '管理系统',
          model_total: [
            386, 386, 386, 386, 386, 386, 386, 386, 386, 386, 386, 386, 386,
            386, 386, 386, 386, 388, 388, 388, 388, 388
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
          ],
          check_data: [
            {
              check_id: 'MANAGEMENT_SYSTEM_1',
              check_name: '管理系统异常',
              check_desc:
                '当管理系统包含虚拟机、包含硬件服务器同时为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335, 335,
                335, 335, 335, 335, 337, 337, 337, 337, 337
              ]
            }
          ]
        },
        {
          model_name: '机架',
          model_total: [
            3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382,
            3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.039621525724423415, 0.039621525724423415, 0.039621525724423415,
            0.039621525724423415, 0.039621525724423415, 0.039621525724423415,
            0.039621525724423415, 0.039621525724423415, 0.039621525724423415,
            0.039621525724423415, 0.039621525724423415, 0.039621525724423415,
            0.039621525724423415, 0.039621525724423415, 0.039621525724423415,
            0.039621525724423415, 0.039621525724423415, 0.039621525724423415,
            0.039621525724423415, 0.039621525724423415, 0.039621525724423415,
            0.039621525724423415
          ],
          check_data: [
            {
              check_id: 'FRAME_1',
              check_name: '机架异常',
              check_desc: '当机架（空间）所在机房为空，判定为异常',
              error_duration: 1,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                134, 134, 134, 134, 134, 134, 134, 134, 134, 134, 134, 134, 134,
                134, 134, 134, 134, 134, 134, 134, 134, 134
              ],
              check_sum: [
                3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382,
                3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382, 3382,
                3382, 3382
              ]
            }
          ]
        },
        {
          model_name: '分布式存储池',
          model_total: [
            132, 132, 132, 132, 132, 132, 132, 132, 132, 132, 132, 132, 132,
            132, 132, 132, 132, 132, 132, 132, 132, 132
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
          ],
          check_data: [
            {
              check_id: 'DISTRIBUTED_STORAGE_CLUSTER_1',
              check_name: '集群为空',
              check_desc: '当分布式存储池所属分布式存储集群为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                108, 108, 108, 108, 108, 108, 108, 108, 108, 108, 108, 108, 108,
                108, 108, 108, 108, 108, 108, 108, 108, 108
              ]
            }
          ]
        },
        {
          model_name: '路由器',
          model_total: [
            147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147, 147,
            147, 147, 147, 147, 147, 147, 147, 147, 147
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.49312977099236643, 0.49312977099236643, 0.49312977099236643,
            0.49312977099236643, 0.49312977099236643, 0.49312977099236643,
            0.49312977099236643, 0.49312977099236643, 0.49312977099236643,
            0.49312977099236643, 0.49312977099236643, 0.49312977099236643,
            0.49312977099236643, 0.49312977099236643, 0.49312977099236643,
            0.49312977099236643, 0.49312977099236643, 0.49312977099236643,
            0.49312977099236643, 0.49312977099236643, 0.49312977099236643,
            0.49312977099236643
          ],
          check_data: [
            {
              check_id: 'ROUTER_1',
              check_name: '所属硬件分区为空',
              check_desc: '路由器所属硬件分区为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
                131, 131, 131, 131, 131, 131, 131, 131, 131
              ]
            },
            {
              check_id: 'ROUTER_5',
              check_name: '配对路由器下联EOR为空',
              check_desc: '业务配对路由器下联EOR为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 125,
                125, 125, 125, 125, 125, 125, 125, 125, 125
              ],
              check_sum: [
                131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
                131, 131, 131, 131, 131, 131, 131, 131, 131
              ]
            },
            {
              check_id: 'ROUTER_2',
              check_name: '所在机架为空',
              check_desc: '路由器所在机架为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71,
                71, 71, 71, 71, 71, 71
              ],
              check_sum: [
                131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
                131, 131, 131, 131, 131, 131, 131, 131, 131
              ]
            },
            {
              check_id: 'ROUTER_3',
              check_name: '型号为空',
              check_desc: '路由器型号为空，则判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
                131, 131, 131, 131, 131, 131, 131, 131, 131
              ]
            },
            {
              check_id: 'ROUTER_4',
              check_name: '下联EOR为空',
              check_desc: 'CE路由器下联EOR为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,
                127, 127, 127, 127, 127, 127, 127, 127, 127
              ],
              check_sum: [
                131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
                131, 131, 131, 131, 131, 131, 131, 131, 131
              ]
            }
          ]
        },
        {
          model_name: 'IS',
          model_total: [
            76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76, 76,
            76, 76, 76, 76, 76
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
          ],
          check_data: [
            {
              check_id: 'IS_2',
              check_name: 'IS机架异常',
              check_desc: 'IS所在机架为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55,
                55, 55, 55, 55, 55, 55
              ]
            },
            {
              check_id: 'IS_1',
              check_name: 'IS硬件分区异常',
              check_desc: 'IS所属硬件分区为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55,
                55, 55, 55, 55, 55, 55
              ]
            }
          ]
        },
        {
          model_name: '交换机',
          model_total: [
            3902, 3902, 3902, 3918, 3918, 3918, 3918, 3918, 3926, 3926, 3924,
            3924, 3924, 3924, 3924, 3924, 3924, 3924, 3924, 3924, 3924, 3924
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.14663049685893775, 0.14663049685893775, 0.14663049685893775,
            0.1471006253553155, 0.1471006253553155, 0.1471006253553155,
            0.1471006253553155, 0.1471006253553155, 0.14846851956891663,
            0.14846851956891663, 0.1482690124858116, 0.1482690124858116,
            0.1482690124858116, 0.1482690124858116, 0.1482690124858116,
            0.1482690124858116, 0.1482690124858116, 0.1482690124858116,
            0.1482690124858116, 0.1482690124858116, 0.1482690124858116,
            0.1482690124858116
          ],
          check_data: [
            {
              check_id: 'SWITCH_1',
              check_name: '所属硬件分区为空',
              check_desc: '交换机所属硬件分区为空，判定为异常',
              error_duration: 14,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
                8
              ],
              check_sum: [
                3502, 3502, 3502, 3518, 3518, 3518, 3518, 3518, 3526, 3526,
                3524, 3524, 3524, 3524, 3524, 3524, 3524, 3524, 3524, 3524,
                3524, 3524
              ]
            },
            {
              check_id: 'SWITCH_2',
              check_name: '型号为空',
              check_desc: '交换机型号为空，则判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 8, 8, 8, 8, 8, 8, 8, 8,
                8, 8, 8, 8
              ],
              check_sum: [
                3502, 3502, 3502, 3518, 3518, 3518, 3518, 3518, 3526, 3526,
                3524, 3524, 3524, 3524, 3524, 3524, 3524, 3524, 3524, 3524,
                3524, 3524
              ]
            },
            {
              check_id: 'SWITCH_3',
              check_name: '所在机架为空',
              check_desc: '交换机所在机架为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                1942, 1942, 1942, 1942, 1942, 1942, 1942, 1942, 1950, 1950,
                1950, 1950, 1950, 1950, 1950, 1950, 1950, 1950, 1950, 1950,
                1950, 1950
              ],
              check_sum: [
                3502, 3502, 3502, 3518, 3518, 3518, 3518, 3518, 3526, 3526,
                3524, 3524, 3524, 3524, 3524, 3524, 3524, 3524, 3524, 3524,
                3524, 3524
              ]
            },
            {
              check_id: 'SWITCH_4',
              check_name: 'TOR上联EOR为空',
              check_desc: 'TOR上联EOR为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                102, 102, 102, 118, 118, 118, 118, 118, 126, 126, 124, 124, 124,
                124, 124, 124, 124, 124, 124, 124, 124, 124
              ],
              check_sum: [
                3502, 3502, 3502, 3518, 3518, 3518, 3518, 3518, 3526, 3526,
                3524, 3524, 3524, 3524, 3524, 3524, 3524, 3524, 3524, 3524,
                3524, 3524
              ]
            }
          ]
        },
        {
          model_name: 'VNF',
          model_total: [
            1322, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1319, 1319, 1319,
            1319, 1319, 1319, 1319, 1319, 1322, 1322, 1322, 1322, 1322, 1322
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.0015128593040847202, 0.0003787878787878788, 0.0003787878787878788,
            0.0007575757575757576, 0.0007575757575757576, 0.0007575757575757576,
            0.0007575757575757576, 0.0007575757575757576, 0.0003790750568612585,
            0.0003790750568612585, 0.0003790750568612585, 0.0003790750568612585,
            0.0003790750568612585, 0.0003790750568612585, 0.0003790750568612585,
            0.0003790750568612585, 0.0015128593040847202, 0.0015128593040847202,
            0.0015128593040847202, 0.0015128593040847202, 0.0015128593040847202,
            0.0
          ],
          check_data: [
            {
              check_id: 'VNF_1',
              check_name: 'VNF网元异常',
              check_desc: '所属网元为空的，判定异常',
              error_duration: 6,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4,
                0
              ],
              check_sum: [
                1322, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1319, 1319,
                1319, 1319, 1319, 1319, 1319, 1319, 1322, 1322, 1322, 1322,
                1322, 2644
              ]
            },
            {
              check_id: 'VNF_2',
              check_name: 'VNF虚拟机异常',
              check_desc: '当包含虚拟机为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                1322, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1319, 1319,
                1319, 1319, 1319, 1319, 1319, 1319, 1322, 1322, 1322, 1322,
                1322, 1322
              ]
            }
          ]
        },
        {
          model_name: '负载均衡',
          model_total: [
            12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
            12, 12, 12, 12, 12
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
          ],
          check_data: [
            {
              check_id: 'LB_1',
              check_name: '硬件分区为空',
              check_desc: '负载均衡器所属硬件分区为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                6
              ]
            },
            {
              check_id: 'LB_2',
              check_name: '机架为空',
              check_desc: '负载均衡器所在机架为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                6
              ]
            }
          ]
        },
        {
          model_name: '存储服务器',
          model_total: [
            3220, 3220, 3220, 3220, 3220, 3220, 3220, 3220, 3220, 3220, 3220,
            3220, 3220, 3220, 3220, 3220, 3220, 3220, 3220, 3220, 3220, 3220
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.042942743009320904, 0.042942743009320904, 0.042942743009320904,
            0.042942743009320904, 0.042942743009320904, 0.042942743009320904,
            0.042942743009320904, 0.042942743009320904, 0.042942743009320904,
            0.042942743009320904, 0.042942743009320904, 0.042868767569167035,
            0.042868767569167035, 0.042868767569167035, 0.042868767569167035,
            0.042868767569167035, 0.042868767569167035, 0.042868767569167035,
            0.042868767569167035, 0.042868767569167035, 0.042868767569167035,
            0.042868767569167035
          ],
          check_data: [
            {
              check_id: 'STORAGE_SERVER_9',
              check_name: '角色值异常',
              check_desc: '角色值为空时提示异常，暂不对枚举值做判断',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004
              ]
            },
            {
              check_id: 'STORAGE_SERVER_4',
              check_name: '硬件服务器异常',
              check_desc: '存储服务器所属硬件分区为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004
              ]
            },
            {
              check_id: 'STORAGE_SERVER_2',
              check_name: '管理网ipv6地址缺失',
              check_desc: '存储服务器管理网ipv6地址缺失',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004
              ]
            },
            {
              check_id: 'STORAGE_SERVER_1',
              check_name: 'BMC地址缺失',
              check_desc: '存储服务器BMC地址缺失',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004
              ]
            },
            {
              check_id: 'STORAGE_SERVER_5',
              check_name: '所在机架为空',
              check_desc: '存储服务器所在机架为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                976, 976, 976, 976, 976, 976, 976, 976, 976, 976, 976, 976, 976,
                976, 976, 976, 976, 976, 976, 976, 976, 976
              ],
              check_sum: [
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004
              ]
            },
            {
              check_id: 'STORAGE_SERVER_7',
              check_name: '工程期数异常',
              check_desc:
                '所属工程不能为空，且可以正确匹配到“一期”“一期扩容”“二期”“三期”的对应工程',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004
              ]
            },
            {
              check_id: 'STORAGE_SERVER_3',
              check_name: '分布式存储池缺失',
              check_desc: '存储服务器所属分布式存储池为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004
              ]
            },
            {
              check_id: 'STORAGE_SERVER_6',
              check_name: '上联TOR为空',
              check_desc: '存储服务器上联TOR为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                183, 183, 183, 183, 183, 183, 183, 183, 183, 183, 183, 183, 183,
                183, 183, 183, 183, 183, 183, 183, 183, 183
              ],
              check_sum: [
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004
              ]
            },
            {
              check_id: 'STORAGE_SERVER_8',
              check_name: '用途异常',
              check_desc:
                '用途值为空时提示异常，有值的符合枚举值Compute Node、Control Node、Storager、SDNController、Monitor、Monitor,Storager、Manager,Storager、Manager',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004, 3004,
                3004, 3004
              ]
            }
          ]
        },
        {
          model_name: '计算服务器',
          model_total: [
            16487, 16487, 16487, 16487, 16487, 16487, 16487, 16487, 16487,
            16487, 16487, 16487, 16487, 16487, 16487, 16487, 16487, 16487,
            16487, 16487, 16487, 16487
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.03371547112130145, 0.03371547112130145, 0.03371547112130145,
            0.03371547112130145, 0.03371547112130145, 0.03371547112130145,
            0.016415547548859044, 0.031368053280925866, 0.031368053280925866,
            0.031368053280925866, 0.031368053280925866, 0.031368053280925866,
            0.016415547548859044, 0.031368053280925866, 0.016415547548859044,
            0.031368053280925866, 0.031368053280925866, 0.016415547548859044,
            0.016415547548859044, 0.031368053280925866, 0.031368053280925866,
            0.016415547548859044
          ],
          check_data: [
            {
              check_id: 'COMPUTER_SERVER_9',
              check_name: '上联TOR为空',
              check_desc: '计算服务器上联TOR为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                247, 247, 247, 247, 247, 247, 247, 247, 247, 247, 247, 247, 247,
                247, 247, 247, 247, 247, 247, 247, 247, 247
              ],
              check_sum: [
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265
              ]
            },
            {
              check_id: 'COMPUTER_SERVER_8',
              check_name: '所在机架为空',
              check_desc: '计算服务器所在机架为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                1288, 1288, 1288, 1288, 1288, 1288, 1288, 1288, 1288, 1288,
                1288, 1288, 1288, 1288, 1288, 1288, 1288, 1288, 1288, 1288,
                1288, 1288
              ],
              check_sum: [
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265
              ]
            },
            {
              check_id: 'COMPUTER_SERVER_11',
              check_name: '用途值为空',
              check_desc:
                '用途值为空时提示异常，有值的符合枚举值Compute Node、Control Node、Storager、SDNController',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                116, 116, 116, 116, 116, 116, 116, 116, 116, 116, 116, 116, 116,
                116, 116, 116, 116, 116, 116, 116, 116, 116
              ],
              check_sum: [
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265
              ]
            },
            {
              check_id: 'COMPUTER_SERVER_7',
              check_name: '所属硬件分区为空',
              check_desc: '计算服务器所属硬件分区为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265
              ]
            },
            {
              check_id: 'COMPUTER_SERVER_5',
              check_name: '管理网IPv6地址缺失',
              check_desc: '计算服务器管理网IPv6地址缺失',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                3389, 3389, 3389, 3389, 3389, 3389, 220, 2959, 2959, 2959, 2959,
                2959, 220, 2959, 220, 2959, 2959, 220, 220, 2959, 2959, 220
              ],
              check_sum: [
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265
              ]
            },
            {
              check_id: 'COMPUTER_SERVER_1',
              check_name: '可分配VRam的总MB为空',
              check_desc: '计算服务器可分配VRam的总MB为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65,
                65, 65, 65, 65, 65, 65
              ],
              check_sum: [
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265
              ]
            },
            {
              check_id: 'COMPUTER_SERVER_10',
              check_name: '工程期数异常',
              check_desc:
                '所属工程不能为空，且可以正确匹配到“一期”“一期扩容”“二期”“三期”的对应工程',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265
              ]
            },
            {
              check_id: 'COMPUTER_SERVER_6',
              check_name: '所属HA为空',
              check_desc: '计算服务器所属HA为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407,
                407, 407, 407, 407, 407, 407, 407, 407, 407
              ],
              check_sum: [
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265
              ]
            },
            {
              check_id: 'COMPUTER_SERVER_3',
              check_name: '主机、管理系统异常',
              check_desc: '计算服务器角色所属主机组、部署管理系统不能均为空',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367,
                367, 367, 367, 367, 367, 367, 367, 367, 367
              ],
              check_sum: [
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265
              ]
            },
            {
              check_id: 'COMPUTER_SERVER_2',
              check_name: '可分配Vcpu总数为空',
              check_desc: '计算服务器可分配Vcpu总数为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65,
                65, 65, 65, 65, 65, 65
              ],
              check_sum: [
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265
              ]
            },
            {
              check_id: 'COMPUTER_SERVER_4',
              check_name: 'BMC地址缺失',
              check_desc: '计算服务器BMC地址缺失',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                116, 116, 116, 116, 116, 116, 116, 116, 116, 116, 116, 116, 116,
                116, 116, 116, 116, 116, 116, 116, 116, 116
              ],
              check_sum: [
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265
              ]
            },
            {
              check_id: 'COMPUTER_SERVER_12',
              check_name: '角色值为空',
              check_desc: '角色值为空时提示异常，暂不对枚举值做判断',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                116, 116, 116, 116, 116, 116, 116, 116, 116, 116, 116, 116, 116,
                116, 116, 116, 116, 116, 116, 116, 116, 116
              ],
              check_sum: [
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265, 15265,
                15265, 15265, 15265, 15265
              ]
            }
          ]
        },
        {
          model_name: '虚拟机',
          model_total: [
            54211, 54214, 54214, 54216, 54218, 54233, 54238, 54264, 54273,
            54281, 54281, 54281, 54284, 54284, 54235, 54237, 54272, 54272,
            54280, 54275, 54327, 54385
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.010370741161446, 0.010370741161446, 0.010370741161446,
            0.010370341849078157, 0.010369942567459172, 0.010366948935078266,
            0.010365951441675486, 0.010360767568745873, 0.010358974358974359,
            0.010360585550940882, 0.01035738091575655, 0.01035738091575655,
            0.010356982631545216, 0.010363391655450875, 0.010373164488751179,
            0.010366549914681241, 0.010369187965972396, 0.010359572026591277,
            0.010357978399512868, 0.01035894115723988, 0.010348625733241117,
            0.010337107401010683
          ],
          check_data: [
            {
              check_id: 'VRITUAL_MACHINE_5',
              check_name: '虚机关联卷为空',
              check_desc: '虚拟机关联卷为空，判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                51941, 51941, 51941, 51943, 51945, 51960, 51965, 51991, 52000,
                52008, 52008, 52008, 52010, 52010, 51961, 51962, 51997, 51997,
                52005, 52000, 52052, 52110
              ]
            },
            {
              check_id: 'VRITUAL_MACHINE_1',
              check_name: 'VNF、部署管理系统均为空',
              check_desc: '所属VNF、部署管理系统全为空，则为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                51941, 51941, 51941, 51943, 51945, 51960, 51965, 51991, 52000,
                52008, 52008, 52008, 52010, 52010, 51961, 51962, 51997, 51997,
                52005, 52000, 52052, 52110
              ]
            },
            {
              check_id: 'VRITUAL_MACHINE_4',
              check_name: '所属租户为空',
              check_desc: '虚拟机所属租户为空，判定为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                1618, 1618, 1618, 1618, 1618, 1618, 1618, 1618, 1618, 1618,
                1618, 1618, 1618, 1620, 1620, 1618, 1621, 1618, 1618, 1618,
                1618, 1618
              ],
              check_sum: [
                51941, 51941, 51941, 51943, 51945, 51960, 51965, 51991, 52000,
                52008, 52008, 52008, 52010, 52010, 51961, 51962, 51997, 51997,
                52005, 52000, 52052, 52110
              ]
            },
            {
              check_id: 'VRITUAL_MACHINE_6',
              check_name: '宿主机为空',
              check_desc: '虚拟机所在宿主机为空，判定为异常',
              error_duration: 1,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                1614, 1614, 1614, 1614, 1614, 1614, 1614, 1614, 1614, 1615,
                1614, 1614, 1614, 1614, 1614, 1614, 1614, 1614, 1614, 1614,
                1614, 1614
              ],
              check_sum: [
                51941, 51941, 51941, 51943, 51945, 51960, 51965, 51991, 52000,
                52008, 52008, 52008, 52010, 52010, 51961, 51962, 51997, 51997,
                52005, 52001, 52052, 52110
              ]
            },
            {
              check_id: 'VRITUAL_MACHINE_3',
              check_name: 'vCPU数量为空',
              check_desc:
                'vCPU数量为空或0时，判定为异常（仅检查华南资源池内的虚拟机）',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                51941, 51941, 51941, 51943, 51945, 51960, 51965, 51991, 52000,
                52008, 52008, 52008, 52010, 52010, 51961, 51962, 51997, 51997,
                52005, 52000, 52052, 52110
              ]
            },
            {
              check_id: 'VRITUAL_MACHINE_2',
              check_name: 'vRams大小(MB)为空',
              check_desc:
                'vRams大小(MB)为空或0，则判定为异常（仅检查华南资源池内的虚拟机）',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                51941, 51941, 51941, 51943, 51945, 51960, 51965, 51991, 52000,
                52008, 52008, 52008, 52010, 52010, 51961, 51962, 51997, 51997,
                52005, 52000, 52052, 52110
              ]
            }
          ]
        },
        {
          model_name: '卷',
          model_total: [
            113121, 113174, 113204, 113168, 113155, 113239, 113422, 113541,
            113479, 113394, 113389, 113420, 113428, 113428, 113431, 113366,
            113373, 113373, 113388, 113426, 113461, 113783
          ],
          dates: [
            '20230523',
            '20230524',
            '20230525',
            '20230526',
            '20230527',
            '20230528',
            '20230529',
            '20230530',
            '20230531',
            '20230601',
            '20230602',
            '20230603',
            '20230604',
            '20230605',
            '20230606',
            '20230607',
            '20230608',
            '20230609',
            '20230610',
            '20230611',
            '20230612',
            '20230614'
          ],
          error_pure_rate: [
            0.03017671967962375, 0.030396748254837853, 0.03052120141342756,
            0.030539747622918948, 0.030543256356550096, 0.031010729897999734,
            0.03004814050679786, 0.031020724521521617, 0.030909892046706324,
            0.030518564247288122, 0.03049786126912731, 0.029823834379628978,
            0.029751199040767385, 0.029751199040767385, 0.030235305526902765,
            0.03016883964644237, 0.030127283472554226, 0.029787684464006915,
            0.029893988569815847, 0.030183738604503536, 0.029764580413725025,
            0.02979020733175718
          ],
          check_data: [
            {
              check_id: 'VOLUME_2',
              check_name: '关联虚机LUN异常',
              check_desc: '未关联到虚拟机的LUN，则判断为异常',
              error_duration: 21,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                6827, 6880, 6910, 6912, 6912, 7023, 6816, 7044, 7015, 6921,
                6916, 6765, 6749, 6749, 6859, 6840, 6831, 6754, 6779, 6847,
                6754, 9076
              ],
              check_sum: [
                113117, 113170, 113200, 113164, 113151, 113235, 113418, 113537,
                113475, 113390, 113385, 113416, 113424, 113424, 113427, 113362,
                113369, 113369, 113384, 113422, 113457, 177842
              ]
            },
            {
              check_id: 'VOLUME_1',
              check_name: '后缀异常',
              check_desc: '名称有deleted后缀，则判定为异常',
              error_duration: 0,
              check_dates: [
                '20230523',
                '20230524',
                '20230525',
                '20230526',
                '20230527',
                '20230528',
                '20230529',
                '20230530',
                '20230531',
                '20230601',
                '20230602',
                '20230603',
                '20230604',
                '20230605',
                '20230606',
                '20230607',
                '20230608',
                '20230609',
                '20230610',
                '20230611',
                '20230612',
                '20230614'
              ],
              check_error_datas: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0
              ],
              check_sum: [
                113117, 113170, 113200, 113164, 113151, 113235, 113418, 113537,
                113475, 113390, 113385, 113416, 113424, 113424, 113427, 113362,
                113369, 113369, 113384, 113422, 113457, 113779
              ]
            }
          ]
        }
      ]
    }
  }
)

/**
 * @description: Alarm Details & Event Details
 * @author:liu
 */
Mock.mock(/\/mock\/monitor\/prometheus\/alarm\/*/, 'get', (data) => {
  // If the type parameter is equal to event
  if (data.url.indexOf('type=event') > -1) {
    return {
      actualValue: 1.49188504e8,
      changeValue: 26.006766915870728,
      createTime: '2023-07-03 09:46:11',
      eventName: '防火墙吞吐量突增',
      eventSeverity: 2,
      eventStatus: 0,
      eventType: '突变',
      id: 'e202307030946105421675682312138928129',
      illustrate:
        '当前值为142MB/s，对比上个采集点(5分钟)前增加26.01%，超过阀值15.0%',
      metricExplain: '数通设备-防火墙整机吞吐量',
      metricName: 'monitor_host_network_firewall_throughput',
      objectModelName: '',
      objectName: 'NFV-D-HNZJI-06A-1701-AE03-M-FW-01',
      objectType: 'network_fw',
      resourcePoolName: 'NFV-RP-HNZJI-06A',
      sendStatus: 0,
      suggest: '请联系维护人员检查相关设备情况',
      thresholdValue: 15.0,
      unit: 'b/s',
      updateTime: '2023-07-03 09:46:11'
    }
  }
  // If the type parameter is equal to alarm
  if (data.url.indexOf('type=alarm') > -1) {
    return {
      CFp0: 16240,
      CFp1: 43459293,
      CFp2: 18552711,
      CFp3: 541304981,
      activeStatus: 0,
      alarmSeverity: 4,
      alarmText:
        '{"alarmTitle":"High Ethernet Port Drop Rate","alarmStatus":"0","alarmId":"12ac2f1e4fd194fc75a8388c2f6a46dc","alarmSeq":"1498556","alarmType":"QUALITYOFSERVICEALARM","origSeverity":"4","eventTime":"2023-06-05 12:52:59","specificProblemID":"193-2032008","SpecificProblem":"High Ethernet Port Drop Rate","objectType":"host","subObjectType":"host","objectUID":"NFV-D-HNZJI-04A-1802-AC21-S-SRV-09","objectName":"NFV-D-HNZJI-04A-1802-AC21-S-SRV-09","subObjectUID":"NFV-D-HNZJI-04A-1802-AC21-S-SRV-09","subObjectName":"NFV-D-HNZJI-04A-1802-AC21-S-SRV-09","locationInfo":"System=NFV-RP-HNZJI-04A-ER-01,Cluster=openstack,Host=NFV-D-HNZJI-04A-1802-AC21-S-SRV-09,Port=data1_rx_droprate","dataSource":"VIM","sourceID":"NFV-RP-HNZJI-04A-ER-01","vendorName":"Ericsson","province":"","omcId":"44011103","Pflag":"No","PVFlag":"vim","addInfo":"probable_cause:207;additional_info:{\\"raise_active_severity\\"<colon> 6, \\"raise_sequence_no\\"<colon> 417081};additional_text:{\\"Aggregator\\"<colon> \\"traffic\\"};Arch:x86_64;CPUMfrs:intel","hostIdList":"NFV-D-HNZJI-04A-1802-AC21-S-SRV-09","vmIdList":""}',
      cityName: '广东',
      clearTime: '2023-06-05 12:52:59',
      createTime: '2023-06-05 12:52:03',
      eqpLabel: 'NFV-D-HNZJI-04A-1802-AC21-S-SRV-09',
      eqpObjectClass: 66001,
      fp0: 16240,
      fp1: 43459293,
      fp2: 18552711,
      fp3: 541304981,
      happenTime: '2023-06-05 12:51:59',
      locateInfo:
        'System=NFV-RP-HNZJI-04A-ER-01,Cluster=openstack,Host=NFV-D-HNZJI-04A-1802-AC21-S-SRV-09,Port=data1_rx_droprate',
      neLabel: 'NFV-D-HNZJI-04A-1802-AC21-S-SRV-09',
      neLocation: '',
      networkType: 2012,
      omcAlarmId: '12ac2f1e4fd194fc75a8388c2f6a46dc',
      orgSeverity: 0,
      orgType: 0,
      probableCauseTxt: 'High Ethernet Port Drop Rate',
      professionalType: 20,
      provinceName: '广东',
      regionName: '广东',
      resourcePoolName: 'NFV-RP-HNZJI-04A',
      resourceStatus: 0,
      sendJtFlag: 0,
      specialField22: ''
    }
  }
  return {
    msg: '参数携带错误'
  }
})

Mock.mock(/\/mock\/monitor\/ops\/alarm\/getData\/*/, 'post', (data) => {
  return {
    code: 0,
    msg: '操作成功',
    data: {
      timeAvg: {
        id: '2023-06-09',
        level1Count: 444478,
        level2Count: 10424810,
        level3Count: 19348361,
        networkAvailability: 99.99996,
        serverAvailability: 99.99999,
        storageAvailability: 99.9997,
        avgTime: 0.007152949061768618,
        unclearedCountMsg:
          '{"2023-06-04":1,"2023-06-06":1,"2023-06-05":1,"2023-06-07":8}',
        hostTypeMsg: '{"alx":"","zx":"","hw":"网络,计算"}',
        alarmCountTop:
          '[{"alarmName":"实体配置改变","currentAlarmCount":72580,"changeValue":90,"comparisonTime":"2023-06-07"},{"alarmName":"High Ethernet Port Drop Rate","currentAlarmCount":22596,"changeValue":99,"comparisonTime":"2023-06-07"},{"alarmName":"虚拟机操作系统故障告警","currentAlarmCount":1603,"changeValue":-10,"comparisonTime":"2023-06-07"},{"alarmName":"端口丢包率超过阈值","currentAlarmCount":201,"changeValue":-50,"comparisonTime":"2023-06-07"},{"alarmName":"端口错包超过阈值","currentAlarmCount":251,"changeValue":3,"comparisonTime":"2023-06-07"},{"alarmName":"接口中断","currentAlarmCount":194,"changeValue":0,"comparisonTime":"2023-06-07"},{"alarmName":"物理接口上单位时间内某类报文接收数量超过阈值","currentAlarmCount":178,"changeValue":0,"comparisonTime":"2023-06-07"},{"alarmName":"SystemPowerHigh","currentAlarmCount":163,"changeValue":0,"comparisonTime":"2023-06-07"},{"alarmName":"接口二层协议态down","currentAlarmCount":155,"changeValue":0,"comparisonTime":"2023-06-07"},{"alarmName":"远端邻居状态改变","currentAlarmCount":153,"changeValue":0,"comparisonTime":"2023-06-07"},{"alarmName":"接口IPv4协议态down","currentAlarmCount":149,"changeValue":0,"comparisonTime":"2023-06-07"}]',
        statisticalDate: '2023-06-08T16:00:00.000+00:00',
        createTime: '2023-07-04 11:19:03',
        updateTime: '2023-07-04 11:19:03'
      }
    }
  }
})
