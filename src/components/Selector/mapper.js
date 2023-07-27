import { jobSelectorColumn, taskColumn, inspectTaskColumn } from '@/dict/inops/column'
// 角色类型-按钮文案映射
export const roleMapper = {
  'host-role': '分配设备组',
  'script-role': '分配脚本',
  'task-role': '分配任务',
  'inspect-task-role': '巡检任务管理',
  'inspect-item-role': '巡检项管理',
  'approve-role': '审批人管理'
}
// 角色类型-方法映射
export const methodMapper = {
  user: { getRole: 'getUserOfRole', saveRole: 'saveUserOfRole' },
  'host-role': { getData: 'getHostGroup', getRole: 'getHostGroupOfRole' },
  'script-role': { getData: 'getJob', getRole: 'getJobOfRole', saveRole: 'saveJobOfRole' },
  'task-role': { getData: 'getTask', getRole: 'getTaskOfRole', saveRole: 'saveTaskOfRole' },
  'inspect-task-role': { getData: 'getInspect', getRole: 'getInspectOfRole', saveRole: 'saveInspectOfRole' },
  'inspect-item-role': { getData: 'getInspectItem', getRole: 'getInspectItemOfRole' },
  'approve-role': { getRole: 'getUserOfApprove', saveRole: 'saveApproveUserOfRole' }
}
// 弹窗属性映射
export const dialogMapper = {
  user: 'user',
  'host-role': 'tree',
  'script-role': 'common',
  'task-role': 'common',
  'inspect-task-role': 'common',
  'inspect-item-role': 'tree',
  'approve-role': 'user'
}
// 弹窗标题映射
export const titleMapper = {
  user: '用户信息',
  'host-role': '设备组信息',
  'script-role': '脚本信息',
  'task-role': '任务信息',
  'inspect-task-role': '巡检任务信息',
  'inspect-item-role': '巡检项信息',
  'approve-role': '审批人信息'
}
// 字段值映射
export const fieldValueMapper = {
  'script-role': 'job',
  'task-role': 'task',
  'inspect-task-role': 'inspect'
}
// 表格column映射
export const columnMapper = {
  'script-role': jobSelectorColumn,
  'task-role': taskColumn,
  'inspect-task-role': inspectTaskColumn
}
