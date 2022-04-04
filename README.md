## 一、项目配置

项目初始化：`npx create-react-app my-app --template typescript`初始化一个 react、ts 技术栈的项目<br>

#### 1.使用 prettier 实现代码格式化

yarn add --dev --exact prettier<br>
新建配置文件 echo {}> .prettierrc.json<br>
不需要格式化的文件 echo {}> .prettierrcignore<br>
借助 pre-commit hook 以自动化格式工程，npx mrm lint-staged。添加 husky 和 lint-staged<br>
husky：管理 git 的工具<br>
扩展 lint-staged 的文件，加上 ts,tsx<br>
安装依赖 yarn add eslint-config-prettier -D 以解决 eslint 和 prettier 一起工作的冲突<br>
在 eslintConfig 的 extends 中新增 prettier<br>

#### 2.使用 commitlint 规范 git commit message

不符合要求即提交失败<br>
npm install --save-dev @commitlint/config-conventional @commitlint/cli<br>
[commitlint](https://github.com/conventional-changelog/commitlint)

#### 3.配置 json-server

`__json-server_mock__`:前后缀表示作为辅助存在，与项目代码无关<br>
配置`"json-server":"json-server __json-server_mock__/db.json --watch"`<br>

#### 4.使用 ReactDOM 18

```import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);//类型断言
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 二、实现工程列表：列表渲染、状态提升、异步数据获取

#### 知识点：url 参数必须经过转译。

encodeURIComponent(''),反转译 decodeURIComponent('')。encodeURI 用来转译整个 URI。<br>

问题：搜索框中打字，未做 debounce，会发送十几条请求<br>

#### 1.工程列表页面

screens 文件夹，页面展示级别的代码<br>
将 search 表单和工程列表 list 分成两个组件<br>
ps：react.js 对文件命名使用驼峰式还是小写-式未规定。<br>

SearchPanel 组件<br>
难点 1：**状态提升问题**。List 组件无法分享 SearchPanel 组件中定义的 List 状态。——将 param 和 list 提升到父组件中。<br>

#### 2.获取数据

使用 json-server 时，为了没有除业务需要以外的源代码改动，通过环境变量使用 url<br>
新建.env 和.env.development，运行 npm start webpack 读后者中的变量；运行 npm run build webpack 读前者中的变量。<br>

难点 2：**后端不直接返回所需数据问题**。如后端数据没有直接给 personName,只给 personId,需要用 id 从 users 列表中使用 find 函数找。<br>
**find 函数使用技巧**。使用 find 很容易出现找不到返回 undefined，undefined.name 会报错。`users.find(user => user.id === project.personId)?.name || '未知'`。这样写，`?.`表示当?前面的内容是 undefined，则整个表达式 users.find(user => user.id === project.personId)?.name 都是 undefined，而不会报错。此时返回默认值'未知'。<br>

难点 3：**清理对象的空值**。name 为空的 url，希望达成忽略 name 的筛选条件，将所有 name 返回；但服务端认为是找值为空的 name，所以会返回空数组。故而，值为空的时候，前端应把它去掉。新建 src/utils/index.js，写清理空值的方法。<br>

难点 4：**判断值是否是空值**（0 不为空值）：isFalsy()，undefined,null,NaN,''。<br>

安装**qs 库**。 yarn add qs，辅助 url 参数`name=${param.name}&personId=${param.personId}`的填写。qs.stringify()<br>

难点 5：**自定义 hook**，提取组件逻辑，复用组件代码。<br>

把在组件加载阶段只执行一次的逻辑抽离：useMount<br>

**重难点：使用 useDebounce 减少搜索请求频率**。该函数目标是把 value 转换成 debouncedValue。<br>

- useDebounce 内部使用 useState，新建状态 debouncedValue。<br>
  _内部使用别的 hook，是因为要定义一个响应式的值，这是 state 的特点。用函数还是用 custom hook，区别就在于内部是否需要使用别的 hook。_<br>
- 使用 useEffect。每次 value 变化，都新设一个定时器，在 delay 毫秒以后，才 setDebouncedValue 改变 debouncedValue 的值。return 一个清除定时器的回调，每次在上一个 useEffect 执行完会执行这个回调。最后一个 timeout 会被保留。<br>

使用时，const debouncedParam = useDebounce(param, 2000);在 useEffect 中，将原来的 param 都改为 debouncedParam。debouncedParam 变化才调用。实现在搜索框输入文字时，无论触发多少次回调都只执行最后一次。2 秒内如多次调用函数即重新计时 2 秒，直到 2 秒内没有调用请求才执行函数<br>

## 三、改写成 ts

使用 js，错误只能在运行时被发现。强类型语言 ts 在静态代码中就能找到错误。<br>

把 js 库转为 ts 库，对 qs 也进行类型判断。已添加@types/qs -D 依赖。开源库作者多选择用 js 写，再加一个 ts 补丁，如 index.d.ts 文件。d.ts 文件，可以让 js 文件继续保持 js 文件的身份而拥有 ts 的类型保护。如果全都用 ts 写，就不需要 d.ts 文件了。<br>

interface,交代组件是怎么用的。对传入的参数进行类型定义<br>
delay?: number，该参数可有可无。<br>
tuple，最常用的是 custom hook 的返回值。<br>
unknown，严格版的 any。不能赋给任何值，也不能从上面读取任何方法。<br>
泛型：定义时不知道什么类型会被传入。（js 的 typeof tostring 都是在运行时才能判断类型的。）泛型写法：在函数名后加<>，中写大写字母即泛型占位符，然后将占位符和传入的参数、返回的值绑定在一起。<br>

## 四、JWT、用户认证、异步请求

#### 1.ts 类型细节

类型细节：ts 和 java 一样可以兼容类型。但 ts 是鸭子类型（duck typing），面向接口编程，不是面向对象编程。接口一样就可以兼容<br>

#### 2.搭建表单

写表单，通过 e.currentTarget.elements[0]、[1]获取表单中的数据 username password。<br>

#### 3.用 json-server 模拟自定义的 API

给 json-server 定义中间件，使其可模拟非标准 RESTful 的 API。使用 JWT 技术登录认证和注册。登录成功后返回一个 user，user 里有一个 token。将 middlewware 注入到 json-server 里："json-server": "json-server **json-server_mock**/db.json --watch --port 3001 --middlewares ./**json_server_mock**/middleware.js"<br>

#### 4.安装开发者工具

连接到真实的服务器。
`npx imooc-jira-tool`：用 MSW 以 service worker 原理，实现分布式后端。[service worker-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)<br>

1.  所有请求被 service worker 代理，后端逻辑处理后，以 localstorage 为数据库进行增删改查操作(而非用 mysql MongoDB)。开发者浏览器上都安装一个独立的后端服务和数据库，不受中心化服务的影响，点击“清空数据库”即可重置后端服务。
2.  精准控制 http 请求的时间、失败概率、失败规则

在 index.tsx 中引入 jira-dev-tool。<br>
删去 json-server 的内容。<br>

#### 5.JWT 和用户认证

JWT(JSON Web Tokens)，以 token 为核心。token 会被存到 localstorage 里。<br>
新建 auth-provider.ts 以操纵 JWT 的 token。在真实环境中，如使用 firebase 等第三方 auth 服务，可以直接使用它们的 sdk，不用自己开发。<br>

#### 6.使用 useContext 存储全局用户信息

src/context/auth-context.tsx。并定义 custom hook：useAuth 以方便在别处使用全局变量。

Point Free:把数据处理的过程定义成与数据无关的合成运算，不需要用到代表数据的那个参数，只要把简单的运算步骤合成到一起<br>

对于不能将 xx 赋值给 undefined 的 ts 报错，使用泛型解决。如：

```
<{
    user:User|null,
    register:(form:Authform)=>Promise<void>,
    login:(form:Authform)=>Promise<void>,
    logout:()=>Promise<void>,
} | undefined>
```

在 src/context/index.tsx 中，定义 AppProvider，整个项目根节点上的，把 App 包裹起来的，App 级别的 Provider 都会在这里添加。传入{children}，即包裹的子节点。<br>

使用 useAuth。如在 login/index.tsx 中，可以删掉原先的：

```
const login = (param: { username: string; password: string }) => {
    fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(param),
    }).then(async (response: Response) => {
      if (response.ok) {
      }
    });
  };
```

改为 const {login,user} = useAuth()。使用 useAuth 把 user 的信息全部取了出来，包括 token。
