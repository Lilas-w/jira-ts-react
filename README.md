## 一、项目配置

项目初始化：`npx create-react-app my-app --template typescript`初始化一个 react、ts 技术栈的项目<br>

使用 prettier 实现代码格式化<br>
yarn add --dev --exact prettier<br>
新建配置文件 echo {}> .prettierrc.json<br>
不需要格式化的文件 echo {}> .prettierrcignore<br>
借助 pre-commit hook 以自动化格式工程，npx mrm lint-staged。添加 husky 和 lint-staged<br>
husky：管理 git 的工具<br>
扩展 lint-staged 的文件，加上 ts,tsx<br>
安装依赖 yarn add eslint-config-prettier -D 以解决 eslint 和 prettier 一起工作的冲突<br>
在 eslintConfig 的 extends 中新增 prettier<br>

使用 commitlint 规范 git commit message，不符合要求即提交失败<br>
[commitlint](https://github.com/conventional-changelog/commitlint)

配置 json-server<br>
**json-server_mock**:前后缀表示作为辅助存在，与项目代码无关<br>
配置"json-server":"json-server **json-server_mock**/db.json --watch"<br>

使用 ReactDOM 18<br>

```import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);//类型断言
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 二、实现工程列表

异步数据获取、列表渲染、状态提示<br>
ps:参数必须经过转译。encodeURIComponent(''),反转译 decodeURIComponent('')。encodeURI 用来转译整个 URI。<br>
screens 文件夹，页面展示级别的代码<br>
问题：搜索框中打字，未做 debounce，会发送十几条请求<br>

将 search 表单和工程列表 list 分成两个组件<br>
ps：react.js 对文件命名使用驼峰式还是小写-式未规定。<br>
SearchPanel 组件<br>
难点 1：**状态提升问题**。List 组件无法分享 SearchPanel 组件中定义的 List 状态。——将 param 和 list 提升到父组件中。<br>

使用 json-server,为了没有除业务需要以外的源代码改动，使用环境变量使用 url<br>
新建.env 和.env.development，运行 npm start webpack 读后者中的变量；运行 npm run build webpack 读前者中的变量。<br>

难点 2：**后端不直接返回所需数据问题**。如后端数据没有直接给 personName,只给 personId,需要用 id 从 users 列表中使用 find 函数找。<br>
**find 函数使用技巧**。使用 find 很容易出现找不到返回 undefined，undefined.name 会报错。`users.find(user => user.id === project.personId)?.name || '未知'`。这样写，`?.`表示当?前面的内容是 undefined，则整个表达式 users.find(user => user.id === project.personId)?.name 都是 undefined，而不会报错。此时返回默认值'未知'。<br>

难点 3：**清理对象的空值**。name 为空的 url，希望达成忽略 name 的筛选条件，将所有 name 返回；但服务端认为是找值为空的 name，所以会返回空数组。故而，值为空的时候，前端应把它去掉。新建 src/utils/index.js，写清理空值的方法。<br>

难点 4：**判断值是否是空值**（0 不为空值）：isFalsy()，undefined,null,NaN,''。<br>

安装 yarn add qs，辅助 url 参数`name=${param.name}&personId=${param.personId}`的填写。qs.stringify()<br>

难点 5：**自定义 hook**，提取组件逻辑，复用组件代码。<br>
把在组件加载阶段只执行一次的逻辑抽离：useMount<br>
**重难点：使用 useDebounce 减少搜索请求频率**。目标是把 value 转换成 debouncedValue。useDebounce 内部使用 useState，新建状态 debouncedValue。<br>
_内部使用别的 hook，是因为要定义一个响应式的值，这是 state 的特点。用函数还是用 custom hook，区别就在于内部是否需要使用别的 hook。_<br>
使用 useEffect。每次 value 变化，都新设一个定时器，在 delay 毫秒以后，才 setDebouncedValue 改变 debouncedValue 的值。return 一个清除定时器的回调，每次在上一个 useEffect 执行完会执行这个回调。最后一个 timeout 会被保留。<br>
使用时，const debouncedParam = useDebounce(param, 2000);在 useEffect 中，将原来的 param 都改为 debouncedParam。debouncedParam 变化才调用。实现在搜索框输入文字时，无论触发多少次回调都只执行最后一次。2 秒内如多次调用函数即重新计时 2 秒，直到 2 秒内没有调用请求才执行函数<br>
