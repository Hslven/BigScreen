export const fieldList = {
  job: [
    { name: '脚本名称', value: 'name', type: 'input', input: 'text' },
    { name: '脚本类型', value: 'type', type: 'select', options: 'scriptType' }
  ],
  task: [
    { name: '任务名称', value: 'jobName', type: 'input', input: 'text' },
    { name: '任务状态', value: 'status', type: 'select', options: 'taskStatus' }
  ],
  inspect: [
    { name: '任务名称', value: 'jobName', type: 'input', input: 'text' },
    { name: '任务状态', value: 'status', type: 'select', options: 'taskStatus' }
  ]
}
export const valueList = {
  job: { name: '', type: '' },
  task: { jobName: '', status: '' },
  inspect: { jobName: '', status: '' }
}
