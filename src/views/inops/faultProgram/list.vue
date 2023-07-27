<template>
    <div class="p-4" style="overflow: hidden">
      <!-- <q-tabs v-show="true" v-model="tab">
        <q-tab name="list"></q-tab>
        <q-tab name="edit"></q-tab>
      </q-tabs> -->
      <!-- <q-tab-panels animated v-model="tab">
        <q-tab-panel
          class="p-0"
          name="list"
          style="background-color: transparent"
        > -->
      <t-swiper
        :current="currentTab"
        :navigation="{ showSlideBtn: 'never' }"
        :autoplay="false"
      >
        <t-swiper-item>
          <t-card :bordered="false">
            <div>
              <div class="bg-white p-4" style="border-radius: 6px">
                <t-form @submit="submit">
                  <div class="l-row l-col-12">
                    <div class="l-row l-col-3 l-items-center pl-3">
                      <span>方案标题：</span>
                      <t-input
                        v-model="condition.theme"
                        clearable
                        style="width: 60%"
                      ></t-input>
                    </div>
                    <div class="l-row l-col-3 l-items-center">
                      <span>方案作者：</span>
                      <t-input
                        v-model="condition.author"
                        clearable
                        style="width: 60%"
                      ></t-input>
                    </div>
                    <div class="l-row l-col-3 l-items-center">
                      <span>维护专业：</span>
                      <t-select
                        v-model="condition.major2"
                        clearable
                        :options="[
                          { label: '计算', value: 1 },
                          { label: '存储', value: 2 },
                          { label: '网络', value: 3 },
                          { label: '安全', value: 4 },
                          { label: '网管', value: 5 },
                        ]"
                        style="width: 60%"
                      />
                    </div>
                    <div class="l-row l-col-3 l-items-center">
                      <t-button
                        class="l-items-center mr-4"
                        content="查询"
                        type="submit"
                        style="height: 32px"
                      ></t-button>
                      <t-button
                        class="l-items-center"
                        content="新增"
                        style="height: 32px"
                        @click="add"
                      ></t-button>
                    </div>
                  </div>
                </t-form>
              </div>
              <div class="bg-white p-4" style="border-radius: 6px">
                <div>
                  <vxe-table
                    class="text-black"
                    auto-resize
                    keep-source
                    highlight-hover-row
                    highlight-hover-column
                    ref="infoTable"
                    id="infoTable"
                    row-id="id"
                    empty-text="暂无方案信息！"
                    border="inner"
                    align="left"
                    max-height="600"
                    size="mini"
                    :column-config="{ resizable: true }"
                    :loading="table.loading"
                    :seq-config="{
                      startIndex: (pages.current - 1) * pages.size,
                    }"
                    :checkbox-config="{ reserve: true }"
                    :data="table.infoData"
                  >
                    <vxe-table-column
                      v-for="(config, index) in table.column"
                      :key="index"
                      v-bind="config"
                    >
                      <template
                        v-if="config.field === 'caseType'"
                        v-slot="{ row }"
                      >
                        <!-- <q-chip
                          square
                          outline
                          size="sm"
                          color="grey"
                          :label="row.caseType"
                        ></q-chip> -->
                        <t-tooltip :content="row.caseType">
                          <div class="px-2 text-mod-secondary" style="max-width: 80px;border:1px solid gray;border-radius: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ">
                            {{ row.caseType }}
                          </div>
        </t-tooltip>
                      </template>
                      <template
                        v-else-if="config.field === 'summary'"
                        v-slot="{ row }"
                      >
                        <span
                          class="text-blue-grey cursor-pointer"
                          style="
                            padding-bottom: 2px;
                            border-bottom: 1px solid #607d8b;
                            letter-spacing: 1.5px;
                          "
                          @click="showSummary(row.id)"
                          >{{ row.summary }}</span
                        >
                      </template>
                    </vxe-table-column>
                    <vxe-table-column
                      field="operation"
                      title="操作"
                      align="center"
                      width="320px"
                    >
                      <template v-slot="{ row }">
                        <div class="l-row" style="justify-content: flex-end;">
                          <t-button
                            variant="text"
                            @click="edit(row.id)"
                            class="text-mod-primary px-1"
                            >编辑</t-button
                          >
                          <t-button
                            variant="text"
                            @click="bindEvent(row)"
                            class="text-mod-primary px-1"
                            >绑定告警</t-button
                          >
                          <t-button
                            variant="text"
                            @click="downloadResult(row)"
                            class="text-mod-primary px-1"
                            >下载方案</t-button
                          >
                          <t-button
                            variant="text"
                            @click="remove(row.id)"
                            class="text-mod-primary px-1"
                            >删除方案</t-button
                          >
                          <t-button
                            variant="text"
                            @click="showDetail(row.id)"
                            class="text-mod-primary px-0"
                            >详情</t-button
                          >
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
                    :page-count="5"
                    @page-change="pagesLimit"
                  >
                  </vxe-pager>
                </div>
              </div>
            </div>
          </t-card>
        </t-swiper-item>

        <!-- </q-tab-panel>
        <q-tab-panel -->
        <!-- class="p-0"
          name="edit"
          style="background-color: transparent"
        > -->
        <t-swiper-item>
          <t-card :bordered="false">
            <div class="p-4">
              <div class="l-row l-items-center">
                <EditIcon></EditIcon>
                <span
                  class="text-mod-primary ml-2"
                  style="font-size: 16px; letter-spacing: 2px"
                  >故障方案编排</span
                >
              </div>
              <div class="l-row mt-4 l-items-center">
                <span class="mr-8 text-blue-grey field_ls">基本信息</span>
                <!-- <q-icon
                class="mr-4"
                name="double_arrow"
                color="blue-grey"
                size="18px"
              ></q-icon> -->
                <t-divider class="bg-blue-grey-3" style="width: 90%" />
              </div>
              <div class="pl-4">
                <div class="l-row mt-4">
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">案例主题：</span>
                    <t-input
                      v-model="editor.theme"
                      clearable
                      style="width: 60%"
                    >
                    </t-input>
                  </div>
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">工单标题</span>
                    <t-input
                      v-model="editor.title"
                      clearable
                      style="width: 60%"
                    ></t-input>
                  </div>
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">公司：</span>
                    <t-input
                      v-model="editor.company"
                      clearable
                      style="width: 60%"
                    ></t-input>
                  </div>
                </div>
                <div class="l-row mt-4">
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">专业：</span>
                    <t-select
                      v-model="editor.major2"
                      clearable
                      :options="[
                        { label: '存储', value: 1 },
                        { label: '网络设备', value: 2 },
                        { label: '服务器', value: 3 },
                        { label: '虚拟机', value: 4 },
                        { label: '网管', value: 5 },
                        { label: '安全', value: 6 },
                      ]"
                      style="width: 60%"
                    ></t-select>
                  </div>
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">关键字：</span>
                    <t-input
                      v-model="editor.keyword"
                      clearable
                      style="width: 60%"
                    ></t-input>
                  </div>
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">软件版本：</span>
                    <t-input
                      v-model="editor.softwareVersion"
                      clearable
                      style="width: 60%"
                    ></t-input>
                  </div>
                </div>
                <div class="l-row mt-4">
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">作者：</span>
                    <t-input
                      v-model="editor.author"
                      clearable
                      style="width: 60%"
                    ></t-input>
                  </div>
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">作者部门：</span>
                    <t-input
                      v-model="editor.authorDept"
                      clearable
                      style="width: 60%"
                    ></t-input>
                  </div>
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">评审专家：</span>
                    <t-input
                      v-model="editor.reviewer"
                      clearable
                      style="width: 60%"
                    ></t-input>
                  </div>
                </div>
                <div class="l-row mt-4">
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">评审专家所在省：</span>
                    <t-input
                      v-model="editor.reviewerProvince"
                      clearable
                      style="width: 60%"
                    ></t-input>
                  </div>
                  <div class="l-row l-col-4 l-items-center mt-2">
                    <span class="field_ls l-col-4">故障发生时间：</span>
                    <t-date-picker
                      enable-time-picker
                      clearable
                      v-model="editor.occurTime"
                      style="width: 60%"
                      :presets="{ 现在: new Date() }"
                    />
                  </div>
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">故障闭环时间：</span>
                    <t-date-picker
                      enable-time-picker
                      clearable
                      v-model="editor.closeTime"
                      style="width: 60%"
                      :presets="{ 现在: new Date() }"
                    />
                  </div>
                </div>
                <div class="l-row mt-4">
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">审核通过时间：</span>
                    <t-date-picker
                      enable-time-picker
                      clearable
                      v-model="editor.auditTime"
                      style="width: 60%"
                      :presets="{ 现在: new Date() }"
                    />
                  </div>
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">告警设备类型：</span>
                    <t-select
                      v-model="editor.alarmDeviceType"
                      :options="[
                        {
                          label: '存储服务器',
                          value: 0,
                        },
                        { label: '存储EOR ', value: 1 },
                        { label: '虚拟化平台', value: 2 },
                        { label: '防火墙', value: 3 },
                        { label: '计算服务器', value: 4 },
                        { label: 'VIM ', value: 5 },
                        { label: '存储TOR ', value: 6 },
                        { label: '其他', value: 7 },
                        { label: '业务TOR ', value: 8 },
                        { label: '管理TOR ', value: 9 },
                        { label: 'PIM ', value: 10 },
                        { label: '负载均衡', value: 11 },
                        { label: '业务EOR', value: 12 },
                        { label: 'SDN ', value: 13 },
                        { label: '管理EOR ', value: 14 },
                        { label: 'EOR配对路由器', value: 15 },
                        { label: 'vSwitch', value: 16 },
                        { label: 'IS ', value: 17 },
                        { label: '硬件管理TOR', value: 18 },
                        { label: '分光器', value: 19 },
                        { label: 'Waf', value: 20 },
                      ]"
                      style="width: 60%"
                    >
                    </t-select>
                  </div>
                  <div class="l-row l-col-4 l-items-center mt-2">
                    <span class="field_ls l-col-4">告警设备厂家：</span>
                    <t-input
                      v-model="editor.alarmDeviceVender"
                      clearable
                      style="width: 60%"
                    >
                    </t-input>
                  </div>
                </div>
                <div class="l-row mt-4">
                  <div class="l-row l-col-4 l-items-center mt-2">
                    <span class="field_ls l-col-4">告警设备型号：</span>
                    <t-input
                      v-model="editor.alarmDeviceModel"
                      clearable
                      style="width: 60%"
                    >
                    </t-input>
                  </div>
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">故障设备类型：</span>
                    <t-select
                      v-model="editor.faultDeviceType"
                      :options="[
                        { label: '存储服务器', value: 0 },
                        {
                          label: '存储EOR',
                          value: 1,
                        },
                        { label: '虚拟化平台', value: 2 },
                        { label: '防火墙', value: 3 },
                        { label: '计算服务器', value: 4 },
                        { label: 'VIM ', value: 5 },
                        { label: '存储TOR ', value: 6 },
                        { label: '其他', value: 7 },
                        { label: '业务TOR ', value: 8 },
                        { label: '管理TOR ', value: 9 },
                        { label: 'PIM ', value: 10 },
                        { label: '负载均衡', value: 11 },
                        { label: '业务EOR', value: 12 },
                        { label: 'SDN ', value: 13 },
                        { label: '管理EOR ', value: 14 },
                        { label: 'EOR配对路由器', value: 15 },
                        { label: 'vSwitch', value: 16 },
                        { label: 'IS ', value: 17 },
                        { label: '硬件管理TOR', value: 18 },
                        { label: '分光器', value: 19 },
                        { label: 'Waf', value: 20 },
                      ]"
                      style="width: 60%"
                    >
                    </t-select>
                  </div>
                  <div class="l-row l-col-4 l-items-center mt-2">
                    <span class="field_ls l-col-4">故障设备厂家：</span>
                    <t-input
                      v-model="editor.faultDeviceVender"
                      clearable
                      style="width: 60%"
                    >
                    </t-input>
                  </div>
                </div>
                <div class="l-row mt-4">
                  <div class="l-row l-col-4 l-items-center mt-2">
                    <span class="field_ls l-col-4">故障设备型号：</span>
                    <t-input
                      v-model="editor.faultDeviceModel"
                      clearable
                      style="width: 60%"
                    >
                    </t-input>
                  </div>
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">故障所在大区：</span>
                    <t-input
                      v-model="editor.occurrenceArea"
                      clearable
                      style="width: 60%"
                    >
                    </t-input>
                  </div>
                  <div class="l-row l-col-4 l-items-center">
                    <span class="field_ls l-col-4">故障分类：</span>
                    <t-select
                      v-model="editor.caseType"
                      :options="caseType"
                      style="width: 60%"
                    ></t-select>
                  </div>
                </div>
              </div>
              <div class="p-4 mt-4" style="border: 1px solid #6cabff">
                <div class="l-items-center justify-center">
                  <div
                    class="l-row l-items-center"
                    style="flex-direction: column"
                  >
                    <t-upload
                      @input="uploadFile"
                      v-show="false"
                      ref="qFile"
                      v-model="dataFile"
                    ></t-upload>
                    <!-- <q-file
                    v-show="false"
                    ref="qFile"
                    v-model="dataFile"
                    label="Standard"
                    @input="uploadFile"
                  /> -->
                    <t-button
                      class="ml-2"
                      variant="text"
                      content="上传文件"
                      size="small"
                      @click="focusQFile"
                      ><AddIcon slot="icon"
                    /></t-button>
                  </div>
                  <div class="text-grey" style="text-align: center">
                    仅支持上传word文档（格式为docx）
                  </div>
                </div>
              </div>
              <div class="row l-items-center" style="margin-top: 30px">
                <span class="mr-8 text-blue-grey field_ls">案例库摘要</span>
                <!-- <q-icon
                class="mr-4"
                name="double_arrow"
                color="blue-grey"
                size="18px"
              ></q-icon> -->
                <t-divider class="bg-blue-grey-3" style="width: 90%" />
              </div>
              <div class="pl-4">
                <div class="mt-4">
                  <!-- <span class="field_ls">案例库摘要：</span> -->
                  <div>
                    <textarea
                      class="textarea_class"
                      v-model="editor.summary"
                      rows="4"
                      style="width: 100%; resize: none"
                      placeholder="请输入案例库摘要..."
                    ></textarea>
                  </div>
                </div>
              </div>
              <div class="mt-4 pl-4 row l-items-center justify-end">
                <t-button
                  class="mr-4"
                  content="保存方案"
                  @click="save"
                ></t-button>
                <t-button ghost content="返回" @click="goBack"></t-button>
              </div>
            </div>
          </t-card>
        </t-swiper-item>
      </t-swiper>

      <!-- </q-tab-panel>
      </q-tab-panels> -->
      <t-dialog
        v-if="dialog.summary"
        :visible.sync="dialog.summary"
        header="故障方案摘要"
        width="640px"
        preventScrollThrough
        @confirm="dialog.summary = false"
        @onCancel="dialog.summary = false"
      >
        <t-card
          style="border-radius: 0px; min-width: 610px; min-height: 340px"
          :bordered="false"
        >
          <div style="text-indent: 2rem; letter-spacing: 2px">
            {{ this.summaryInfo }}
          </div>
        </t-card>
      </t-dialog>
      <t-dialog
        v-if="dialog.detail"
        :visible.sync="dialog.detail"
        header="告警方案详情"
        placement="center"
        width="1000px"
        @confirm="dialog.detail = false"
        @onCancel="dialog.detail = false"
      >
        <t-card :bordered="false">
          <div class="row l-items-center">
            <span class="text-mod-primary chip">工单号：</span>
            <!-- <span square outline color="blue" text-color="white" size="sm">工单号：</span> -->
            <span class="ml-2">{{
              detailInfo.flowNum !== "None" ? detailInfo.flowNum : "暂无工单号"
            }}</span>
          </div>
          <div class="mt-2 row l-items-center">
            <span class="text-mod-primary chip">工单标题：</span>
            <span class="ml-2">{{ detailInfo.title }}</span>
          </div>
          <div class="mt-2 row l-items-center">
            <span class="text-mod-primary chip">案例标题：</span>
            <span class="ml-2">{{ detailInfo.theme }}</span>
          </div>
          <div class="mt-2 row l-items-center">
            <div class="l-row l-col-4 l-items-center">
              <span class="text-mod-primary chip">公司：</span>
              <span class="ml-2">{{ detailInfo.company }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">专业：</span>
              <span class="ml-2">{{ detailInfo.major2 }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2" style="flex-wrap: nowrap">
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
          <div class="mt-2 row l-items-center">
            <div class="l-row l-col-4 l-items-center">
              <span class="text-mod-primary chip">故障分类：</span>
              <span class="ml-2">{{ detailInfo.caseType }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">作者：</span>
              <span class="ml-2">{{ detailInfo.author }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">作者部门：</span>
              <span class="ml-2">{{ detailInfo.authorType }}</span>
            </div>
          </div>
          <div class="mt-2 row l-items-center">
            <div class="l-row l-col-4 l-items-center">
              <span class="text-mod-primary chip">评审专家：</span>
              <span class="ml-2">{{ detailInfo.reviewer }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center mt-2">
              <span class="text-mod-primary chip">评审专家所在省：</span>
              <span class="ml-2">{{ detailInfo.reviewerProvince }}</span>
            </div>
          </div>
          <div class="mt-2 l-row l-items-center mt-2">
            <div class="l-row l-col-4 l-items-center">
              <span class="text-mod-primary chip">故障发生时间：</span>
              <span class="ml-2">{{ detailInfo.occurTime }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center">
              <span class="text-mod-primary chip">故障闭环时间：</span>
              <span class="ml-2">{{ detailInfo.closeTime }}</span>
            </div>
            <div class="l-row l-col-4 l-items-center">
              <span class="text-mod-primary chip">审核通过时间：</span>
              <span class="ml-2">{{ detailInfo.auditTime }}</span>
            </div>
          </div>
          <div class="mt-2 row l-items-center">
            <div class="l-row l-col-4 l-items-center">
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
          <div class="mt-2 row l-items-center">
            <div class="l-row l-col-4 l-items-center">
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
          <div class="mt-2 row l-items-center">
            <span class="text-mod-primary chip">案例库摘要：</span>
          </div>
          <div class="mt-2 l-row l-items-center px-2">
            <div>{{ summaryInfo }}</div>
          </div>
          <div class="l-row l-col-12 justify-end">
            <t-button
              class="l-column l-items-center"
              content="文档预览"
              style="height: 32px"
              @click="docPreviewEvent"
            ></t-button>
          </div>
        </t-card>
      </t-dialog>
      <t-dialog
        v-if="dialog.alarm"
        :visible.sync="dialog.alarm"
        header="告警列表"
        @confirm="dialog.alarm = false"
        @onCancel="dialog.alarm = false"
        width="840"
      >
        <t-card
          style="border-radius: 0px; min-width: 800px; max-height: 720px"
          :bordered="false"
        >
          <div>
            <t-form class="l-row" @submit="alarmSubmit">
              <div class="l-row l-items-center">
                <span>匹配字段：</span>
                <t-select
                  v-model="alarmField"
                  :options="[
                    { label: '告警名称', value: 0 },
                    { label: '告警内容', value: 1 },
                  ]"
                  style="width: 200px"
                ></t-select>
              </div>
              <div class="l-row l-items-center ml-2">
                <span>匹配内容：</span>
                <t-input
                  v-model="alarmName"
                  clearable
                  style="width: 200px"
                ></t-input>
              </div>
              <t-button class="ml-4" type="submit"
                ><SearchIcon slot="icon"></SearchIcon
              ></t-button>
              <t-button
                class="l-column l-items-center mr-4 ml-4"
                content="新增告警"
                color="blue"
                style="height: 32px"
                @click="insertRow(0)"
              ></t-button>
            </t-form>
          </div>
          <div class="mt-4">
          <vxe-table
            auto-resize
            keep-source
            highlight-hover-row
            highlight-hover-column
            resizable
            ref="alarmTable"
            class="mt-4"
            id="alarmTable"
            row-id="id"
            empty-text="暂无告警信息！"
            border="inner"
            align="left"
            max-height="400"
            size="mini"
            :loading="alarmTable.loading"
            :seq-config="{
              startIndex: (alarmPages.current - 1) * alarmPages.size,
            }"
            :checkbox-config="{ reserve: true }"
            :edit-config="{
              trigger: 'click',
              mode: 'cell',
              icon: 'vxe-icon-edit',
              showStatus: true,
            }"
            :data="alarmTable.infoData"
          >
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
            <vxe-table-column type="seq" width="60"></vxe-table-column>
            <vxe-table-column
              field="name"
              title="告警名称"
              align="left"
              show-header-overflow
              show-overflow
              :edit-render="{}"
            >
              <template #edit="{ row }">
                <vxe-input v-model="row.name" type="text"></vxe-input>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="matchCondition"
              title="判断条件"
              align="left"
              show-header-overflow
              show-overflow
              :edit-render="{}"
            >
              <template #edit="{ row }">
                <vxe-select v-model="row.matchCondition" transfer>
                  <vxe-option value="等于" label="等于"></vxe-option>
                  <vxe-option value="包括" label="包括"></vxe-option>
                </vxe-select>
              </template>
            </vxe-table-column>
            <vxe-table-column field="operation" align="center">
              <template v-slot="{ row }">
                <t-button
                  v-show="row.isAdd"
                  class="mr-4"
                  clearable
                  content="保存"
                  @click="saveAlarmEnum(row)"
                />
                <t-button
                  v-show="row.isAdd"
                  theme="danger"
                  class="mr-4"
                  clearable
                  content="取消"
                  @click="removeParam(row)"
                />
                <t-button
                  v-show="!row.isAdd"
                  theme="danger"
                  ghost
                  content="删除"
                  @click="delAlarmEnum(row)"
                />
              </template>
            </vxe-table-column>
          </vxe-table>
          </div>
          <div class="l-row l-col-12 justify-end mt-4">
            <t-button clearable content="确认" @click="bindConfirm"></t-button>
          </div>
        </t-card>
      </t-dialog>
      <t-dialog
        v-if="dialog.preview"
        header="文件预览"
        @confirm="dialog.preview = false"
        @onCancel="dialog.preview = false"
        width="100%"
        style="height: 100%"
      >
        <t-card :bordered="false">
          <div class="scroll-y" style="height: 93vh">
            <div ref="docPreview"></div>
          </div>
        </t-card>
      </t-dialog>
    </div>
</template>

<script>
import {
  getFaultCaseListAPI,
  getFaultCaseByIdAPI,
  saveFaultCaseAPI,
  uploadCaseAPI,
  delFaultCaseAPI,
  downloadCaseAPI,
  alarmEnumListAPI,
  addAlarmEnumAPI,
  updateBindingAPI,
  delAlarmEnumAPI,
  getBindingAlarmAPI
} from '@/api/inops/fault/fault'
import {
  AddIcon,
  SearchIcon,
  EditIcon
} from 'tdesign-icons-vue'
import { formatTime } from '@/utils/inops/dateUtils'
import { downloadFault } from '@/utils/inops/file'
// eslint-disable-next-line no-unused-expressions
!(function (t) {
  function e () {
    const e = this || self;
    // eslint-disable-next-line no-unused-expressions,no-sequences
    (e.globalThis = e), delete t.prototype._T_
  }
  // eslint-disable-next-line no-unused-expressions
  typeof globalThis !== 'object' &&
    (this
      ? e()
      : (t.defineProperty(t.prototype, '_T_', {
        configurable: !0,
        get: e
        // eslint-disable-next-line no-undef
      }), _T_))
})(Object)
const docx = require('docx-preview')
export default {
  name: 'list',
  components: {
    AddIcon,
    SearchIcon,
    EditIcon

  },
  data () {
    return {
      url: '',
      tab: 'list',
      alarmField: '告警名称',
      condition: {
        theme: '',
        author: '',
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
        pageSizeList: [
          10,
          50,
          100,
          500,
          1000,
          2000,
          { label: '全部', value: '' }
        ],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      caseType: [
        '故障处理',
        '参数配置',
        '配置修改',
        '故障恢复',
        '问题处理',
        '硬件故障',
        '参数调整',
        '工程案例',
        '质量异常',
        '数据库同步',
        '账户登录异常分析',
        '配置问题',
        '软件',
        '存储',
        '告警处理',
        '测试',
        '资源配置类',
        '故障恢复、故障处理',
        '故障修复',
        '告警上报',
        '纳管失败',
        'PIM',
        'VIM',
        '分布式存储',
        '数据库',
        '虚拟机',
        '安全合规',
        '交换机板卡自动重启',
        '路由选路错误导致BGP协议中断',
        '告警恢复',
        'SDNC',
        '软件故障',
        '性能分析',
        '设备下电',
        'NFVO+参数配置',
        'NFVO',
        '网元 接口地址',
        '系统bug',
        '客户端通信故障',
        '组网优化',
        '业务模型，参数配置',
        '虚机',
        '存储硬件故障',
        '告警清除',
        '网元容量占用率',
        '账号密码',
        '快照优化',
        '硬件问题，HA告警',
        '硬件版本',
        '端口错包',
        '网管',
        '端口丢包',
        '数据',
        '配置变更',
        'SDN',
        '系统硬件',
        '系统软件',
        '故障处理 ',
        '电源模块',
        '故障排查',
        '计算主机',
        '硬件更换',
        '问题解决',
        '数据异常',
        '配置类',
        '无法查询报表',
        '组件漏洞',
        '版本兼容',
        '系统缺陷',
        '设备隐患',
        ' 服务器',
        '根因分析',
        '安全',
        '配对路由器单边BFD会话DOWN',
        '内存使用率过高',
        '防火墙',
        '告警',
        '端口故障',
        '日常运维',
        '扩容',
        '组网隐患',
        '故障分析',
        '告警优化',
        '虚交换机端口',
        '故障处理上报',
        '版本问题',
        'LACP',
        '虚拟化平台',
        'VIM告警',
        '案例分类：故障恢复',
        '案例分类：工程扩容',
        '工程扩容',
        '案例分类：硬件故障',
        '网络设备',
        '系统时钟改变',
        '业务模型 参数配置',
        '内存异常',
        '网元实例化',
        '容器故障',
        '设备缺陷',
        '设备倒换',
        'IPS/IDS威胁',
        '硬件问题',
        '服务质量异常',
        '网络故障',
        '资源上报',
        '设备参数',
        '案例分类：故障恢复 ',
        '资源核查',
        '测试案例分类',
        '界面显示',
        '系统备份',
        '参数修改',
        '软件版本问题',
        '服务器通信异常',
        '参数优化',
        '系统盘容量优化',
        '北向问题处理',
        '问题整改',
        ' 配置问题',
        '版本降级',
        '时延偏高',
        'OSS告警上报异常',
        '测试分类',
        '版本升级',
        '问题分析',
        '隐患问题',
        'neutron',
        '服务器',
        '案例分类：告警配置',
        'FW策略配置',
        '网络',
        '数据配置',
        '关于华中大区中兴资源池存储资源空间负值处理案例',
        '主板故障',
        '电源故障',
        '风扇故障',
        '故障恢复 ',
        '软件问题',
        '连通异常',
        '资源回收',
        '修改节点用户密码',
        '策略配置',
        '账号被锁定',
        'BMC错误',
        '重启网络服务报错',
        '服务器开机报错',
        '网口丢包',
        'OM告警',
        '非故障类',
        '北向上报',
        '硬盘故障',
        '服务器重启',
        '修改密码',
        '电源模块故障',
        'CEE 6',
        '数据缺失',
        '数据一致性审计',
        '资源文件',
        '资源完整性',
        '告警处理 ',
        '巡检任务',
        '配置优化',
        '服务异常',
        '巡检风险项',
        '告警类分析',
        '系统硬件或数据配置',
        '负荷高',
        '网络断链',
        '故障原因分析',
        '故障案例',
        '网络云',
        '磁盘故障',
        '虚拟机故障',
        '进程吊死',
        '端口倒换触发',
        '审计',
        '操作指导',
        '问题排查',
        '容灾倒换演练',
        '备份',
        '参数配置 ',
        '进程异常',
        'NFVO+',
        '工具安装',
        'deleted卷清理',
        '资源利用率',
        '版本漏洞',
        '虚拟机异常 ',
        '坏道',
        '例行维护异常',
        '硬件故障 ',
        '性能监控',
        '故障告警分析',
        'SDN故障',
        '设备告警分析定位',
        '系统密码',
        '数据库条目更新',
        '网卡、端口、故障',
        'NTP',
        'NTP ',
        '硬件异常',
        '数据库空间',
        '服务器告警',
        '服务器网卡异常',
        '误告警',
        '硬件配置',
        '经验总结',
        '亚健康',
        '虚拟机HA流程',
        '证书问题',
        '内存占用问题',
        '服务器告警上报eSight',
        '故障处理问题',
        '存储网络丢包',
        '路由器',
        '光模块整体功能失效',
        'VLAN内MAC地址漂移',
        '虚拟机审计问题 ',
        '网元通信异常',
        '网元访问闪断',
        'NTP不同步',
        '虚拟层',
        '租户创建问题',
        '通信异常问题',
        '故障定位',
        '收不到LACP协商报文',
        '批量修改tecs节点密码',
        '服务器内存故障',
        '巨页内容填写错误',
        '因堆叠线问题导致',
        '服务进程锁死',
        '网络丢包',
        'VNFM设备因空间目录以使用100%',
        '告警接入问题',
        'acl策略',
        '存储后端异常',
        '数据库数据与前台数据不一致',
        '进程服务异常',
        '组件故障',
        '倒换演练',
        '性能类',
        '告警类',
        '维护',
        '性能告警',
        '性能指标',
        '版本参数',
        '系统配置',
        '写磁盘时延高',
        '虚机状态',
        '重置密码',
        '新建虚机',
        '风险问题类',
        '机制优化',
        '功能缺陷'
      ],
      summaryInfo: '',
      detailInfo: {},
      alarmName: '',
      alarmTable: {
        loading: false,
        data: [],
        infoData: []
      },
      alarmPages: {
        pageSizeList: [
          10,
          50,
          100,
          500,
          1000,
          2000,
          { label: '全部', value: '' }
        ],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      currentTab: 0,
      bindingCase: [],
      nativeTime: {
        auditTime: '',
        occurTime: '',
        closeTime: ''
      },
      editor: {
        flowNum: '',
        title: '',
        theme: '',
        company: '',
        major2: '',
        keyword: '',
        caseType: '',
        alarmDeviceType: '',
        alarmDeviceVender: '',
        alarmDeviceModel: '',
        softwareVersion: '',
        faultDeviceType: '',
        faultDeviceVender: '',
        faultDeviceModel: '',
        occurrenceArea: '',
        auditTime: '',
        closeTime: '',
        occurTime: '',
        author: '',
        authorDept: '',
        reviewer: '',
        reviewerProvince: '',
        summary: ''
      },
      opratorType: '',
      caseId: '',
      caseName: '',
      dataFile: null,
      formData: new FormData(),
      dialog: {
        summary: false,
        detail: false,
        alarm: false,
        preview: true
      }
    }
  },
  mounted () {
    this.url = process.env.VUE_APP_BASE_URL
    this.getFaultCaseList()
    this.getAlarmEnumList()
  },
  watch: {
    opratorType: {
      handler (newVal) {
        if (newVal === 'add') {
          this.dataFile = null
          this.formData = new FormData()
        }
      }
    }
  },
  filters: {
    filterTime (value) {
      return formatTime(value)
    }
  },
  methods: {
    getFaultCaseList () {
      this.table.loading = true
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      getFaultCaseListAPI(params, this.condition).then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.table.infoData = data.data.records
          this.pages.total = data.data.total
          const index = this.pages.pageSizeList.findIndex(
            (v) => v.label === '全部'
          )
          this.pages.pageSizeList[index].value = Math.floor(this.pages.total)
          this.pages.size = data.data.size
          this.pages.current = data.data.current
          this.table.loading = false
        }
      })
      this.table.loading = false
    },
    getFaultCaseById (id) {
      getFaultCaseByIdAPI(id).then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.editor = data.data
        }
      })
    },
    getAlarmEnumList () {
      alarmEnumListAPI().then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.alarmTable.data = data.data
          this.alarmTable.infoData = data.data
        }
      })
    },
    async getBindingAlarm (id) {
      await getBindingAlarmAPI(id).then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.bindingCase = data.data
        }
      })
    },
    submit () {
      this.getFaultCaseList()
    },
    pagesLimit ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.getFaultCaseList()
    },
    alarmSubmit () {
      this.alarmTable.infoData = this.alarmTable.data.filter((item) => {
        return item.name.indexOf(this.alarmName) > -1
      })
    },
    add () {
      this.opratorType = 'add'
      this.editor = {
        flowNum: '',
        title: '',
        theme: '',
        company: '',
        major2: '',
        keyword: '',
        caseType: '',
        alarmDeviceType: '',
        alarmDeviceVender: '',
        alarmDeviceModel: '',
        softwareVersion: '',
        faultDeviceType: '',
        faultDeviceVender: '',
        faultDeviceModel: '',
        occurrenceArea: '',
        auditTime: '',
        closeTime: '',
        occurTime: '',
        author: '',
        authorDept: '',
        reviewer: '',
        reviewerProvince: '',
        summary: ''
      }
      this.tab = 'edit'
      this.currentTab = 1
      this.caseId = ''
    },
    edit (id) {
      this.caseId = ''
      this.opratorType = 'edit'
      this.getFaultCaseById(id)
      this.currentTab = 1
      this.tab = 'edit'
    },
    save () {
      saveFaultCaseAPI(this.editor).then(async (res) => {
        const { data } = res
        if (data.code === 200) {
          this.caseId = data.data
          if (this.dataFile !== null) {
            await uploadCaseAPI(this.caseId, this.formData).then(
              async (res) => {
                const { data } = res
                if (data.code !== 200) {
                  this.$message.error({ content: '文件上传失败', placement: 'center' })
                  return false
                }
              }
            )
          }
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.goBack()
        }
      })
    },
    remove (id) {
      this.$XModal.confirm('确定删除该方案吗？').then((type) => {
        if (type === 'confirm') {
          delFaultCaseAPI(id).then((res) => {
            const { data } = res
            if (data.code === 200) {
              this.$message.success({ content: '删除成功', placement: 'center' })
              this.getFaultCaseList()
            }
          })
        }
      })
    },
    async insertRow (row) {
      const $table = this.$refs.alarmTable
      const record = {
        name: '',
        isAdd: true
      }
      const { row: newRow } = await $table.insertAt(record, row)
      await $table.setActiveCell(newRow, 'name')
    },
    removeParam (row) {
      this.$refs.alarmTable.remove(row)
    },
    showSummary (id) {
      const index = this.table.infoData.findIndex((item) => item.id === id)
      this.summaryInfo = this.table.infoData[index].summary
      this.dialog.summary = true
    },
    showDetail (id) {
      this.caseId = id
      const index = this.table.infoData.findIndex((item) => item.id === id)
      this.detailInfo = this.table.infoData[index]
      this.summaryInfo = this.table.infoData[index].summary
      this.dialog.detail = true
    },
    async bindEvent (row) {
      this.caseId = row.id
      await this.getBindingAlarm(row.id)
      const list = []
      await this.bindingCase.forEach((item) => {
        this.alarmTable.infoData.forEach((v) => {
          if (v.name === item.alarmName) {
            list.push(v)
          }
        })
      })
      this.dialog.alarm = true
      this.$nextTick(() => {
        this.$refs.alarmTable.setCheckboxRow(list, true)
      })
    },
    saveAlarmEnum (row) {
      addAlarmEnumAPI(row.name).then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '告警绑定成功', placement: 'center' })
          this.getAlarmEnumList()
        }
      })
    },
    delAlarmEnum (row) {
      this.$XModal.confirm('您确定要删除选中的数据吗?').then((type) => {
        if (type === 'confirm') {
          delAlarmEnumAPI(row.name).then((res) => {
            const { data } = res
            if (data.code === 200) {
              this.$message.success({ content: '删除成功', placement: 'center' })
              this.getAlarmEnumList()
            }
          })
        }
      })
    },
    bindConfirm () {
      const alarmList = []
      const records = this.$refs.alarmTable.getCheckboxRecords()
      let data = null
      if (records.length === 0) {
        data = {
          caseId: this.caseId,
          alarmList
        }
      } else {
        records.forEach((item) => {
          alarmList.push(item.name)
        })
        data = {
          caseId: this.caseId,
          alarmList
        }
      }
      updateBindingAPI(data).then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '绑定成功', placement: 'center' })
        }
      })
      this.dialog.alarm = false
    },
    docPreviewEvent () {
      downloadCaseAPI(this.caseId).then((res) => {
        this.dialog.preview = true
        this.$nextTick(() => {
          docx.renderAsync(res.data, this.$refs.docPreview, null, {
            className: 'docx', // 默认和文档样式类的类名/前缀
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
      // this.$refs.fileInput.dispatchEvent(new MouseEvent('click'))
    },
    focusQFile () {
      this.$refs.qFile.$el.click()
    },
    async uploadFile () {
      this.formData.append('file', this.dataFile)
      console.log(this.formData)
    },
    downloadResult (row) {
      const exportUrl = `${this.url}/inops/faultCase/download/${row.id}`
      const fileName = `${row.theme}.docx`
      downloadFault(exportUrl, fileName)
    },
    goBack () {
      this.tab = 'list'
      this.currentTab = 0
      this.table.infoData = []
      this.getFaultCaseList()
    }
  }
}
</script>
<style lang="sass" scoped>
.textarea_class
  padding: 5px 15px
  outline: none
  border: 1px solid #c2c2c2
  border-radius: 5px
  width: 100%
  resize: none
  transition: all .4s
.textarea_class:hover
  border: 1px solid #000000
.textarea_class:focus
  border: 1px solid #1976d2
.info_brief
  letter-spacing: 1.5px
.info_detail
  line-height: 25px
  letter-spacing: 1.5px
  text-indent: 2rem
.field_ls
  letter-spacing: 2px
/deep/ .docx-wrapper
  background: transparent
  padding: 15px 0px
  height: 100%
  display: flex
  flex-flow: column
  align-items: center
.status-point
  display: inline-block
  width: 5px
  height: 5px
  border-radius: 50%
  margin-right: 5px

.chip
  padding-right: 11px;
  border: 1px solid blue;
  border-radius: 5px;
  font-size: 12px;
  padding-left: 8px;
  height: 20px;
  width: 100px;
  line-height: 18px;
  margin: 0 5px;
  white-space: nowrap;

.__O__
  transform: translateX(120%);
  position: absolute;
  transition: all .5s;

.__S__
  transform: translateX(0);
  position: relative;
  transition: all .5s;
  top: 0;
  right: 0;
</style>
