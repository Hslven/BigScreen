import { IS_TABS } from '@/store/mutation-types'
import { createStorage } from '@/utils/Storage'
const Storage = createStorage({ storage: localStorage })
const setting = {
  // 多标签
  multiTabsSetting: {
    // 是否显示
    show: Storage.get(IS_TABS, false)
  },
  // 菜单
  menuSetting: {
    show: true
  },
  // TODO 是否以大屏的形式展示
  isScreen: {
    show: false
  }
}
export default setting
