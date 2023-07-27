<template>
  <div>
    <div class="q-pl-md q-pr-md">
      <q-btn @click="selectNetwork = !selectNetwork" flat style="background-color: #55bc8a; color: white" padding="xs md" dense><div>已选择<span style="color: #3A6FD5"> {{ inputOptionsForm.options.default.length }} </span>台数通设备</div></q-btn>
      <q-btn class="w-full q-mt-md" size="md" label="ok" style="background-color: #242E42; color: #ffffff" @click="addParameter" />
    </div>
    <q-dialog v-model="selectNetwork" persistent>
      <div class="row" style="max-width: 1000px">
        <q-card style="width: 400px; margin-right: 20px">
          <q-card-section style="background-color: #242E42; color: #fff">
            <q-tabs
                v-model="modelName"
                narrow-indicator
                dense
                align="justify"
            >
              <q-tab name="ROUTER" label="路由器" />
              <q-tab name="SWITCH" label="交换机" />
              <q-tab name="FIREWALL" label="防火墙" />
              <q-tab name="LOAD_BALANCER" label="LB" />
            </q-tabs>
          </q-card-section>
          <q-card-section>
            <q-input placeholder="模糊查询" rounded outlined dense v-model="networkFilter" borderless>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append>
                <q-icon name="close" @click="networkFilter = ''" class="cursor-pointer" />
              </template>
              <template v-slot:after>
                <q-btn style="color: #242e42" dense flat label="搜索" @click="searchNetwork" />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-table
                flat
                dense
                class="my-sticky-header-table"
                :data="data"
                :columns="columns"
                row-key="name"
                :loading="loading"
                :pagination.sync="pagination"
                @request="onRequest"
                selection="multiple"
                :selected.sync="selected"
                binary-state-sort
                hide-selected-banner
                :rows-per-page-options="[200]"
            />
          </q-card-section>
        </q-card>
        <q-card style="width: 400px">
          <q-card-section style="background-color: #242E42; color: #fff">
            <div>已选数通设备</div>
          </q-card-section>
          <q-card-section class="row items-center q-pa-md">
            <div class="font-main">已选<span>{{ selected.length }}台数通设备</span></div>
            <q-space />
            <q-btn label="确认" dense padding="xs lg" flat rounded style="color: #fff;background-color: #242E42" @click="selectedEnd" v-close-popup />
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-table
                flat
                dense
                class="my-sticky-header-table"
                :data="selected"
                :columns="columns"
                row-key="name"
                :loading="loading"
                selection="multiple"
                hide-selected-banner
                :selected.sync="selected"
                binary-state-sort
                :rows-per-page-options="[200]"
            >
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { cmdbSingleModelAPI } from '@/api/openapi/index'
import { cmdbSingleModelPath } from '@/dict/cmdbPath'
export default {
  name: 'NetworkInputComp',
  props: ['serviceInputForm', 'isSatisfy'],
  data () {
    return {
      modelName: 'ROUTER',
      inputOptionsForm: this.serviceInputForm,
      networkFilter: null,
      selected: [],
      loading: false,
      selectNetwork: false,
      pagination: {
        sortBy: 'name',
        descending: false,
        page: 1,
        rowsPerPage: 200,
        rowsNumber: 0
      },
      data: [],
      columns: [
        {
          name: 'name',
          required: true,
          label: '数通设备名',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`
        }
      ]
    }
  },
  mounted () {
    if (this.inputOptionsForm.options.default.length) {
      this.selected = this.inputOptionsForm.options.default
    }
    this.onRequest({
      pagination: this.pagination
    })
  },
  watch: {
    modelName: {
      handler (newval, oldvalue) {
        if (newval !== oldvalue) {
          this.pagination = {
            sortBy: 'name',
            descending: false,
            page: 1,
            rowsPerPage: 200,
            rowsNumber: 0
          }
          this.onRequest({
            pagination: this.pagination
          })
        }
      },
      deep: true
    }
  },
  methods: {
    async getCMDBNetworks (postData) {
      return new Promise((resolve, reject) => {
        cmdbSingleModelAPI(postData, cmdbSingleModelPath, this.modelName).then(response => {
          const { data } = response
          this.data = data.data.list
          this.pagination.page = data.data.page
          this.pagination.rowsNumber = data.data.total
        }).catch(error => {
          this.$msg.message('bottom-right', 'negative', error.data.message, 100)
        })
      })
    },
    addParameter () {
      if (this.selected.length) {
        const items = []
        for (const item of this.selected) {
          items.push(item.name)
        }
        this.inputOptionsForm.value = items
        this.inputOptionsForm.source = 'value'
        this.inputOptionsForm.connected = true
      } else {
        this.inputOptionsForm.value = this.selected
        this.inputOptionsForm.source = ''
        this.inputOptionsForm.connected = false
      }
      this.$emit('addParameter', this.inputOptionsForm)
    },
    onRequest (props) {
      this.pagination.page = props.pagination.page
      this.pagination.rowsPerPage = props.pagination.rowsPerPage
      const postData = {
        pageData: this.pagination,
        filterData: this.networkFilter
      }
      this.getCMDBNetworks(postData)
    },
    searchNetwork () {
      const postData = {
        pageData: {
          sortBy: 'name',
          descending: false,
          page: 1,
          rowsPerPage: 200,
          rowsNumber: 0
        },
        filterData: this.networkFilter
      }
      this.getCMDBNetworks(postData)
    },
    selectedEnd () {
      this.inputOptionsForm.options.default = this.selected
      this.selectNetwork = false
    }
  }
}
</script>

<style lang="sass" scoped>
  .my-sticky-header-table
    /* height or max-height is important */
    height: 500px

    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th
      /* bg color is important for th; just specify one */
      background-color: #F9FBFD
      font-size: 12px

    thead tr th
      position: sticky
      z-index: 1
    thead tr:first-child th
      top: 0

    /* this is when the loading indicator appears */
    &.q-table--loading thead tr:last-child th
      /* height of all previous header rows */
      top: 48px
  /deep/ .q-field--outlined.q-field--rounded .q-field__control
    background: #eff4f9
  /deep/ .q-field--outlined .q-field__control:before
    border: 0px solid rgba(0,0,0,0.24) !important
</style>
