import { APP_PRIMARY, DARK_THEME } from '@/store/mutation-types'
import { createStorage } from '@/utils/Storage'
const Storage = createStorage({ storage: localStorage })
export const appPrimaryList = [
  '#00C1D4',
  '#0096c7',
  '#0084f4',
  '#0A72C7',
  '#165DFF',
  '#1768AC',
  '#536dfe',
  '#5E72E4',
  '#9c27b0',
  '#18A058',
  '#ff9800',
  '#ee4f12',
  '#FF3D68',
  '#033c51',
  '#242E42'
]

const settings = {
  // 深色主题
  darkTheme: Storage.get(DARK_THEME, false),
  // 系统主题色
  appPrimary: Storage.get(APP_PRIMARY, '#165DFF'),
  // 系统内置主题色列表
  appPrimaryList
}

export default settings
