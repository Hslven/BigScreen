// codemirror 不同类型脚本示例
const codeExample = {
  shell_script: '#!/bin/bash\n' +
    '\n' +
    'pwd\n' +
    'echo "Hello world"\n',
  playbook: '---\n' +
    '- hosts: "{{hosts}}"\n' +
    '  gather_facts: no\n' +
    '\n' +
    '  tasks:\n' +
    '    - name: "查看磁盘信息"\n' +
    '      shell: ls -la',
  action_script: '# version: Python3\n' +
    '###################################################################################################\n' +
    '#调试打印变量：\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n' +
    '#    var = "test"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n' +
    '#\t raise Exception(var)\n' +
    '#result字典说明：\n' +
    '#\t result["rc"]: 0或1，0表示指令执行成功，1表示指令执行失败\n' +
    '#\t result["failed"]: 脚本执行状态(对应用status)，True或False,设置该值可以定义脚本成功或失败\n' +
    '# \t result["stdout"]: 指令执行成功时的输出数据(对应用originalMsg)\n' +
    '#    result["stderr"]：指令执行出错时的描述信息\n' +
    '#    result["msg"]：用户自定义的错误描述信息(脚本失败时对应detail)，如巡检CPU指标异常\n' +
    '###################################################################################################\n' +
    '# please edit your code here:\n' +
    'def main(self, task_vars):\n' +
    '    self._task.args[\'_raw_params\'] = \'ifconfig\'\n' +
    '    result = self.execute_cmd(task_vars)\n' +
    '    return result',
  forward_online_script: '# version: Python3\n' +
    '###################################################################################################\n' +
    '# _task.args字典说明\n' +
    '#     command: 发送到远端网络设备的命令。\n' +
    '#\n' +
    '# result字典说明:\n' +
    '#     failed: 布尔值, 命令是否执行成功。\n' +
    '#     stdout: 命令的标准输出。\n' +
    '#     msg: 命令的错误输出。\n' +
    '###################################################################################################\n' +
    '# please edit your code here:\n' +
    'def main(self, task_vars):\n' +
    '    self._task.args[\'command\'] = \'display version\'\n' +
    '    result = self.execute_cmd(task_vars)\n' +
    '    return result'
}
export default codeExample
