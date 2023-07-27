export const jobSelectorColumn = [
  { type: 'checkbox', align: 'center', width: '40' },
  { type: 'seq', title: '序号', width: 50, align: 'center' },
  { field: 'name', title: '脚本名称', sortable: true, align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'type', title: '脚本类型', sortable: true, align: 'left', formatType: 'formatField', formatList: 'scriptType', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'lang', title: '脚本语言', sortable: true, align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'version', title: '版本', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'description', title: '脚本描述', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'createDate', title: '创建时间', sortable: true, align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'updateDate', title: '更新时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true }
]
export const inspectTaskColumn = [
  { type: 'checkbox', align: 'center', width: '40' },
  { type: 'seq', title: '序号', align: 'center', width: '50' },
  { field: 'jobName', title: '巡检任务名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: '14%' },
  { field: 'runOnly', title: '执行方式', formatType: 'formatExecuteType', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'jobState', title: '执行状态', formatType: 'formatField', formatList: 'jobSheduleState', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'jobExpression', title: '执行周期', formatType: 'formatExpression', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: '17%' },
  { field: 'ignoreErrors', title: '忽略错误执行下一步骤', formatType: 'formatterIgnore', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'createDate', title: '创建时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'updateDate', title: '更新时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true }
]
export const taskColumn = [
  { type: 'checkbox', align: 'center', width: '40' },
  { type: 'seq', title: '序号', align: 'center', width: '80' },
  { field: 'jobName', title: '任务名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'runOnly', title: '执行方式', formatType: 'formatExecuteType', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: 150 },
  { field: 'state', title: '执行状态', formatType: 'formatField', formatList: 'jobSheduleState', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: 100 },
  { field: 'scheduleExpr', title: '执行周期', formatType: 'formatExpression', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'ignoreErrors', title: '忽略错误执行下一步骤', formatType: 'formatterIgnore', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'createDate', title: '创建时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: 150 }
]
export const backupFileColumn = [
  { type: 'checkbox', align: 'center', width: '40' },
  { type: 'seq', title: '序号', align: 'center', width: '80' },
  { field: 'hostName', title: '设备名称', sortable: true, align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', width: '10%' },
  { field: 'hostResourcePool', title: '所属资源池', formatType: 'formatField', formatList: 'resourcePool', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'fileSize', title: '文件大小', sortable: true, align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'updateDate', title: '备份时间', sortable: true, align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'backupState', title: '备份结果', formatType: 'formatField', formatList: 'backupState', sortable: true, align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'cleanDate', title: '归档时间', sortable: true, align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'cleanFlag', title: '归档状态', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'createBy', title: '创建人', formatType: 'formatUser', formatList: 'userDict', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' }
]
export const backupTaskColumn = [
  { type: 'checkbox', align: 'center', width: '40' },
  { type: 'seq', title: '序号', align: 'center', width: '50' },
  { field: 'jobName', title: '任务名称', sortable: true, align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'runOnly', title: '执行方式', formatType: 'formatExecuteType', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'backupType', title: '备份类型', sortable: true, formatType: 'formatField', formatList: 'backupType', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', width: '10%' },
  { field: 'state', title: '任务状态', sortable: true, formatType: 'formatField', formatList: 'jobSheduleState', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'scheduleExpr', title: '执行周期', formatType: 'formatExpression', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', width: '10%' },
  { field: 'nextTime', title: '下一次执行时间', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'isNewRecord', title: '脚本是否最新', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', width: '110px' },
  { field: 'retentionTime', title: '文件保留时长', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'createDate', title: '创建时间', sortable: true, align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'updateDate', title: '修改时间', sortable: true, align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'createBy', title: '创建人', formatType: 'formatUser', formatList: 'user', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' }
]
export const executeRecordsColumn = [
  { type: 'checkbox', align: 'center', width: '40' },
  { type: 'seq', title: '序号', align: 'center', width: '50' },
  { field: 'jobName', title: '作业名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: '12%' },
  { field: 'hostCount', title: '总设备数', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'okCount', title: '成功', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'failCount', title: '失败', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'unreachableCount', title: '无法连接', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'newestTask', title: '最新执行步骤', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: '13%' },
  { field: 'status', title: '作业状态', formatType: 'formatField', formatList: 'jobStatus', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: '90px' },
  { field: 'createBy', title: '创建人', formatType: 'formatUser', formatList: 'userDict', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'duration', title: '执行时长', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'createDate', title: '创建时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
  { field: 'updateDate', title: '更新时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true }
]
export const blockLogColumn = [
  { type: 'checkbox', align: 'center', width: '40' },
  { type: 'seq', title: '序号', align: 'center', width: '50' },
  { field: 'taskCode', title: '任务单号', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'taskSource', title: '需求来源', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'sourceIp', title: '源IP', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'ipType', title: 'IP类型', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'actionType', title: '动作', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'autoBlock', title: '是否自动封堵', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'sourceFor', title: '操作原因', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'operatorName', title: '操作人', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'systemCode', title: '业务系统', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'createDate', title: '操作时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'policyFailTime', title: '策略失效时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'blockStatus', title: '封堵状态', formatList: 'blockState', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'callbackStatus', title: '反馈状态', formatList: 'blockCallbackState', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' }
]
export const blockRecodsColumn = [
  { type: 'checkbox', align: 'center', width: '40' },
  { type: 'seq', title: '序号', align: 'center', width: '50' },
  { field: 'hostName', title: '设备', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'bmcIp', title: 'IP', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'hostMfgr', title: '厂家', formatList: 'hostMfgr', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'hostModel', title: '型号', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'action', title: '动作', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'sourceIp', title: '源IP', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
  { field: 'blockStatus', title: '操作状态', align: 'left', formatList: 'blockState', showHeaderOverflow: true, showOverflow: 'tooltip' }
]
