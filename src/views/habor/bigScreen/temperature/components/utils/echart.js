const LABEL_TEXT_COLOR = '#000'
const LABEL_TEXT_SIZE = 18
const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  color: ['#4a80d6', '#66e2df', '#feca78', '#e47d4c', '#de5a5f'],
  legend: {
    textStyle: {
      color: '#fff',
      fontSize: LABEL_TEXT_SIZE
    },
    bottom: 15
  },
  grid: {
    left: '1%',
    right: '1%',
    top: '-2%',
    bottom: '10%',
    containLabel: false
  },
  xAxis:
    {
      type: 'category',
      // x坐标
      data: [],
      axisLabel: {
        textStyle: {
          color: '#fff' // 设置文本颜色为黑色
        },
        interval: 0

      },
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      }
    },
  yAxis:
      {
        show: false
        // data: []

        // type: 'value',
        // axisLabel: {
        //   textStyle: {
        //     color: '#000' // 设置文本颜色为白色
        //   }
        // },
        // splitLine: {
        //   show: false
        // }
      },

  series: [
    {
      name: '未采集',
      type: 'bar',
      stack: 'temperature',
      label: {
        show: true,
        fontSize: LABEL_TEXT_SIZE,
        color: LABEL_TEXT_COLOR,
        fontWeight: 'bold',
        fontFamily: 'din-bold',
        formatter: function (params) {
          // 如果数据为0，则不显示文本
          if (params.value === 0) {
            return ''
          } else {
            return params.value
          }
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: '<32° 正常',
      type: 'bar',
      stack: 'temperature',
      label: {
        show: true,
        fontSize: LABEL_TEXT_SIZE,
        color: LABEL_TEXT_COLOR,
        fontWeight: 'bold',
        fontFamily: 'din-bold',
        formatter: function (params) {
          // 如果数据为0，则不显示文本
          if (params.value === 0) {
            return ''
          } else {
            return params.value
          }
        }
      },
      barWidth: 50, // 设置柱子宽度为 30%
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: '[32°,35°] 警戒',
      type: 'bar',
      stack: 'temperature',
      label: {
        show: true,
        fontSize: LABEL_TEXT_SIZE,
        color: LABEL_TEXT_COLOR,
        fontWeight: 'bold',
        fontFamily: 'din-bold',
        formatter: function (params) {
          // 如果数据为0，则不显示文本
          if (params.value === 0) {
            return ''
          } else {
            return params.value
          }
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: []

    },
    {
      name: '[35°,38°] 危险',
      type: 'bar',
      stack: 'temperature',
      label: {
        show: true,
        fontSize: LABEL_TEXT_SIZE,
        color: LABEL_TEXT_COLOR,
        fontWeight: 'bold',
        fontFamily: 'din-bold',
        formatter: function (params) {
          // 如果数据为0，则不显示文本
          if (params.value === 0) {
            return ''
          } else {
            return params.value
          }
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: []
    },
    {
      name: '>=38°  临界',
      type: 'bar',
      stack: 'temperature',
      label: {
        show: true,
        fontSize: LABEL_TEXT_SIZE,
        color: LABEL_TEXT_COLOR,
        fontWeight: 'bold',
        fontFamily: 'din-bold',
        formatter: function (params) {
          // 如果数据为0，则不显示文本
          if (params.value === 0) {
            return ''
          } else {
            return params.value
          }
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: []
    }
  ],
  aliasName: []
}

export default option
