前端代码
=======

> 前端代码整合了InOps、modops、主动运维iframe、主动运维大屏。
>
> 需要对前端大体架构有把握，了解各块的内容，比如：页面的架构、普通页面的缓存机制、iframe页面的缓存机制、大屏模式与自适应模式等等

**云基础设施运维自动化平台** 是一款集模组编排、运维管理、主动监控大屏模式于一体的运维管理平台：

- 基于 vue2 和 Tdesign-ui + tailwindCSS实现
- 支持**自适应模式**和**数据大屏模式**
- 包含动态路由，动态缓存，权限验证，外链菜单配置，用户-角色权限分配等常用功能
- **多环境切换**：
  - 生产模式：边缘云环境、网络云环境
  - 开发模式：本地调试模式、mock数据模拟模式
- 包含 tagView 快捷导航等 SPA 应用常用功能
- 内置亮暗模式设置
- 内置系统主题设置
- 内置 Material Design 图标集
- 内置mock数据模拟
- 后端采用微服务架构，服务各自独立互不影响


使用这个项目前您需要了解如下技术栈：
+ 基本框架：node 16.4.2 + vue2 + vuex + vue-router + axios
+ UI框架：Tdesign + tailwindcss
+ 可视化图表：echart 、antv/g2plot、antv/x6
+ 表格组件： vxe-table
+ icon组件: material-icon
+ 数据模拟：mock

### 如何运行
请确保您的计算机已经安装了 ```Node.js v16.4.2``` 

1、在项目文件夹 cmd 下，下载项目所需依赖

```npm
npm install 或 cnpm i （如果您正在使用 cnpm，但是 cnpm 下载依赖不太稳定 ）
```
2、在项目文件夹 cmd 下，启动开发服务器
```npm
# development模式(mock数据模拟模式)，用于离线开发，采用mock进行数据模拟，mock数据文件路径：src/mock/index.js
npm run serve 

# 本地调试模式，对接生产环境接口，本地运行
npm run serve:modops

# inops模式
npm run serve:inops

# monitor模式
npm run serve:monitor

# edge边缘云模式
npm run serve:edge
```

### 如何打包
```npm
# 网络云生产环境
npm run build

# 边缘云生产模式
npm run build:edge

# 预生产测试环境
npm run build:pre
```


### 项目目录结构

+ api: 请求API（不同微服务API）
+ assets: 静态资源（css、images等）
+ axios: 通用请求入口，包括基本请求URL、请求拦截等内容
+ components: 抽离的单独应用组件，如加载条、日历、骨架、markdown、echarts等
+ dict: 数据映射
+ enums: 枚举数据，包括常见的返回值枚举、页面数据枚举等
+ Layout: 系统主体框架组件，包括头部、菜单、多标签等内容
+ mixins: 抽离的通用混入
+ plugins: 引入的外部插件配置
+ router: 系统页面路由配置，如动态加载路由、跳转前跳转后拦截等
+ settings: 系统设置，包括系统主题设置、风格设置等
+ store: 系统状态管理
+ ui: 抽离常用组件，如按钮、输入框等内容（建议采用jsx开发）
+ uitls: 常用工具集，如浏览器缓存函数、色码转换等内容
+ views: 页面内容
