module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/essential"],
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
  },
  rules: {
    // 0-off; 1-warn; 2-error
    indent: [2, 2], // 强制使用一致的缩进
    eqeqeq: [2, "always"], //必须使用全等 === 和 !==
    semi: [2, "never"], // 禁用行尾使用分号
    quotes: [2, "single"], // 强制使用一致的反勾号、双引号或单引号
    camelcase: 0, //强制驼峰法命名
    "strict": 2,//使用严格模式
    "no-extra-label:": 0,// 禁用不必要的标签
    "no-unused-vars": 0, // 禁用报错声明但从未读取其值
    "no-extra-parens": 1, // 禁止不必要的括号
    "no-empty":0 ,// 禁止空块语句
    "no-extra-parens":0,
    // "max-len":[1,88],// 强制一行的最大长度
  },
};
