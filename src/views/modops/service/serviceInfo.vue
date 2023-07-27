<template>
  <q-card style="background-color: white; width: 700px">
    <q-card-section style="font-size: 16px;background-color: #242e42; border-bottom: 1px solid #ccd3db;color: #fff" class="items-center q-pa-md">
      构件详情
    </q-card-section>
    <q-card-section style="font-size: 13px" class="q-pa-lg">
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <div class="my-content">名称: {{ serviceData.name }}</div>
        </div>
        <div class="col-6">
          <div class="my-content">创建者: {{ serviceData.author }}</div>
        </div>
        <div class="col-6">
          <div class="my-content">创建时间: {{ dateFormat(serviceData.createdAt) }}</div>
        </div>
        <div class="col-6">
          <div class="my-content">key:
            <q-badge outline color="secondary" :label="serviceData.key" />
          </div>
        </div>
        <div class="col-6 row">
          <span class="col-2">状态:</span>
          <mod-status class="col-10" :status="serviceData.status"></mod-status>
        </div>
        <div class="col-6">
          <div class="my-content">输出类型:
            <q-badge color="blue" style="padding: 4px">
              {{ serviceData.output.type }}
            </q-badge>
          </div>
        </div>
        <div class="col-12">
          <div>
            输入参数:
            <div v-if="serviceData.input.length !== 0">
              <div style="display: flex; flex-direction: row; flex-wrap: wrap">
                <div
                    v-for="(item, index) in serviceData.input"
                    :key='index + "12"'>
                  <div style="cursor:pointer;padding: 2px 0px; margin-right: 6px; font-size: 10px">
                    <div style="background-color: rgb(1,47,75); color: white;display: inline-block; padding: 4px 6px;border: 1px solid rgb(1,47,75);border-radius: 5px 0px 0px 5px">{{ item.name }}
                    </div>
                    <div style="background-color: white;color: #012f4b;border: 1px solid rgb(1,47,75);border-radius: 0px 3px 3px 0px;display: inline-block;padding: 4px 6px;border: 1px solid rgba(36,46,66,0.2)">
                      {{ item.type }}
                      <span v-if="item.tag">
                      : {{ item.tag }}
                    </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="my-content">描述: {{ serviceData.description }}</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import ModStatus from '@/components/modComp/modStatus'
import { serviceObj } from '../utils/dataObject'
import { formatterDate } from '@/utils/index'
export default {
  name: 'serviceInfo',
  components: {
    ModStatus
  },
  props: {
    row: {
      type: Object,
      default: () => ({
        ...serviceObj
      })
    }
  },
  data () {
    return {
      serviceData: this.row
    }
  },
  computed: {
    dateFormat () {
      // 格式化时间
      return function (date) {
        return formatterDate(date)
      }
    }
  }
}
</script>

<style scoped>

</style>
