<template>
  <div class="p-4">
<t-card :bordered="false">
<div class="bg-white p-4" style="border-radius: 6px">
      <t-form @submit="submit">
        <div class="l-row l-col-12">
          <div class="l-row l-col-12">
            <div class="l-row l-col-3 l-items-center pl-3">
              <span>方案标题：</span>
              <t-input
                v-model="condition.theme"
                clearable
                style="width: 60%;"
              ></t-input>
            </div>
            <div class="l-row l-col-3 l-items-center ">
              <span>维护专业：</span>
              <t-select
                v-model="condition.major2"
                clearable
                :options="[{label:'计算',value:1},{label:'存储',value:2},{label:'网络',value:3},{label:'安全',value:4},{label:'网管',value:5}]"
                style="width: 60%;"
              >
              </t-select>
            </div>
            <div class="l-row l-col-3 l-items-center ">
              <span>故障告警：</span>
              <t-input
                v-model="condition.alarm"
                style="width: 60%;"
              >
              </t-input>
            </div>
            <div class="l-row l-col-3 l-items-center">
              <t-button class="column l-items-center " unelevated content="查询" type="submit"  style="height: 32px"></t-button>
            </div>
          </div>
        </div>
      </t-form>
    </div>
    <div class="bg-white p-4" style="border-radius: 6px">
      <vxe-table
        class="text-black"
        auto-resize
        keep-source
        highlight-hover-row
        highlight-hover-column
        ref="infoTable"
        id="infoTable"
        row-id='id'
        empty-text="暂无故障方案信息！"
        border="inner"
        align="left"
        max-height="600"
        size="mini"
        :column-config="{resizable: true}"
        :loading="table.loading"
        :seq-config="{startIndex: (pages.current - 1) * pages.size }"
        :checkbox-config="{reserve: true}"
        :data="table.infoData"
      >
        <vxe-table-column
          v-for="(config, index) in table.column"
          :key="index" v-bind="config"
        >
          <template v-if="config.field === 'caseType'" v-slot="{ row }">
            <span square outline size="sm" color="grey" :label="row.caseType"></span>
          </template>
          <template v-else-if="config.field === 'summary'" v-slot="{ row }">
            <span class="text-blue-grey cursor-pointer" style="padding-bottom: 2px; border-bottom: 1px solid #607d8b; letter-spacing: 2px" @click="showSummary(row.id)">{{ row.summary }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="operation" title="操作" align="left" width="150px">
          <template v-slot="{ row }">
            <div class="l-row" style="justify-content: flex-end;">
              <t-button
                          variant="text"
                          @click="downloadResult(row)"
                          class="text-mod-primary px-1"
                          >下载方案</t-button
                        >
                        <t-button
                          variant="text"
                          @click="showDetail(row.id)"
                          class="text-mod-primary px-1"
                          >详情</t-button
                        >
              <!-- <t-tooltip
              class="placement top"
              content="下载方案"
              >
              <t-button class="mr-2" theme="primary" shape="circle" variant="text" @click="downloadResult(row)">
                <ArrowDownIcon  slot="icon"/>
              </t-button>
              </t-tooltip>
              <t-tooltip
              class="placement top"
              content="详情"
              >
              <t-button  theme="primary" shape="circle" variant="text" @click="showDetail(row.id)">
                <ErrorCircleIcon slot="icon" />

              </t-button>
              </t-tooltip> -->
            </div>
          </template>
        </vxe-table-column>
      </vxe-table>
      <vxe-pager
        class="mt-12 pb-16"
        size="mini"
        :current-page="pages.current"
        :page-size="pages.size"
        :total="pages.total"
        :page-sizes="pages.pageSizeList"
        :page-count=5
        @page-change="pagesLimit">
      </vxe-pager>
    </div>
</t-card>
    <t-dialog :visible.sync="dialog.summary" v-if="dialog.summary"
    header="故障方案摘要"
      width="640px"
      @confirm="dialog.summary = false"
    @onCancel="dialog.summary = false"
      preventScrollThrough
      >
      <t-card style="border-radius: 0px; min-width: 610px; min-height: 340px" :bordered="false">
          <div style="text-indent: 2rem; letter-spacing: 2px;">{{ this.summaryInfo }}</div>
      </t-card>
    </t-dialog>
    <t-dialog :visible.sync="dialog.detail" v-if="dialog.detail"  header="告警方案详情"
    width="1000px"
    placement="center"
    @confirm="dialog.detail = false"
    @onCancel="dialog.detail = false">
      <t-card :bordered="false">
          <t-row class="row l-items-center ">
            <span class="text-mod-primary chip">工单号：</span>
            <!-- <span square outline color="blue" text-color="white" size="sm">工单号：</span> -->
            <span class="ml-2">{{ detailInfo.flowNum !== 'None' ? detailInfo.flowNum : '暂无工单号'}}</span>
          </t-row>
          <t-row class="mt-2 row l-items-center ">
            <span class="text-mod-primary chip">工单标题：</span>
            <span class="ml-2">{{ detailInfo.title }}</span>
          </t-row>
          <t-row class="mt-2 row l-items-center ">
            <span class="text-mod-primary chip">案例标题：</span>
            <span class="ml-2">{{ detailInfo.theme }}</span>
          </t-row>
          <div class="mt-2 row l-items-center ">
            <div class="l-row l-col-4 l-items-center ">
              <span class="text-mod-primary chip">公司：</span>
              <span class="ml-2">{{ detailInfo.company }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">专业：</span>
              <span class="ml-2">{{ detailInfo.major2 }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2" style="flex-wrap: nowrap;">
            <span class="text-mod-primary chip">关键字：</span>
            <t-tooltip class="placement top" :content="detailInfo.keyword">
              <span
                class="ml-2"
                style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
                >{{ detailInfo.keyword }}</span
              >
            </t-tooltip>
          </div>
          </div>
          <div class="mt-2 row l-items-center ">
            <div class="l-row l-col-4 l-items-center ">
              <span class="text-mod-primary chip">故障分类：</span>
              <span class="ml-2">{{ detailInfo.caseType }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip ">作者：</span>
              <span class="ml-2">{{ detailInfo.author }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">作者部门：</span>
              <span class="ml-2">{{ detailInfo.authorType }}</span>
            </div>
          </div>
          <div class="mt-2 row l-items-center ">
            <div class="l-row l-col-4 l-items-center ">
              <span class="text-mod-primary chip">评审专家：</span>
              <span class="ml-2">{{ detailInfo.reviewer }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">评审专家所在省：</span>
              <span class="ml-2">{{ detailInfo.reviewerProvince }}</span>
            </div>
          </div>
          <div class="mt-2 l-row l-items-center mt-2">
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">故障发生时间：</span>
              <span class="ml-2">{{ detailInfo.occurTime }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">故障闭环时间：</span>
              <span class="ml-2">{{ detailInfo.closeTime }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">审核通过时间：</span>
              <span class="ml-2">{{ detailInfo.auditTime }}</span>
            </div>
          </div>
          <div class="mt-2 row l-items-center ">
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">告警设备类型：</span>
              <span class="ml-2">{{ detailInfo.alarmDeviceType }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">告警设备厂家：</span>
              <span class="ml-2">{{ detailInfo.alarmDeviceVender }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">告警设备型号：</span>
              <span class="ml-2">{{ detailInfo.alarmDeviceModel }}</span>
            </div>
          </div>
          <div class="mt-2 row l-items-center ">
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">故障设备类型：</span>
              <span class="ml-2">{{ detailInfo.faultDeviceType }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">故障设备厂家：</span>
              <span class="ml-2">{{ detailInfo.faultDeviceVender }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">故障设备型号：</span>
              <span class="ml-2">{{ detailInfo.faultDeviceModel }}</span>
            </div>
          </div>
          <div class="mt-2 row l-items-center ">
            <span class="text-mod-primary chip">案例库摘要：</span>
          </div>
          <div class="mt-2 l-row l-items-center px-2">
            <div>{{ summaryInfo }}</div>
          </div>
          <div class="l-row l-col-12 justify-end">
            <t-button class="column l-items-center "  content="文档预览"  style="height: 32px;" @click="docPreviewEvent"></t-button>
          </div>
      </t-card>
    </t-dialog>
    <t-dialog :visible.sync="dialog.preview" v-if="dialog.preview"  header="文件预览"
        width="100%" style="height:100%"  @confirm="dialog.preview = false"
    @onCancel="dialog.preview = false">
      <t-card :bordered="false">
          <div class="scroll-y" style="height: 93vh;">
            <div ref="docPreview"></div>
          </div>
      </t-card>
    </t-dialog>
  </div>
</template>

<script>
import { getFaultCaseListAPI, downloadCaseAPI } from '@/api/inops/fault/fault'
import { downloadFault } from '@/utils/inops/file'
// eslint-disable-next-line no-unused-expressions
!(function (t) {
  function e () {
    const e = this || self
    // eslint-disable-next-line no-unused-expressions,no-sequences
    e.globalThis = e, delete t.prototype._T_
  }
  // eslint-disable-next-line no-unused-expressions
  typeof globalThis !== 'object' && (this ? e() : (t.defineProperty(t.prototype, '_T_', {
    configurable: !0,
    get: e
    // eslint-disable-next-line no-undef
  }), _T_))
}(Object))
const docx = require('docx-preview')
export default {
  name: 'faultView',
  data () {
    return {
      condition: {
        theme: '',
        alarm: '',
        major2: ''
      },
      table: {
        loading: false,
        infoData: [],
        column: [
          { type: 'checkbox', align: 'center', width: '40' },
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          {
            field: 'theme',
            title: '案例主题',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '23%'
          },
          {
            field: 'major2',
            title: '专业',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '50px'
          },
          {
            field: 'keyword',
            title: '关键字',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '15%'
          },
          {
            field: 'caseType',
            title: '故障分类',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '100px'
          },
          {
            field: 'author',
            title: '作者',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '100px'
          },
          {
            field: 'authorDept',
            title: '作者部门',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '100px'
          },
          {
            field: 'summary',
            title: '案例库摘要',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '15%'
          }
        ]
      },
      pages: {
        pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      summaryInfo: '',
      url: '',
      detailInfo: {},
      caseId: '',
      dialog: {
        summary: false,
        detail: false,
        preview: false,
        alarm: false
      }
    }
  },
  mounted () {
    this.url = process.env.VUE_APP_BASE_URL
    this.getFaultCaseList()
  },
  methods: {
    getFaultCaseList () {
      this.table.loading = true
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      getFaultCaseListAPI(params, this.condition).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.infoData = data.data.records
          this.pages.total = data.data.total
          const index = this.pages.pageSizeList.findIndex(v => v.label === '全部')
          this.pages.pageSizeList[index].value = Math.floor(this.pages.total)
          this.pages.size = data.data.size
          this.pages.current = data.data.current
          this.table.loading = false
        }
      })
      this.table.loading = false
    },
    submit () {
      this.getFaultCaseList()
    },
    pagesLimit ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.getFaultCaseList()
    },
    showSummary (id) {
      const index = this.table.infoData.findIndex(item => item.id === id)
      this.summaryInfo = this.table.infoData[index].summary
      this.dialog.summary = true
    },
    showDetail (id) {
      this.caseId = id
      const index = this.table.infoData.findIndex(item => item.id === id)
      this.detailInfo = this.table.infoData[index]
      this.summaryInfo = this.table.infoData[index].summary
      this.dialog.detail = true
    },
    docPreviewEvent () {
      downloadCaseAPI(this.caseId).then(res => {
        this.dialog.preview = true
        this.$nextTick(() => {
          docx.renderAsync(res.data, this.$refs.docPreview, null, {
            className: 'doc', // 默认和文档样式类的类名/前缀
            inWrapper: true, // 启用围绕文档内容渲染包装器
            ignoreWidth: false, // 禁止页面渲染宽度
            ignoreHeight: false, // 禁止页面渲染高度
            ignoreFonts: false, // 禁止字体渲染
            breakPages: true, // 在分页符上启用分页
            ignoreLastRenderedPageBreak: true, // 禁用lastRenderedPageBreak元素的分页
            experimental: false, // 启用实验性功能（制表符停止计算）
            trimXmlDeclaration: true, // 如果为真，xml声明将在解析之前从xml文档中删除
            debug: false // 启用额外的日志记录
          })
        })
      })
    },
    downloadResult (row) {
      const exportUrl = `${this.url}/inops/faultCase/download/${row.id}`
      const fileName = `${row.theme}.docx`
      downloadFault(exportUrl, fileName)
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .docx-wrapper
  background: transparent
  padding: 15px 0px
  height: 100%
  display: flex
  flex-flow: column
  align-items: center
.chip
  padding-right: 11px;
  width: 100px;
  border: 1px solid blue;
  border-radius: 5px;
  font-size: 12px;
  padding-left: 8px;
  height: 20px;
  line-height: 18px;
  margin: 0 5px;
  white-space: nowrap;
</style>
