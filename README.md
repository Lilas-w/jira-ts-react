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
