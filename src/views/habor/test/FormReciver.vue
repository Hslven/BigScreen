<template>
<div>未替换为新UI</div>
  <!-- <q-card style="width: 550px; max-width: 80vw">
    <q-card-section
      class="row items-center q-pb-none"
      style="
        justify-content: space-between;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(224, 225, 230, 1);
      "
    >
      <div class="text-h6" style="font-size: 16px">{{ title }}</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-form
      class="q-gutter-md"
      @submit="onApply"
      @validation-error="onValidationError"
    >
      <q-card-section>
        <div
          class="row items-center vertical-middle q-mb-md col-12"
          v-for="(item, index) in field"
          :key="index"
          style="flex-wrap: nowrap"
        >
          <span
            class="col-md-4 col-sm-3 col-xs-2 ellipsis text-container"
            style="padding: 20px"
            v-if="!item.unshow"
            >{{ item.name
            }}<span v-show="item.required" class="text-red q-ml-xs"
              >*</span
            ></span
          >
          <q-select
            v-if="
              item.type === 'select' &&
              typeof item.value == 'object' &&
              !item.unshow
            "
            v-model="item.value"
            dense
            placeholder="请输入"
            outlined
            multiple
            input-debounce="0"
            :options="item.options"
            style="width: 300px"
            :disable="disable"
          ></q-select>
          <q-select
            v-if="
              item.type === 'select' &&
              typeof item.value !== 'object' &&
              !item.unshow
            "
            v-model="item.value"
            dense
            placeholder="请输入"
            outlined
            input-debounce="0"
            :options="item.options"
            style="width: 300px"
            :disable="disable"
          ></q-select>

          <div v-if="item.type == 'text' && !item.unshow">
            <span style="width: 300px">{{ item.value }}</span>
          </div>

          <div
            class="q-pa-md"
            v-if="item.type === 'toggle' && !item.unshow"
            style="padding: 0; margin-left: -13px"
          >
            <q-toggle v-model="item.value" :disable="disable"></q-toggle>
          </div>
          <q-input
            v-if="item.type === 'textarea' && !item.unshow"
            style="width: 300px; padding:4px 12px 0; border: 1px solid #bdbdbd ;border-radius: 3px transition: all .2s outline: none;margin-bottom:12px;"
            v-model="item.value"
            placeholder="请输入说明..."
            no-error-icon
            outlined
            type="textarea"
            :disable="disable"
          />
          <q-input
            v-if="item.type === 'input' && item.required && !item.unshow"
            v-model="item.value"
            dense
            placeholder="请输入"
            outlined
            :disable="disable"
            style="width: 300px"
            :rules="[
              (val) => (val && val.length > 1) || 'Please enter context',
            ]"
          ></q-input>
          <q-input
            v-if="item.type === 'input' && !item.required && !item.unshow"
            v-model="item.value"
            dense
            outlined
            placeholder="请输入"
            style="width: 300px"
            :disable="disable"
          ></q-input>
        </div>
      </q-card-section>
      <q-card-actions align="right" style="margin: -20px 5px 10px 0">
        <q-btn
          style="width: 80px; border: 1px solid rgba(0, 0, 0, 0.15)"
          size="sm"
          class="q-mr-sm"
          unelevated
          label="取消"
          v-close-popup
        />
        <q-btn
          style="width: 80px"
          size="sm"
          class="q-mr-sm"
          unelevated
          label="保存"
          color="primary"
          type="submit"
          :disable="disable"
        />
      </q-card-actions>
    </q-form>
  </q-card> -->
</template>
<script>
export default {
  data () {
    return {}
  },
  /*
   * disable (可选, 不允许修改)
   * title   (可选, 标题)
   * field   (必选, 传数据)
   * type    (可选, 判断新增还是修改)
   */
  props: {
    disable: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '无题'
    },
    field: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  methods: {
    onValidationError () {
      this.$tool.tooltip('fail', '请确保内容填写正确')
    },
    onApply () {
      if (this.type === 'add') {
        console.log('调用add接口')
      }
      if (this.type === 'update') {
        console.log('调用update接口')
      }
    }
  },
  mounted () {
    // console.log(this.field[1].value);
    // console.log(typeof this.field[1].value);
  }
}
</script>
<style>
textarea {
  padding-top: 0 !important;
}
.text-container + div {
  padding-top: 8px;
}
.text-container {
  margin-bottom: 32px;
}
</style>
