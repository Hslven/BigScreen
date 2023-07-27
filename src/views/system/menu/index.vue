<template>
  <div>
    <content-header></content-header>
    <div class="bg-mod-card">
      <t-row class="p-4">
        <t-col :span="5" style="border: 1px solid rgba(231, 231, 231, 1); max-height: 720px; height: 720px">
          <t-space style="width: 100%; display: flex; align-items: center; border-bottom: 1px solid rgba(231, 231, 231, 1);">
            <div class="h-full py-4 px-6">菜单目录</div>
            <div style="float: right;" class="pr-4">
              <t-tooltip content="添加子菜单：选中菜单后点击添加；添加根菜单：不选中任何菜单点击添加" placement="mouse">
                <t-link theme="primary" target="_self" @click="append">
                  <add-icon slot="prefix-icon"></add-icon>
                  添加
                </t-link>
              </t-tooltip>
            </div>
          </t-space>
          <div class="p-4 tdesign-tree-demo tdesign-demo-vscroll">
            <t-tree
              activable
              expand-on-click-node
              @active="onActive"
              hover
              :data="menusData"
              :height="620"
              :maxHeight="720"
              :icon="true"
              :keys="{ value: 'menuId', label: 'label', children: 'children' }"
              ref="tree"
              style="font-size: 12px !important;"
            >
            <template #label="{ node }">
              <t-space>
                <mod-icon size="xs" :name="node.data.icon"></mod-icon>
                <div class="ml-2">{{ node.label }}</div>
              </t-space>
            </template>
              <template #operations="{ node }">
                <div>
                  <DeleteIcon @click="remove(node)" class="mr-4"></DeleteIcon>
                </div>
              </template>
            </t-tree>
          </div>
        </t-col>
        <t-col :span="7" style="border-top: 1px solid rgba(231, 231, 231, 1); border-bottom: 1px solid rgba(231, 231, 231, 1); border-right: 1px solid rgba(231, 231, 231, 1); max-height: 720px; overflow: auto; height: 720px">
          <div style="display: flex; align-items: center; border-bottom: 1px solid rgba(231, 231, 231, 1);">
            <div class="h-full py-4 px-6">菜单编辑</div>
          </div>
          <div class="p-4 h-full">
            <t-alert v-if="!is_click" theme="info" message="选中菜单后进行编辑" />
            <t-form
                v-else
                :data="menuForm"
                :rules="rules"
                @submit="onSubmit"
                class="p-4"
                labelAlign="top"
            >
              <t-form-item label="菜单名" name="label">
                <t-input v-model="menuForm.label" placeholder="请输入菜单名"></t-input>
              </t-form-item>
              <t-form-item label="页面组件" name="component">
                <t-input v-model="menuForm.component" placeholder="请输入页面组件"></t-input>
              </t-form-item>
              <t-form-item label="菜单路径" name="path">
                <t-input v-model="menuForm.path" placeholder="请输入菜单路径"></t-input>
              </t-form-item>
              <t-form-item label="菜单路径名" name="name">
                <t-input v-model="menuForm.name" placeholder="请输入菜单路径名"></t-input>
              </t-form-item>
              <t-form-item label="所属系统" name="sysName">
                <t-select
                  v-model="menuForm.sysName"
                  placeholder="请选择"
                  :options="sysOptions"
                />
              </t-form-item>
              <t-form-item label="图标" name="icon" help="支持Material Icons图标">
                <t-input v-model="menuForm.icon">
                  <mod-icon slot="prefix-icon" :name="menuForm.icon"></mod-icon>
                </t-input>
              </t-form-item>
              <t-form-item label="备注" name="remark">
                <t-input v-model="menuForm.remark" placeholder="请输入备注"></t-input>
              </t-form-item>
              <t-form-item label="排序" name="orderNum">
                <t-input-number v-model="menuForm.orderNum" :step="1" :max="999" autoWidth />
              </t-form-item>
              <t-form-item label="重定向" name="redirect">
                <t-input v-model="menuForm.redirect" placeholder="请输入重定向路由"></t-input>
              </t-form-item>
              <t-space>
                <t-form-item label-align="left" label="显示" name="visible" class="pr-6">
                  <t-switch v-model="menuForm.visible" :customValue="[0, 1]"></t-switch>
                </t-form-item>
                <t-form-item label-align="left" label="缓存" name="noCache" class="pr-6">
                  <t-switch v-model="menuForm.noCache" :customValue="[0, 1]"></t-switch>
                </t-form-item>
                <t-form-item label-align="left" label="保持打开" name="keepAlive" class="pr-6">
                  <t-switch v-model="menuForm.keepAlive" :customValue="[0, 1]"></t-switch>
                </t-form-item>
                <t-form-item label-align="left" label="外链" name="isFrame">
                  <t-switch v-model="menuForm.isFrame" :customValue="[0, 1]"></t-switch>
                </t-form-item>
              </t-space>
              <t-form-item v-show="!menuForm.isFrame" label="iframe链接" name="iframeLink">
                <t-input v-model="menuForm.iframeLink" placeholder="请输入iframe链接"></t-input>
              </t-form-item>
              <t-form-item class="pt-4">
                <t-button theme="primary" type="submit" block>保存</t-button>
              </t-form-item>
            </t-form>
          </div>
        </t-col>
      </t-row>
    </div>
    <t-dialog placement="center" :visible.sync="is_open" header="添加菜单" :cancelBtn="null" :confirm-btn="getConfirmBtn" width="30%">
      <t-form
          ref="formRef"
          :data="menuForm"
          :rules="rules"
          @submit="onSubmit"
          class="p-4"
          labelAlign="top"
      >
        <t-form-item label="菜单名" name="label">
          <t-input v-model="menuForm.label" placeholder="请输入菜单名"></t-input>
        </t-form-item>
        <t-form-item label="页面组件" name="component">
          <t-input v-model="menuForm.component" placeholder="请输入页面组件"></t-input>
        </t-form-item>
        <t-form-item label="菜单路径" name="path">
          <t-input v-model="menuForm.path" placeholder="请输入菜单路径"></t-input>
        </t-form-item>
        <t-form-item label="菜单路径名" name="name">
          <t-input v-model="menuForm.name" placeholder="请输入菜单路径名"></t-input>
        </t-form-item>
        <t-form-item label="所属系统" name="sysName">
          <t-select
            v-model="menuForm.sysName"
            placeholder="请选择"
            :options="sysOptions"
          />
        </t-form-item>
        <t-form-item label="图标" name="icon" help="支持Material Icons图标">
          <t-input v-model="menuForm.icon">
            <mod-icon slot="prefix-icon" :name="menuForm.icon"></mod-icon>
          </t-input>
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-input v-model="menuForm.remark" placeholder="请输入备注"></t-input>
        </t-form-item>
        <t-form-item label="排序" name="orderNum">
          <t-input-number v-model="menuForm.orderNum" :step="1" :max="999" autoWidth />
        </t-form-item>
        <t-form-item label="重定向" name="redirect">
          <t-input v-model="menuForm.redirect" placeholder="请输入重定向路由"></t-input>
        </t-form-item>
        <t-space>
          <t-form-item label-align="left" label="显示" name="visible">
            <t-switch v-model="menuForm.visible" :customValue="[0, 1]"></t-switch>
          </t-form-item>
          <t-form-item label-align="left" label="缓存" name="noCache" style="padding-left: 140px;">
            <t-switch v-model="menuForm.noCache" :customValue="[0, 1]"></t-switch>
          </t-form-item>
        </t-space>
        <t-space>
          <t-form-item label-align="left" label="保持打开" name="keepAlive">
            <t-switch v-model="menuForm.keepAlive" :customValue="[0, 1]"></t-switch>
          </t-form-item>
          <t-form-item label-align="left" label="外链" name="isFrame" style="padding-left: 140px;">
            <t-switch v-model="menuForm.isFrame" :customValue="[0, 1]"></t-switch>
          </t-form-item>
        </t-space>
        <t-form-item v-show="!menuForm.isFrame" label="iframe链接" name="iframeLink">
          <t-input v-model="menuForm.iframeLink" placeholder="请输入iframe链接"></t-input>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { getMenuListApi, updateMenuApi, addMenuApi, deleteMenuApi } from '@/api/system/menu'
import { cloneDeep } from 'lodash'
import { AddIcon, DeleteIcon } from 'tdesign-icons-vue'
import dialogSubmit from '@/mixins/dialogSubmit'
export default {
  name: 'index',
  mixins: [dialogSubmit],
  components: {
    ContentHeader,
    AddIcon,
    DeleteIcon
  },
  data () {
    return {
      operationSign: 'add',
      is_click: false,
      is_open: false,
      menusData: [],
      menuForm: {
        parentId: 0,
        createBy: this.$store.getters.getInfo.userName,
        label: '',
        icon: 'circle',
        path: '',
        name: '',
        component: 'LAYOUT',
        isFrame: 1,
        iframeLink: '',
        sysName: '',
        menuType: 'C',
        redirect: '',
        orderNum: 1,
        remark: '',
        visible: 0,
        noCache: 1,
        keepAlive: 1
      },
      rules: {
        label: [{ required: true, message: '菜单名必填', type: 'error' }],
        component: [{ required: true, message: '页面组件必填', type: 'error' }],
        path: [{ required: true, message: '菜单路径必填', type: 'error' }],
        name: [{ required: true, message: '菜单路径名必填' }],
        sysName: [{ required: true, message: '所属系统必填', type: 'error' }]
      },
      sysOptions: [
        { label: 'modops', value: 'modops' },
        { label: 'inops', value: 'inops' },
        { label: 'habor', value: 'habor' }
      ],
      clickNode: ''
    }
  },
  mounted () {
    this.getMenusList()
  },
  methods: {
    getMenusList () {
      return new Promise((resolve, reject) => {
        getMenuListApi().then(response => {
          const { data } = response
          if (data.code === 0) {
            this.menusData = data.data
          } else {
            this.$message.error('获取菜单列表失败！')
          }
        }).catch(error => {
          this.$message.error(error.response.message)
        })
      })
    },
    onActive (value, context) {
      if (value.length) {
        this.operationSign = 'edit'
        this.is_click = true
        this.menuForm = cloneDeep(context.node.data)
        delete this.menuForm.children
        this.clickNode = context.node
      } else {
        this.clickNode = ''
        this.is_click = false
      }
    },
    onSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        if (this.operationSign === 'edit') {
          updateMenuApi(this.menuForm).then(response => {
            const { data } = response
            if (data.code === 0) {
              this.$message.success('更新菜单成功！')
              this.getMenusList()
              this.is_open = false
            } else {
              this.$message.error('更新菜单失败！')
            }
          }).catch(error => {
            this.$message.error(error.response.message)
          })
        } else {
          addMenuApi(this.menuForm).then(response => {
            const { data } = response
            if (data.code === 0) {
              this.$message.success('添加菜单成功！')
              this.getMenusList()
              this.is_open = false
            } else {
              this.$message.error('添加菜单失败！')
            }
          }).catch(error => {
            this.$message.error(error.response.message)
          })
        }
      } else {
        this.$message.warning(`错误：${firstError}`)
      }
    },
    append () {
      this.operationSign = 'add'
      this.menuForm = {
        parentId: 0,
        createBy: this.$store.getters.getInfo.userName,
        label: '',
        icon: 'circle',
        path: '',
        name: '',
        component: 'LAYOUT',
        isFrame: 1,
        iframeLink: '',
        sysName: '',
        menuType: 'C',
        redirect: '',
        orderNum: 1,
        remark: '',
        visible: 0,
        noCache: 1,
        keepAlive: 1
      }
      this.is_open = true
      if (this.clickNode) {
        this.menuForm.component = ''
        this.menuForm.parentId = this.clickNode.value
      }
    },
    editMenu (node, sign) {
      this.is_open = true
      this.operationSign = sign
      this.menuForm = cloneDeep(node.data)
      delete this.menuForm.children
    },
    remove (node) {
      const confirmDia = this.$dialog.confirm({
        header: '删除菜单',
        theme: 'warning',
        body: `是否确定删除菜单："${node.label}", 以及所属的所有子菜单？`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          return new Promise((resolve, reject) => {
            let nodes = []
            if (node) {
              nodes = node.getChildren(true) || []
              nodes.push(node)
              for (const item of nodes) {
                deleteMenuApi(item.value).then(response => {
                  const { data } = response
                  if (data.code === 0) {
                    item.remove()
                    this.$message.success(`删除菜单：${item.data.label}成功！`)
                  } else {
                    this.$message.error(`删除菜单：${item.data.label}失败！`)
                  }
                }).catch(error => {
                  this.$message.error(error.response.message)
                })
              }
              confirmDia.destroy()
            }
          })
        },
        onClose: ({ e, trigger }) => {
          confirmDia.hide()
        }
      })
    }
  }
}
</script>

<style>
.tdesign-tree-demo .t-tree {
  margin-bottom: 20px;
}
.tdesign-tree-demo .title {
  margin-bottom: 10px;
}
.tdesign-tree-demo .tips {
  margin-bottom: 10px;
}
.tdesign-tree-demo .operations {
  margin-bottom: 10px;
}
.tdesign-tree-demo .t-form__item {
  margin-bottom: 5px;
}
.tdesign-demo-vscroll .t-alert {
  margin-bottom: 5px;
}
.tdesign-demo-vscroll .t-alert {
  margin-bottom: 5px;
}
.tdesign-demo-vscroll .t-tree {
  overflow-y: auto;
}
</style>
