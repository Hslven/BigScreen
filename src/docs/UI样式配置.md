## UI框架
系统UI： quasar + TailWindCSS

主要系统风格由TailWindCSS控制

### 颜色样式自配置

#### 系统主要色调配置
文件路径：src/assets/tailwindcss.css

+ 配置色调
~~~css
@layer base {
  /*亮色主题*/
  :root {
    --sys-primary-rgb: 94 114 228;  /*系统主色调*/
    --sys-secondary-rgb: 131 146 171;
    --sys-success-rgb: 45 206 137;  /*系统"成功"类色*/
    --sys-info-rgb: 17 205 239;  /*系统"消息"类色调*/
    --sys-warning-rgb: 251 99 64;  /*系统"警告"类色调*/
    --sys-danger-rgb: 245 54 92;  /*系统"报警"类色调*/
    --sys-bg-rgb: 233 236 239;  /*系统背景色调*/
    --sys-card-rgb: 255 255 255;  /*系统卡片色调*/
    --sys-btn-hover-rgb: 99 179 237; /*系统按钮选中色调*/
    --sys-input-rgb: 255 255 255; /*系统输入框色调*/
    --sys-input-focus-rgb: 255 255 255; /*系统输入框获焦色调*/
    --sys-title-color-rgb: 52 71 103; /*系统标题字体色调*/
    --sys-body-color-rgb: 103 116 142 /*系统主体字体色调*/
  }

  /*暗色主题*/
  .theme-dark {
    --sys-primary-rgb: 94 114 228;
    --sys-secondary-rgb: 131 146 171;
    --sys-success-rgb: 45 206 137;
    --sys-info-rgb: 17 205 239;
    --sys-warning-rgb: 251 99 64;
    --sys-danger-rgb: 245 54 92;
    --sys-bg-rgb: 24 24 28;
    --sys-card-rgb: 43 40 47;
    --sys-btn-hover-rgb: 99 179 237;
    --sys-input-rgb: 52 71 103;
    --sys-input-focus-rgb: 52 71 103;
    --sys-title-color-rgb: 255 255 255;
    --sys-body-color-rgb: 103 116 142
  }
}
~~~

+ 加载色调

文件路径：tailwind.config.js

相应背景、字体、颜色等加载方式可看tailwind官网
~~~javaScript
/** @type {import('tailwindcss').Config} */

function withOpacityValue (variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

module.exports = {
  content: [],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        mod: {
          bg: withOpacityValue('--sys-bg-rgb'),
          card: withOpacityValue('--sys-card-rgb'),
          btn: withOpacityValue('--sys-primary-rgb'),
          input: withOpacityValue('--sys-input-rgb'),
          'input-hover': withOpacityValue('--sys-input-focus-rgb'),
          'btn-hover': withOpacityValue('--sys-ModBtn-hover-rgb')
        }
      },
      colors: {
        mod: {
          primary: withOpacityValue('--sys-primary-rgb'),
          secondary: withOpacityValue('--sys-secondary-rgb'),
          success: withOpacityValue('--sys-success-rgb'),
          info: withOpacityValue('--sys-info-rgb'),
          warning: withOpacityValue('--sys-warning-rgb'),
          danger: withOpacityValue('--sys-danger-rgb'),
          title: withOpacityValue('--sys-title-color-rgd'),
          body: withOpacityValue('--sys-body-color-rgd')
        }
      }
    }
  },
  plugins: []
}
~~~

+ 使用方式

以class的方式使用

背景色：
+ 系统背景色：class="bg-mod-bg"
+ 卡片背景色：class="bg-mod-card"
+ 按钮色：class="bg-mod-btn"
+ 按钮选中色：class="bg-mod-btn-hover"
+ 输入框色：class="bg-mod-input"
+ 输入框获焦色：class="bg-mod-input-hover"

字体颜色（边框颜色等）：
+ primary：class="text-mod-primary"
+ secondary：class="text-mod-secondary"
+ success：class="text-mod-success"
+ warning：class="text-mod-warning"
+ danger：class="text-mod-danger"
+ 系统标题字体颜色：class="text-mod-title"
+ 系统主体字体颜色：class="text-mod-body"



### 通用样式抽离

文件路径：src/assets/tailwindcss.css

抽离出通用的css样式，
比如
+ 垂直水平居中：class="mod-flex-center"
+ 按钮样式：class="mod-button"
+ 按钮禁止样式：class="mod-button-disable"
+ 输入框样式：class="mod-input"

~~~css
@layer components {
  .mod-flex-center {
    @apply flex items-center justify-center
  }
  .mod-input {
    @apply w-full text-sm text-mod-body bg-mod-input px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:border-mod-primary focus:ring-2 focus:shadow focus:ring-mod-primary focus:ring-opacity-10
  }
  .mod-button {
    @apply w-full flex justify-center bg-mod-btn hover:bg-mod-btn-hover text-gray-100 p-2 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500
  }
  .mod-button-disable {
    @apply w-full bg-mod-btn rounded-lg p-2 text-white font-bold hover:bg-mod-btn-hover
  }
}
~~~
