<template>
  <div>未替换为新UI</div>
  <!-- <div class="px-4 bg-mod-card">
    <div style="display: flex; height: 82.7px">
      <vxe-toolbar>
        <template #buttons>
          <p style="width: 100px; padding-left: 10px">指标</p>

          <vxe-input
            v-model="filterName1"
            type="search"
            placeholder="搜索"
            @keyup="searchEvent1"
          ></vxe-input>
        </template>
      </vxe-toolbar>
    </div>
    <div>
      <q-btn
        color="primary"
        label="+ 告警事件"
        style="margin: 10px 0"
        @click="handleToViewReciver"
      />
    </div>
    <vxe-table
      ref="xTree"
      border="inner"
      max-height="600"
      show-header-overflow
      :column-config="{ isCurrent: true, isHover: false }"
      :data="list1"
      :radio-config="{ highlight: true }"
    >
      <vxe-column
        type="html"
        width="5%"
        :field="field[5].field"
        :title="field[5].name"
      ></vxe-column>

      <vxe-column
        type="html"
        width="10%"
        :field="field[0].field"
        :title="field[0].name"
      ></vxe-column>
      <vxe-column
        type="html"
        width="25%"
        :field="field[2].field"
        :title="field[2].name"
      ></vxe-column>
      <vxe-column
        type="html"
        width="10%"
        :field="field[3].field"
        :title="field[3].name"
      ></vxe-column>
      <vxe-column
        width="10%"
        :field="this.field[4].field"
        :title="this.field[4].name"
      >
        <template #default="{ row }">
          <div
            v-if="row.isuse"
            style="
              width: 30px;
              height: 22px;
              background-color: #f6ffed;
              border: 1px solid #b7eb8f;
              text-align: center;
              color: #64bf37;
              white-space: none;
              user-select: none;
              margin-left: 5px;
            "
          >
            <p style="font-size: 12px">是</p>
          </div>
          <div
            v-else
            style="
              width: 30px;
              height: 22px;
              background-color: #000;
              border: 1px solid #000;
              text-align: center;
              color: #f6ffed;
              white-space: none;
              user-select: none;
              margin-left: 5px;
            "
          >
            <p style="font-size: 12px">否</p>
          </div>
        </template>
      </vxe-column>
      <vxe-column
        type="html"
        :field="'time'"
        width="10%"
        :title="'创建时间'"
      ></vxe-column>
      <vxe-column width="30%" title="操作">
        <template #default="{ row }">
          <div style="display: flex; justify-content: space-between">
            <span @click="handleReciveGroupBtn(row)"  class="mr-2">配置接收组</span>
            <span @click="handleReciverBtn(row)"  class="mr-2">配置接收人</span>
            <span @click="handleLevelrBtn(row)"  class="mr-2">配置通报级别</span>
            <span @click="handleToViewBtn(row)"  class="mr-2">查看</span>
            <span @click="handleToReviseBtn(row)"  class="mr-2">修改</span>
            <span @click="handleToDelete(row)"  class="mr-2">删除</span>
          </div>
        </template>
      </vxe-column>
      <template #empty>
        <span style="padding: 80px; display: block">
          <p>搜索不到数据，可能输入的关键字姿势不对！</p>
        </span>
      </template>
    </vxe-table>
    <vxe-pager
      class="py-16"
      size="mini"
      :current-page="pages.current"
      :page-size="pages.size"
      :total="pages.total"
      :page-sizes="pages.pageSizeList"
      :page-count="5"
      @page-change="pagesLimit"
    >
    </vxe-pager>
    <q-dialog v-model="field_add_alert">
      <Form-reciver
        :title="'新增指标'"
        :field="field_add"
        :type="'add'"
      ></Form-reciver>
    </q-dialog>
    <q-dialog v-model="field_group_alert">
      <Form-reciver
        :title="'配置接收组'"
        :field="field_group"
        :type="'update'"
      ></Form-reciver>
    </q-dialog>
    <q-dialog v-model="field_reciver_alert">
      <Form-reciver
        :title="'配置接收人'"
        :field="field_reciver"
        :type="'update'"
      ></Form-reciver>
    </q-dialog>
    <q-dialog v-model="field_view_alert">
      <Form-reciver
        :title="'查看指标管理'"
        :field="field_view"
        disable
      ></Form-reciver>
    </q-dialog>
    <q-dialog v-model="field_edit_alert">
      <Form-reciver
        :title="'修改指标管理'"
        :field="field_revise"
        :type="'update'"
      ></Form-reciver>
    </q-dialog>
    <q-dialog v-model="field_edit_level">
      <Form-reciver
        :title="'配置通报级别'"
        :field="field_level"
        :type="'update'"
      ></Form-reciver>
    </q-dialog>
  </div> -->
</template>

<script>
// import XEUtils from 'xe-utils'
// import FormReciver from './FormReciver.vue'

// export default {
//   /*
//    * receiveTableData 数据(必选)
//    * */
//   // props: ["receiveTableData"],
//   // components: { FormReciver },
//   data () {
//     return {
//       // 表格
//       pages: {
//         pageSizeList: [
//           10,
//           50,
//           100,
//           500,
//           1000,
//           2000,
//           { label: '全部', value: '' }
//         ],
//         total: 242,
//         current: 1,
//         size: 100,
//         align: 'right'
//       },
//       receiveTableData: [
//         {
//           id: 1,
//           indicatorName: '链路断开',
//           indicatorAlias: 'Crc错误率告警',
//           receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//           formworkId: 'SF-WEWAEFSDFRT152',
//           formwork: '磁盘坏道异常事件模板',
//           time: '2023-02-26 24:00:00',
//           receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//           associateTemplateId: '2323FSFCZSA',
//           isuse: true,
//           level: '不通报',
//           _X_ROW_KEY: 'row_9'
//         },
//         {
//           id: 2,
//           indicatorName: 'Crc错误率告警',
//           indicatorAlias: 'Crc错误率告警',
//           receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//           formworkId: 'SF-WEWAEFSDFRT152',
//           formwork: '磁盘坏道异常事件模板',
//           time: '2023-02-26 26:00:00',
//           receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//           associateTemplateId: '2323FSFCZSA',
//           isuse: true,
//           level: '不通报',
//           _X_ROW_KEY: 'row_10'
//         },
//         {
//           id: 3,
//           indicatorName: '虚拟机操作系统故障告警',
//           indicatorAlias: 'Crc错误率告警',
//           receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//           formworkId: 'SF-WEWAEFSDFRT152',
//           formwork: '磁盘坏道异常事件模板',
//           time: '2023-02-26 12:00:00',
//           receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//           associateTemplateId: '2323FSFCZSA',
//           isuse: true,
//           level: '不通报',
//           _X_ROW_KEY: 'row_11'
//         },
//         {
//           id: 4,
//           indicatorName: '远端故障告警',
//           indicatorAlias: 'Crc错误率告警',
//           receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//           formworkId: 'SF-WEWAEFSDFRT152',
//           formwork: '磁盘坏道异常事件模板',
//           time: '2023-02-26 22:00:00',
//           receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//           associateTemplateId: '2323FSFCZSA',
//           isuse: true,
//           level: '不通报',
//           _X_ROW_KEY: 'row_12'
//         },
//         {
//           id: 5,
//           indicatorName: '端口链路协商不成功',
//           indicatorAlias: 'Crc错误率告警',
//           receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//           formworkId: 'SF-WEWAEFSDFRT152',
//           formwork: '磁盘坏道异常事件模板',
//           time: '2023-02-26 27:00:00',
//           receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//           associateTemplateId: '2323FSFCZSA',
//           isuse: true,
//           level: '不通报',
//           _X_ROW_KEY: 'row_13'
//         },
//         {
//           id: 6,
//           indicatorName: '节点状态异常',
//           indicatorAlias: 'Crc错误率告警',
//           receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//           formworkId: 'SF-WEWAEFSDFRT152',
//           formwork: '磁盘坏道异常事件模板',
//           time: '2023-02-26 16:00:00',
//           receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//           associateTemplateId: '2323FSFCZSA',
//           isuse: true,
//           level: '不通报',
//           _X_ROW_KEY: 'row_14'
//         },
//         {
//           id: 7,
//           indicatorName: '主机到存储IO时延过大',
//           indicatorAlias: 'Crc错误率告警',
//           receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//           formworkId: 'SF-WEWAEFSDFRT152',
//           formwork: '磁盘坏道异常事件模板',
//           time: '2023-02-26 12:00:00',
//           receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//           associateTemplateId: '2323FSFCZSA',
//           isuse: true,
//           level: '不通报',
//           _X_ROW_KEY: 'row_15'
//         },
//         {
//           id: 8,
//           indicatorName: 'LAG发生保护切换',
//           indicatorAlias: 'Crc错误率告警',
//           receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//           formworkId: 'SF-WEWAEFSDFRT152',
//           formwork: '磁盘坏道异常事件模板',
//           time: '2023-02-26 13:00:00',
//           receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//           associateTemplateId: '2323FSFCZSA',
//           isuse: true,
//           level: '不通报',
//           _X_ROW_KEY: 'row_16'
//         }
//       ],
//       date: '2019-02-01 12:44',
//       list1: [],
//       filterName1: '',
//       field_add_alert: false,
//       field_group_alert: false,
//       field_reciver_alert: false,
//       field_view_alert: false,
//       field_edit_alert: false,
//       field_edit_level: false,

//       field: [
//         {
//           name: '告警名称',
//           field: 'indicatorName',
//           value: '',
//           required: false,
//           type: 'input',
//           unshow: false
//         },
//         {
//           name: '告警别名',
//           field: 'indicatorAlias',
//           value: '',
//           required: false,
//           type: 'input',
//           unshow: false
//         },
//         {
//           name: '接收组',
//           field: 'receivingGroup',
//           value: '',
//           required: false,
//           type: 'input',
//           unshow: true
//         },

//         {
//           name: '短信模板id',
//           field: 'formworkId',
//           value: '',
//           required: false,
//           type: 'input',
//           unshow: false
//         },
//         {
//           name: '是否启用',
//           field: 'isuse',
//           value: true,
//           required: false,
//           type: 'toggle'
//         },
//         {
//           name: '排序',
//           field: 'id',
//           value: '1',
//           required: false,
//           type: 'input',
//           unshow: false
//         }
//       ],
//       field_reciver: [
//         {
//           name: '配置接收人',
//           field: 'receivr',
//           value: [],
//           required: true,
//           type: 'select',
//           options: ['刘成涛', '谢宗霞', '李圣钟']
//         }
//       ],
//       field_group: [
//         {
//           name: '配置接收组',
//           field: 'receivingGroup',
//           value: [],
//           required: true,
//           type: 'select',
//           options: ['领航网络组', '华为网络组', '爱立信网络组']
//         }
//       ],
//       field_level: [
//         {
//           name: '配置通报级别',
//           field: 'receivingLevel',
//           value: '通报',
//           required: true,
//           type: 'select',
//           options: ['通报', '延迟通报', '不通报']
//         }
//       ],
//       field_add: [
//         {
//           name: '告警名称',
//           field: 'indicatorName',
//           value: '',
//           required: true,
//           type: 'input',
//           unshow: false
//         },
//         {
//           name: '告警别名',
//           field: 'indicatorAlias',
//           value: '',
//           required: true,
//           type: 'input',
//           unshow: false
//         },
//         {
//           name: '关联模板id',
//           field: 'associateTemplateId',
//           value: '',
//           required: true,
//           type: 'select',
//           options: ['1', '2', '3']
//         },
//         {
//           name: '是否启用',
//           field: 'isuse',
//           value: false,
//           required: false,
//           type: 'toggle'
//         }
//       ],
//       field_view: [
//         {
//           name: '指标名称',
//           field: 'indicatorName',
//           value: '',
//           required: true,
//           type: 'input',
//           unshow: false
//         },
//         {
//           name: '指标别名',
//           field: 'indicatorAlias',
//           value: '',
//           required: true,
//           type: 'input',
//           unshow: false
//         },
//         {
//           name: '关联模板id',
//           field: 'associateTemplateId',
//           value: '',
//           required: true,
//           type: 'select',
//           options: ['1', '2', '3']
//         },
//         {
//           name: '是否启用',
//           field: 'isuse',
//           value: false,
//           required: false,
//           type: 'toggle'
//         },
//         {
//           name: '短信模板',
//           field: 'formwork',
//           value: '',
//           required: false,
//           type: 'input',
//           unshow: false
//         },
//         {
//           name: '配置接收人',
//           field: 'receivr',
//           value: [],
//           required: true,
//           type: 'select',
//           options: ['领航网络组', '华为网络组', '爱立信网络组']
//         },
//         {
//           name: '配置接收组',
//           field: 'receivingGroup',
//           value: [],
//           required: true,
//           type: 'select',
//           options: ['吴美丽', '小蟹柳', '刘翠花']
//         }
//       ],
//       field_revise: [
//         {
//           name: '指标名称',
//           field: 'indicatorName',
//           value: '',
//           required: true,
//           type: 'input',
//           unshow: false
//         },
//         {
//           name: '指标别名',
//           field: 'indicatorAlias',
//           value: '',
//           required: true,
//           type: 'input',
//           unshow: false
//         },
//         {
//           name: '关联模板id',
//           field: 'associateTemplateId',
//           value: '',
//           required: true,
//           type: 'select',
//           options: ['1', '2', '3']
//         },
//         {
//           name: '是否启用',
//           field: 'isuse',
//           value: false,
//           required: false,
//           type: 'toggle'
//         },
//         {
//           name: '短信模板',
//           field: 'formwork',
//           value: '',
//           required: false,
//           type: 'input',
//           unshow: false
//         }
//       ]
//     }
//   },
//   created () {
//     this.searchEvent1()
//   },
//   watch: {
//     receiveTableData (newVal, oldVal) {
//       this.list1 = this.receiveTableData
//     }
//   },
//   methods: {
//     pagesLimit (val) {
//       console.log(val.currentPage)
//       this.pages.current = val.currentPage
//       if (val.currentPage === 2) {
//         this.receiveTableData = [
//           {
//             id: 9,
//             indicatorName: '光模块光功率低阀值告警',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 16:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_17'
//           },
//           {
//             id: 10,
//             indicatorName: '物理实体拔出',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 17:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_18'
//           },
//           {
//             id: 11,
//             indicatorName: '物理端口DOWN',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 21:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_19'
//           },
//           {
//             id: 12,
//             indicatorName: 'zookeeper健康检查告警',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 22:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_20'
//           },
//           {
//             id: 13,
//             indicatorName: 'OSS状态异常',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 16:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_21'
//           },
//           {
//             id: 14,
//             indicatorName: '链路断开',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 15:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_22'
//           },
//           {
//             id: 15,
//             indicatorName: '网管服务器与网元通讯异常',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 23:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_23'
//           },
//           {
//             id: 16,
//             indicatorName: '近端故障告警',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 18:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_24'
//           }
//         ]
//       } else {
//         this.receiveTableData = [
//           {
//             id: 1,
//             indicatorName: '链路断开',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 24:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_9'
//           },
//           {
//             id: 2,
//             indicatorName: 'Crc错误率告警',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 26:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_10'
//           },
//           {
//             id: 3,
//             indicatorName: '虚拟机操作系统故障告警',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 12:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_11'
//           },
//           {
//             id: 4,
//             indicatorName: '远端故障告警',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 22:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_12'
//           },
//           {
//             id: 5,
//             indicatorName: '端口链路协商不成功',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 27:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_13'
//           },
//           {
//             id: 6,
//             indicatorName: '节点状态异常',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 16:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_14'
//           },
//           {
//             id: 7,
//             indicatorName: '主机到存储IO时延过大',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 12:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_15'
//           },
//           {
//             id: 8,
//             indicatorName: 'LAG发生保护切换',
//             indicatorAlias: 'Crc错误率告警',
//             receivingGroup: ['领航网络组', '华为网络组', '爱立信网络组'],
//             formworkId: 'SF-WEWAEFSDFRT152',
//             formwork: '磁盘坏道异常事件模板',
//             time: '2023-02-26 13:00:00',
//             receivr: ['刘成涛', '谢宗霞', '李圣钟'],
//             associateTemplateId: '2323FSFCZSA',
//             isuse: true,
//             level: '不通报',
//             _X_ROW_KEY: 'row_16'
//           }
//         ]
//       }
//     },
//     searchEvent1 () {
//       const filterName = XEUtils.toValueString(this.filterName1)
//         .trim()
//         .toLowerCase()
//       if (filterName) {
//         const filterRE = new RegExp(filterName, 'gi')
//         // const searchProps = [
//         //   "indicatorName",
//         //   "indicatorAlias",
//         //   "formworkId",
//         // ];
//         const searchProps = ['indicatorName', 'indicatorAlias']
//         const rest = this.receiveTableData.filter((item) =>
//           searchProps.some(
//             (key) =>
//               XEUtils.toValueString(item[key])
//                 .toLowerCase()
//                 .indexOf(filterName) > -1
//           )
//         )
//         this.list1 = rest.map((row) => {
//           const item = Object.assign({}, row)
//           searchProps.forEach((key) => {
//             item[key] = XEUtils.toValueString(item[key]).replace(
//               filterRE,
//               // 不要亮点提示
//               // (match) => `<span class="keyword-lighten">${match}</span>`
//               (match) => `${match}`
//             )
//           })
//           return item
//         })
//       } else {
//         this.list1 = this.receiveTableData
//       }
//     },
//     handleToViewReciver (row) {
//       this.field_add_alert = true
//       // 点击+重置内容
//       this.field.some((value) => {
//         if (value.type === 'toggle') {
//           value.value = false
//           return
//         }
//         value.value = ''
//       })
//     },
//     handleReciveGroupBtn (row) {
//       const { receivingGroup } = row
//       // console.log(receivingGroup);
//       //   if (this.field_group.length < 1) {
//       //     this.field_group.push(this.field_view[5]);
//       //   }
//       //  this.field_group[0].type = 'select'
//       this.field_group[0].value = receivingGroup
//       this.field_group_alert = true
//     },
//     handleReciverBtn (row) {
//       const { receivr } = row
//       this.field_reciver[0].value = receivr
//       this.field_reciver_alert = true
//     },
//     handleLevelrBtn (row) {
//       const { level } = row
//       console.log(level)
//       this.field_level[0].value = level
//       this.field_edit_level = true
//     },
//     handleToViewBtn (row) {
//       const {
//         formwork,
//         indicatorAlias,
//         indicatorName,
//         receivingGroup,
//         isuse,
//         receivr,
//         associateTemplateId
//       } = row
//       this.field_view_alert = true
//       this.field_view.some((value) => {
//         switch (value.name) {
//           case this.field_view[0].name:
//             value.value = indicatorName
//             break
//           case this.field_view[1].name:
//             value.value = indicatorAlias
//             break
//           case this.field_view[2].name:
//             value.value = associateTemplateId
//             break
//           case this.field_view[3].name:
//             value.value = isuse
//             break
//           case this.field_view[4].name:
//             value.value = formwork
//             break
//           // 查看把type改成text
//           case this.field_view[5].name:
//             value.type = 'text'
//             value.value = receivingGroup.join(';')
//             break
//           case this.field_view[6].name:
//             value.type = 'text'
//             value.value = receivr.join(';')
//             break
//         }
//       })
//     },
//     handleToReviseBtn (row) {
//       this.field_edit_alert = true
//       const {
//         formwork,
//         indicatorAlias,
//         indicatorName,
//         receivingGroup,
//         isuse,
//         receivr,
//         associateTemplateId
//       } = row

//       this.field_revise.some((value) => {
//         switch (value.name) {
//           case this.field_revise[0].name:
//             value.value = indicatorName
//             break
//           case this.field_revise[1].name:
//             value.value = indicatorAlias
//             break
//           case this.field_revise[2].name:
//             value.value = associateTemplateId
//             break
//           case this.field_revise[3].name:
//             value.value = isuse
//             break
//           case this.field_revise[4].name:
//             value.value = formwork
//             break
//           // 修改把type改成select
//           case this.field_view[5].name:
//             value.type = 'select'
//             value.value = receivingGroup
//             break
//           case this.field_view[6].name:
//             value.type = 'select'
//             value.value = receivr
//             break
//         }
//       })
//     },
//     handleToDelete (row) {
//       console.log(`id:${row.id}删除调用`)
//     }
//   }
// }
</script>

<style>
.vxe-buttons--wrapper p {
 margin: 0;
 padding: 10px 30px 10px 0px;
}

.keyword-lighten {
 color: #000;
 background-color: #ffff00;
}
.ellipsis {
 padding: 10px 20px !important;
}
/* 这个类影响到验收任务管理界面，暂时注释 */
/* .vertical-middle {
 padding-bottom: 10px;
} */
/* .vxe-cell div span {
 color: #2196f3;
 cursor: pointer;
} */
.type--search {
 width: 255px;
}
.timeInput .q-field__control-container input {
 text-align: center !important;
}
.text-h6 {
 font-size: 12px !important;
}
</style>
