<template>
  <div class="p-4 calendar-card">
    <div class="calendar-header">
      <t-button class="w-full" shape="square" variant="text" @click="minusYear(true)"><BackwardIcon slot="icon" class="text-mod-primary" /></t-button>
      <t-button class="w-full" shape="square" variant="text" @click="minusMonth"><CaretLeftIcon slot="icon" class="text-mod-primary" /></t-button>
      <div class="calendar-date text-mod-title">
        {{ date.year }}-{{ date.month + 1 }}-{{ date.date }}
      </div>
      <t-button class="w-full" shape="square" variant="text" @click="plusMonth"><CaretRightIcon slot="icon" class="text-mod-primary" /></t-button>
      <t-button class="w-full" shape="square" variant="text" @click="plusYear(true)"><ForwardIcon slot="icon" class="text-mod-primary" /></t-button>
    </div>
    <div>
      <div class="calendar-content text-mod-title">
        <div style="text-align: center;" v-for="(item, index) in week" :key="index">{{ item }}</div>
      </div>
      <div class="calendar-content text-mod-title">
        <div v-for="(item, index) in days" :key="index" style="position: relative;">
          <div
            class="li-day text-mod-title"
            :isThisMonth="item.isThisMonth"
            @click="handleClick(item)"
            :style="{ 'pointer-events': item.isThisMonth === 1 ? 'none' : '' }"
          >
            {{ item.date }}
          </div>
          <span v-if="item.event" class="event-count text-white bg-mod-primary">{{ item.event }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils'
import { BackwardIcon, CaretLeftIcon, ForwardIcon, CaretRightIcon } from 'tdesign-icons-vue'
import { cloneDeep } from 'lodash'
export default {
  name: 'modDate',
  components: {
    BackwardIcon,
    CaretLeftIcon,
    ForwardIcon,
    CaretRightIcon
  },
  data () {
    return {
      date: {
        year: '',
        month: '',
        date: ''
      },
      selectedDate: {
        year: '',
        month: '',
        date: ''
      },
      week: ['日', '一', '二', '三', '四', '五', '六'],
      days: [],
      dateMap: {}
    }
  },
  props: {
    eventDate: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    eventDate: {
      handler (newVal, oldV) {
        this.days = this.days.map(res => {
          if (res.id in newVal) {
            res.event = newVal[res.id]
          } else {
            res.event = 0
          }
          return res
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleClick: function (item) {
      this.date.year = item.year
      this.date.month = item.month
      this.date.date = item.date
      this.selectedDate.year = item.year
      this.selectedDate.month = item.month
      this.selectedDate.date = item.date
      console.log(this.data, this.selectedDate)
      const dateId = formatDate(`${this.selectedDate.year}-${this.selectedDate.month + 1}-${this.selectedDate.date}`)
      this.days = this.days.map(res => {
        if (res.id === dateId) res.isThisMonth = 3
        if (res.isThisMonth === 3 && res.id !== dateId) res.isThisMonth = 2
        return res
      })
      this.$emit('getDate', dateId)
    },
    plusMonth: function () {
      if (this.date.month === 11) {
        this.date.month = 0
        this.plusYear()
      } else {
        this.date.month++
        this.createCalendar(this.date.year, this.date.month)
      }
    },
    minusMonth: function () {
      if (this.date.month === 0) {
        this.date.month = 11
        this.minusYear()
      } else {
        this.date.month--
        this.createCalendar(this.date.year, this.date.month)
      }
    },
    plusYear: function () {
      this.date.year++
      this.createCalendar(this.date.year, this.date.month)
    },
    minusYear: function () {
      this.date.year--
      this.createCalendar(this.date.year, this.date.month)
    },
    createCalendar: function (year, month) {
      // 将d设置为该月的1号
      const d = new Date()
      d.setFullYear(year)
      d.setMonth(month)
      d.setDate(1)
      // 获取该月的1号是星期几
      const dayOfFirstDay = d.getDay()
      this.days = []

      for (let i = 0; i < 42; i++) {
        d.setDate(1)
        d.setMonth(month)
        d.setDate(i - dayOfFirstDay + 1)
        if ((i - dayOfFirstDay + 1) < 1) {
          let yearBack = cloneDeep(year)
          d.setFullYear(yearBack--)
        }
        let isThisMonth = 1
        if (d.getMonth() === month) {
          isThisMonth = 2
        } else {
          isThisMonth = 1
        }

        if (
          this.selectedDate.date === d.getDate() &&
          this.selectedDate.month === d.getMonth() &&
          this.selectedDate.year === d.getFullYear()
        ) {
          isThisMonth = 3
          const dateId = formatDate(`${year}-${month + 1}-${d.getDate()}`)
          const date = {
            id: dateId,
            event: dateId in this.eventDate ? this.eventDate[dateId] : 0,
            year: year,
            month: month,
            date: d.getDate(),
            isThisMonth: isThisMonth
          }
          this.days.push(date)
        } else {
          const dateId = formatDate(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`)
          const date = {
            id: dateId,
            event: dateId in this.eventDate ? this.eventDate[dateId] : 0,
            year: d.getFullYear(),
            month: d.getMonth(),
            date: d.getDate(),
            isThisMonth: isThisMonth
          }

          this.days.push(date)
        }
      }
    }
  },
  created () {
    const d = new Date()
    this.date.year = d.getFullYear()
    this.date.month = d.getMonth()
    this.date.date = d.getDate()
    this.selectedDate.year = d.getFullYear()
    this.selectedDate.month = d.getMonth()
    this.selectedDate.date = d.getDate()
    this.createCalendar(this.selectedDate.year, this.selectedDate.month)
  }
}
</script>

<style scoped>
.event-count {
  position: absolute;
  top: 0;
  right: 2px;
  font-size: 0.4rem;
  padding: 2px 5px;
  border-radius: 50px;
}
.calendar-header {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  width: 100%;
  height: 100%
}
.calendar-content {
  display: grid;
  grid-template-columns: repeat(7,1fr);
  width: 100%;
  height: 100%
}
.calendar-date {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}
.li-day {
  position: relative;
  font-size: 12px;
  line-height: 22px;
  text-align: center;
  border-radius: 20px;
  padding: 8px;
}
.li-day:hover {
  @apply bg-mod-primary text-white bg-opacity-40
}
.li-day:hover {
  font-size: 16px;
  cursor: pointer;
}

.li-day[isThisMonth="1"] {
  color: rgb(190, 190, 190);
  font-size: 12px;
}
/*.li-day[isThisMonth="1"]:hover {*/
/*  @apply bg-mod-primary text-white bg-opacity-80*/
/*}*/
.li-day[isThisMonth="1"]:hover {
  font-size: 16px;
  cursor: pointer;
}
.li-day[isThisMonth="3"] {
  @apply bg-mod-primary text-white
}
.li-day[isThisMonth="3"] {
  border-radius: 20px;
  font-weight: 600;
}
</style>
