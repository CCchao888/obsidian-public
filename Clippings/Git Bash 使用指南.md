---
title: "Git Bash 使用指南"
source: "https://chatgpt.com/c/6a5252c7-1ef8-83ec-8bd8-3138e808d8f0"
author:
published:
created: 2026-07-15
description: "ChatGPT conversation with 56 messages"
tags:
  - "clippings"
---
可以。在 Windows（微软系统）上，只要安装了 **Git for Windows** ，就自带了 **Git Bash** ，里面就可以直接使用 **grep** 命令，和 Linux 基本一致。

## 方法一：使用 Git Bash（推荐）

安装 Git 后，右键文件夹可以选择 **Git Bash Here** ，或者打开 **Git Bash** 。

先确认是否安装成功：

```bash
grep --version
```

如果输出类似：

```
grep (GNU grep) 3.x
```

说明可以正常使用。

---

## 常见用法

### 1\. 搜索文件中的字符串

例如搜索当前目录下 `hello` ：

```bash
grep "hello" test.txt
```

输出：

```
hello world
```

---

### 2\. 递归搜索整个目录

这是最常用的。

```bash
grep -r "TODO" .
```

或者

```bash
grep -rn "TODO" .
```

参数：

例如：

```
src/main.py:15: TODO fix bug
```

---

### 3\. 忽略大小写

```bash
grep -i "error" log.txt
```

可以匹配：

```
ERROR
Error
error
```

---

### 4\. 显示匹配文件名

```bash
grep -rl "password" .
```

输出：

```
config.yml
app.properties
```

---

### 5\. 搜索多个文件

```bash
grep "main" *.cpp
```

或者

```bash
grep "main" *.java
```

---

### 6\. 使用正则表达式

例如查找数字：

```bash
grep "[0-9]" test.txt
```

查找邮箱：

```bash
grep -E "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+" file.txt
```

---

### 7\. 显示上下文

前后各显示两行：

```bash
grep -C 2 "Exception" log.txt
```

只显示前两行：

```bash
grep -B 2 "Exception" log.txt
```

只显示后两行：

```bash
grep -A 2 "Exception" log.txt
```

---

### 8\. 排除某些文件

例如：

```bash
grep -rn "TODO" . --exclude="*.log"
```

排除整个目录：

```bash
grep -rn "TODO" . --exclude-dir=node_modules
```

---

### 9\. 统计匹配数量

```bash
grep -c "error" log.txt
```

输出：

```
15
```

---

### 10\. 只输出匹配内容

```bash
grep -o "[0-9]\+" test.txt
```

例如：

```
abc123def456
```

输出：

```
123
456
```

---

## 配合其他命令

例如查看进程：

```bash
ps | grep python
```

查看目录：

```bash
ls | grep txt
```

搜索 Git 日志：

```bash
git log | grep "fix"
```

搜索命令输出：

```bash
cat log.txt | grep ERROR
```

虽然可以这样写，但更推荐直接：

```bash
grep ERROR log.txt
```

---

## Windows CMD 能直接用吗？

如果安装的是 **Git for Windows** ：

### CMD

```
grep hello test.txt
```

通常 **不能直接使用** ，除非把 Git 的 `usr\bin` 加入了 `PATH` 。

Git 默认安装位置一般是：

```
C:\Program Files\Git\usr\bin
```

将其加入环境变量后，在 CMD 或 PowerShell 中也可以运行：

```powershell
grep hello test.txt
```

---

## 与 Windows 自带命令对比

Windows 自带有 `find` 和 `findstr` ：

```
findstr "hello" test.txt
```

但相比之下，GNU `grep` 功能更强：

| 功能 | grep | findstr |
| --- | --- | --- |
| 正则表达式 | ✅ 强大 | ⚠️ 较弱 |
| 递归搜索 | ✅ `-r` | ⚠️ `/S` |
| 显示行号 | ✅ `-n` | ✅ `/N` |
| 忽略大小写 | ✅ `-i` | ✅ `/I` |
| 排除目录 | ✅ | ❌ |
| 上下文显示 | ✅ | ❌ |

如果你经常开发或使用 Git，推荐直接使用 **Git Bash + grep** ，体验与 Linux 基本一致。

## 一个实际开发中的例子

假设项目目录如下：

```
project/
├── src/
│   ├── main.py
│   └── utils.py
├── tests/
└── README.md
```

查找所有包含 `import requests` 的文件：

```bash
grep -rn "import requests" .
```

输出可能是：

```
./src/main.py:3:import requests
./tests/test_api.py:2:import requests
```

这也是在 Linux、macOS 和安装了 Git for Windows 的 Windows 环境中最常见的用法。

---

怎么不通过图形界面进入git bash

---

可以，不需要通过右键菜单或图形界面，有几种方法。

### 方法一：直接打开 Git Bash（最快）

按 **Win + R** ，输入：

```
C:\Program Files\Git\git-bash.exe
```

如果 Git 安装在默认位置，就会直接打开 Git Bash。

也可以在 CMD 中执行：

```
"C:\Program Files\Git\git-bash.exe"
```

---

### 方法二：在 CMD 中进入 Git 的 Unix 环境

如果只是想使用 `grep` 、 `ls` 、 `cat` 等 Linux 命令，其实不用启动 Git Bash。

例如：

```
"C:\Program Files\Git\usr\bin\grep.exe" hello test.txt
```

或者先把 Git 的路径加入环境变量（PATH）：

```
C:\Program Files\Git\usr\bin
C:\Program Files\Git\bin
```

之后在 CMD 或 PowerShell 中就可以直接输入：

```
grep hello test.txt
ls
cat test.txt
find
```

就和在 Git Bash 中一样。

---

### 方法三：从 CMD 切换到 Git 的 Bash

在 CMD 中执行：

```
"C:\Program Files\Git\bin\bash.exe"
```

或者

```
"C:\Program Files\Git\git-bash.exe"
```

这样就进入 Bash 环境了。

---

### 方法四：在 Windows Terminal 中使用 Git Bash（推荐）

如果安装了 Windows Terminal，可以新增一个 Git Bash 配置。

命令为：

```
C:\Program Files\Git\bin\bash.exe --login -i
```

以后打开 Windows Terminal 就可以直接选择 **Git Bash** ，无需右键菜单。

---

## 查看 Git 安装位置

如果不知道 Git 安装在哪，可以在 CMD 中执行：

```
where git
```

例如输出：

```
C:\Program Files\Git\cmd\git.exe
```

那么 Git 的安装目录就是：

```
C:\Program Files\Git
```

相应的 Bash 位于：

```
C:\Program Files\Git\git-bash.exe
```

或

```
C:\Program Files\Git\bin\bash.exe
```

---

### 推荐做法

如果你的目的是 **在 Windows 中像 Linux 一样使用 `grep` 、 `awk` 、 `sed` 、 `find` 、 `xargs` 等命令** ，建议将下面两个目录添加到系统的 `PATH` 环境变量：

```
C:\Program Files\Git\usr\bin
C:\Program Files\Git\bin
```

这样无论是在 **CMD** 、 **PowerShell** 还是 **Windows Terminal** 中，都可以直接使用 GNU 工具，而无需专门打开 Git Bash。

---

会有什么副作用吗

---

一般来说 **副作用很小，但确实有几点需要注意** 。是否建议加入 `PATH` ，取决于你的使用习惯。

### 情况一：只添加 C:\\Program Files\\Git\\usr\\bin（有一定风险）

这里面有很多 GNU 工具，例如：

```
grep
find
sort
tar
ssh
bash
ls
cat
```

有些命令名和 Windows 自带命令相同，但 **行为不同** 。

例如：

| 命令 | Windows 版本 | Git(GNU) 版本 | 可能影响 |
| --- | --- | --- | --- |
| `find` | 查找字符串 | 查找文件 | 容易混淆 |
| `sort` | Windows 排序 | GNU sort | 参数不同 |
| `tar` | Windows tar | GNU tar | 通常影响不大 |
| `ssh` | Windows OpenSSH | Git OpenSSH | 可能使用不同配置 |

最典型的是 `find` ：

Windows CMD：

```
find "abc" test.txt
```

GNU `find` ：

```bash
find . -name "*.txt"
```

如果 `usr\bin` 排在前面，在 CMD 中输入：

```
find "abc" test.txt
```

实际上调用的是 GNU `find` ，结果就会报错，因为它把 `"abc"` 当成路径了。

---

### 情况二：只添加 C:\\Program Files\\Git\\cmd（推荐）

Git 安装目录下还有一个：

```
C:\Program Files\Git\cmd
```

这里只有少量程序，例如：

```
git.exe
git-lfs.exe
gitk.exe
scalar.exe
```

这是 Git 官方推荐加入 PATH 的目录。

优点：

- `git` 命令可在任何终端使用。
- 不会覆盖 Windows 自带命令。
- 几乎没有副作用。

---

### 情况三：需要时使用完整路径（最安全）

例如：

```
"C:\Program Files\Git\usr\bin\grep.exe" hello test.txt
```

或者写个批处理/PowerShell 别名，仅在需要时调用。

---

### 我的建议

如果你主要是开发，推荐下面几种方式：

- **最佳** ：使用 **Git Bash** 或 **Windows Terminal + Git Bash** ，完全不用修改 `PATH` 。
- **如果想在 PowerShell/CMD 中使用 `grep` 等工具** ：可以把 `usr\bin` 加入 `PATH` ，但最好放在 **PATH 的末尾** ，这样 Windows 自带命令通常会优先被找到，减少冲突。
- **如果只需要 `git` 命令** ：只添加 `C:\Program Files\Git\cmd` 到 `PATH` ，这是最稳妥的做法。

如果你经常在 Windows 上开发，我也可以 介绍一种折中的方案 ： **只为 PowerShell 添加 `grep` 、 `sed` 、 `awk` 等几个常用命令的别名** ，既不会污染整个系统环境，又能方便使用 GNU 工具。

---

vue的常用用法、写法

---

如果是学习 **Vue 3** （目前主流版本），建议重点掌握 **Composition API + `<script setup>`** 写法，因为这是现在企业项目最常见的方式。

下面按实际开发中最常用的内容整理。

---

## 1\. 创建 Vue 组件

```
<script setup>
const message = 'Hello Vue'
</script>

<template>
  <h1>{{ message }}</h1>
</template>

<style scoped>
h1 {
  color: blue;
}
</style>
```

三个部分：

- `script` ：逻辑
- `template` ：页面
- `style` ：样式

---

## 2\. 数据定义

## 普通变量

```
<script setup>
const name = 'David'
</script>

<template>
{{ name }}
</template>
```

普通变量不能响应更新。

---

## ref（最常用）

```
<script setup>
import { ref } from 'vue'

const count = ref(0)

function add() {
    count.value++
}
</script>

<template>
{{ count }}

<button @click="add">+1</button>
</template>
```

特点：

```javascript
const a = ref(1)

a.value
a.value = 2
```

模板中不用 `.value` ：

```
{{ count }}
```

---

## reactive（对象）

```javascript
import { reactive } from 'vue'

const user = reactive({
    name:'Tom',
    age:20
})
```

修改：

```javascript
user.age++
user.name='Jack'
```

模板：

```
{{ user.name }}
```

---

## 3\. 事件

点击事件：

```
<button @click="add">增加</button>
```

传参数：

```
<button @click="change('Tom')">
```
```javascript
function change(name){
    console.log(name)
}
```

---

## 4\. 双向绑定

```
<input v-model="username">
```
```javascript
const username = ref('')
```

输入框内容自动同步。

---

## 5\. 条件渲染

```
<div v-if="isLogin">
欢迎
</div>

<div v-else>
请登录
</div>
```

---

多个条件：

```
<div v-if="score>=90">A</div>

<div v-else-if="score>=60">B</div>

<div v-else>C</div>
```

---

## 6\. 列表循环

```
<ul>
    <li
        v-for="item in list"
        :key="item.id"
    >
        {{ item.name }}
    </li>
</ul>
```

数据：

```javascript
const list = ref([
    {id:1,name:'Java'},
    {id:2,name:'Vue'},
    {id:3,name:'Spring'}
])
```

---

## 7\. 属性绑定

普通：

```
<img :src="url">
```

等价于

```
v-bind:src="url"
```

class

```
<div :class="{active:isActive}">
```

多个class

```
<div :class="[a,b]">
```

style

```
<div :style="{color:'red'}">
```

---

## 8\. computed（计算属性）

```javascript
import { computed } from 'vue'

const price=ref(10)
const num=ref(5)

const total=computed(()=>{
    return price.value*num.value
})
```

模板：

```
{{ total }}
```

自动更新。

---

## 9\. watch

监听变化：

```javascript
watch(count,(newValue,oldValue)=>{
    console.log(newValue)
})
```

监听对象：

```javascript
watch(user,()=>{
    console.log(user)
},{
    deep:true
})
```

---

## 10\. 生命周期

```javascript
import { onMounted } from 'vue'

onMounted(()=>{
    console.log("页面加载完成")
})
```

常见：

```javascript
onMounted()

onUnmounted()

onUpdated()
```

---

## 11\. 父子组件

父组件

```
<UserInfo :name="username"/>
```

子组件

```
<script setup>

const props=defineProps({
    name:String
})

</script>

<template>

{{ props.name }}

</template>
```

---

## 12\. 子传父

子组件：

```javascript
const emit=defineEmits(['save'])

emit('save',100)
```

父组件：

```
<UserInfo @save="saveData"/>
```
```javascript
function saveData(value){
    console.log(value)
}
```

---

## 13\. 插槽

父组件：

```
<Card>

<h2>标题</h2>

</Card>
```

子组件：

```
<div class="card">

<slot></slot>

</div>
```

---

## 14\. 请求接口（axios）

安装：

```bash
npm install axios
```

使用：

```javascript
import axios from 'axios'

const list=ref([])

onMounted(async()=>{

    const res=await axios.get('/api/user')

    list.value=res.data

})
```

---

## 15\. 路由

跳转：

```javascript
import { useRouter } from 'vue-router'

const router=useRouter()

router.push('/home')
```

获取参数：

```javascript
import { useRoute } from 'vue-router'

const route=useRoute()

console.log(route.params.id)

console.log(route.query.name)
```

---

## 16\. Pinia（状态管理）

定义：

```javascript
import { defineStore } from 'pinia'

export const useUserStore=defineStore('user',()=>{

    const token=ref('')

    function setToken(t){
        token.value=t
    }

    return{
        token,
        setToken
    }

})
```

使用：

```javascript
const store=useUserStore()

store.setToken("abc")

console.log(store.token)
```

---

## 17\. 常用指令

| 指令 | 用途 |
| --- | --- |
| `v-if` | 条件渲染 |
| `v-show` | 显示/隐藏（通过 CSS 控制） |
| `v-for` | 循环 |
| `v-model` | 双向绑定 |
| `v-bind` （`:`） | 绑定属性 |
| `v-on` （ `@` ） | 绑定事件 |
| `v-html` | 渲染 HTML（注意 XSS 风险） |
| `v-text` | 渲染文本 |
| `v-once` | 只渲染一次 |
| `v-pre` | 跳过编译 |

---

## 企业开发最常用的知识点

如果你的目标是应聘 Vue 开发岗位，建议按以下顺序掌握：

1. Vue 基础语法（插值、事件、条件、循环）
2. `ref` 、 `reactive`
3. `computed` 、 `watch`
4. 生命周期
5. 组件通信（Props、Emit、Slot）
6. `axios` 请求与接口调用
7. `vue-router`
8. `Pinia`
9. 组合式 API（ `<script setup>` ）
10. 权限控制、动态路由、项目结构等进阶内容

掌握以上内容，基本能够胜任大多数 Vue 3 中后台管理系统的开发工作。

---

我们项目还是使用vue2 ，我特别不理解插槽，我们公司内部组件库是封装于webix的，经常用到表格组件，然后表格的列配置，里面可能有什么\<template v-slot啥的，都看不懂

---

你描述的情况我非常熟悉。 **很多做 Vue2 企业项目的人，其实不是不会 Vue，而是卡在了"插槽（slot）"和"封装组件"这里。** 尤其是像你们这种 **内部组件库（基于 Webix 封装）** ，表格、表单大量依赖插槽，不理解插槽，看代码就像天书。

其实， **插槽本质上只有一句话：**

> **子组件留一个坑，父组件往坑里塞内容。**

如果记住这句话，剩下的都是不同写法。

---

## 第一步：先不要看表格，看一个最简单的例子

假设公司有个 Card 组件。

### 子组件 Card.vue

```
<template>
    <div class="card">
        <h3>标题</h3>

        <slot></slot>

    </div>
</template>
```

这里的

```
<slot></slot>
```

就是：

> **这里以后由别人决定放什么。**

---

父组件

```
<Card>

    <p>我是内容</p>

</Card>
```

最终显示就是

```html
<div class="card">
    <h3>标题</h3>

    <p>我是内容</p>

</div>
```

所以：

```
slot = 留坑
```

父组件：

```
负责填坑
```

---

## 第二步：为什么需要 slot？

比如按钮组件。

不用 slot：

```
<MyButton text="保存"/>
```

组件里面：

```
<button>{{text}}</button>
```

只能显示文字。

如果以后想放图标呢？

```
💾 保存
```

怎么办？

于是改成

```
<button>

    <slot></slot>

</button>
```

父组件：

```
<MyButton>

    <i class="icon-save"></i>

    保存

</MyButton>
```

组件根本不知道里面是什么。

可以放：

文字

图片

按钮

表单

整个 div

都可以。

所以：

> slot 就是"内容由调用者决定"。

---

## 第三步：为什么还有 v-slot？

真正让很多人懵的是这里。

例如：

```
<MyTable>

    <template v-slot:name>

        ....

    </template>

</MyTable>
```

这是什么？

这是 **具名插槽（Named Slot）** 。

假设子组件：

```
<div>

    <slot name="header"></slot>

    <slot></slot>

    <slot name="footer"></slot>

</div>
```

它有三个坑：

```
header

默认

footer
```

父组件：

```
<MyCard>

    <template v-slot:header>

        我是头

    </template>

    中间内容

    <template v-slot:footer>

        我是底

    </template>

</MyCard>
```

于是：

```
header

↓

我是头

默认

↓

中间内容

footer

↓

我是底
```

所以：

```
v-slot:xxx

意思就是：

填 xxx 这个坑。
```

---

## 第四步：为什么表格全是 template v-slot？

终于到你们项目了。

企业项目最常见：

```
<Table>

    <TableColumn field="name">

        <template v-slot="scope">

            ...

        </template>

    </TableColumn>

</Table>
```

这里其实不是 Vue 自己规定的。

而是：

**TableColumn 提供了一个 slot。**

例如：

```
第一行

name=Tom

age=20
```

Table 画出来的时候：

来到 name 这一列。

它不知道：

```
Tom
```

应该怎么显示。

于是：

它把数据交给你。

你决定怎么画。

例如：

```
Tom
```

或者：

```
😀 Tom
```

或者：

```
<a>Tom</a>
```

所以：

Table：

```
给你数据
```

slot：

```
你负责渲染
```

---

## 第五步：scope 是什么？

例如：

```
<template v-slot="scope">

{{scope}}

</template>
```

其实：

```
scope

=

当前这一行的数据
```

比如：

```javascript
{
    row:{
        id:1,
        name:"Tom",
        age:20
    },

    index:0
}
```

于是：

```
scope.row.name
```

就是：

```
Tom
```

所以经常写：

```
<template v-slot="scope">

{{scope.row.name}}

</template>
```

或者

```
<template slot-scope="scope">
```

Vue2 老项目大量都是这个。

它和

```
v-slot="scope"
```

意思一样。

---

## 第六步：为什么公司代码都是这样？

例如：

```
<my-table
    :columns="columns"
>
```

columns：

```javascript
[
    {
        field:"name",
        title:"姓名"
    },
    {
        field:"age",
        title:"年龄"
    }
]
```

普通列：

```
Tom

18
```

但是如果：

年龄需要显示颜色：

```
18岁

绿色

80岁

红色
```

那 columns 已经表达不了了。

于是：

提供 slot。

```
<MyTable>

    <template v-slot:age="{row}">

        <span style="color:red">

            {{row.age}}

        </span>

    </template>

</MyTable>
```

这就是很多组件库：

ElementUI

Ant Design Vue

公司内部组件库

Webix 封装

全部都喜欢这么干的原因。

---

## 你们公司最可能看到的代码

如果你们是封装 Webix 的表格，我猜大概率会出现类似下面的代码：

```
<MyTable :columns="columns" :data="list">
  <template v-slot:name="{ row }">
    <a @click="open(row)">
      {{ row.name }}
    </a>
  </template>

  <template v-slot:status="{ row }">
    <span v-if="row.status === 1">启用</span>
    <span v-else>禁用</span>
  </template>
</MyTable>
```

这里可以理解成：

- `v-slot:name` ：告诉表格， **`name` 这一列我自己画** 。
- `{ row }` ：表格把 **当前行的数据** 交给你。
- `{{ row.name }}` ：取当前行的 `name` 字段。
- 其他没有写 `v-slot` 的列，还是按默认方式显示。

---

## 我建议你这样学

**不要从 Vue 官方文档学插槽，而是从你们项目里的一个表格组件学。**

你可以把项目里的一段类似下面的代码（30～50 行即可）发给我，例如：

```
<MyTable ...>
  ...
  <template v-slot:xxx="scope">
    ...
  </template>
</MyTable>
```

或者：

```
<template slot-scope="scope">
```

我会 **结合你们公司的组件** ，逐行解释：

- 这一行是谁提供的？
- `v-slot:xxx` 到底对应哪里？
- `scope` 里面到底有哪些字段？
- 为什么这里要用插槽，而不用普通配置？

这样你以后再看公司其他页面，基本就都能读懂了。

---

\<template v-slot:xxx="scope">和\<template slot-scope="scope">有什么区别？以及在里面的scope是什么意思，表示什么?

---

这是 Vue2 里面 **最容易让人迷惑** 的地方，也是很多人工作一年都没彻底弄明白的地方。

其实先告诉你结论：

```
<template v-slot:xxx="scope">
```

和

```
<template slot="xxx" slot-scope="scope">
```

**功能完全一样。**

区别只是 **语法不同** 。

- `slot-scope` 是 **Vue2 早期写法** （Vue 2.5 及以前常见）。
- `v-slot` 是 **Vue2.6 推出的新语法** ，也是 Vue3 保留的语法。
- 现在官方推荐用 `v-slot` 。

---

## 一、先理解：为什么会有 scope？

假设我们写一个最简单的表格组件。

子组件（Table.vue）：

```
<template>
  <table>
    <tr v-for="item in list" :key="item.id">
      <td>
        <slot :row="item"></slot>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { id: 1, name: 'Tom', age: 18 },
        { id: 2, name: 'Jack', age: 20 }
      ]
    }
  }
}
</script>
```

注意这一句：

```
<slot :row="item"></slot>
```

它的意思不是普通插槽。

而是：

> **我除了留坑，还把当前这一行的数据一起交给父组件。**

这就叫 **作用域插槽（Scoped Slot）** 。

---

## 二、父组件怎么接收？

父组件：

```
<MyTable>
  <template slot-scope="scope">
    {{ scope.row.name }}
  </template>
</MyTable>
```

第一次循环：

```javascript
item = {
    id:1,
    name:"Tom",
    age:18
}
```

于是：

```javascript
scope = {
    row:{
        id:1,
        name:"Tom",
        age:18
    }
}
```

第二次循环：

```javascript
scope = {
    row:{
        id:2,
        name:"Jack",
        age:20
    }
}
```

所以：

```
{{ scope.row.name }}
```

第一次显示：

```
Tom
```

第二次显示：

```
Jack
```

---

## 三、为什么叫 scope（作用域）？

其实：

```
slot-scope="scope"
```

里面的 **scope 只是变量名！**

完全可以写：

```
<template slot-scope="abc">
```

那么：

```
{{ abc.row.name }}
```

一样能运行。

甚至：

```
<template slot-scope="haha">
```
```
{{ haha.row.name }}
```

也没问题。

所以：

```
scope
```

不是 Vue 关键字。

只是大家约定俗成都叫它 scope。

---

## 四、v-slot 也是一样

例如：

```
<template v-slot="scope">
```

等价于：

```
<template slot-scope="scope">
```

都是：

> **把子组件传出来的数据保存到一个变量里面。**

---

## 五、scope 里面到底有什么？

很多公司都会写：

```
<template v-slot="scope">
```

然后：

```
{{ scope }}
```

如果打印出来（比如 `console.log(scope)` ），可能看到：

```javascript
{
    row: {
        id: 1,
        name: "Tom",
        age: 18
    },
    index: 0,
    column: {
        field: "name"
    }
}
```

说明：

Table 把很多东西都传给你了。

例如：

```
当前行(row)
当前列(column)
行号(index)
```

不同组件库传的不一样。

例如：

**ElementUI：**

```javascript
scope.row
scope.column
scope.$index
```

**Ant Design Vue：**

```javascript
record
text
index
```

**你们公司的 Webix 封装**

可能叫：

```javascript
scope.item
scope.record
scope.data
```

要看组件怎么封装。

---

## 六、为什么很多项目写 { row }？

因为 JavaScript 支持对象解构。

原来：

```
<template v-slot="scope">

{{ scope.row.name }}

</template>
```

可以直接写成：

```
<template v-slot="{ row }">

{{ row.name }}

</template>
```

意思就是：

```javascript
const row = scope.row
```

所以：

```
{{ row.name }}
```

就够了。

甚至：

```
<template v-slot="{ row,index }">
```

等价于：

```javascript
const row = scope.row
const index = scope.index
```

所以以后很多代码都会这么写。

---

## 七、再回到你们公司的表格

你们很可能有这种代码：

```
<MyTable :columns="columns">
  <template v-slot:name="scope">
    {{ scope.row.name }}
  </template>
</MyTable>
```

你可以把它理解成一句普通 JavaScript：

```javascript
renderNameColumn(scope) {
    // scope 是表格传进来的参数
    return scope.row.name;
}
```

也就是说， **表格负责把当前行的数据传给你，你负责决定这一列怎么渲染。**

---

### 最后记住一句话（这是理解插槽最重要的一句话）

**`scope` 不是 Vue 自动生成的特殊对象，而是子组件通过 `<slot>` 主动传给父组件的数据对象。**

例如：

子组件：

```
<slot :row="row" :index="index"></slot>
```

父组件：

```
<template v-slot="scope">
```

那么：

```javascript
scope = {
  row: row,
  index: index
}
```

如果子组件改成：

```
<slot :user="user" :age="18"></slot>
```

那么父组件收到的就是：

```javascript
scope = {
  user: user,
  age: 18
}
```

所以 **`scope` 里面有什么，完全取决于子组件通过 `<slot>` 暴露了哪些属性** ，而不是 Vue 固定规定的。理解了这一点，再看任何组件库（包括你们基于 Webix 封装的组件）的插槽代码都会容易很多。

---

可是你前面不是说\<template v-slot="scope">是具名插槽吗？我还以为scope是插槽名称？具名插槽是指必须和子组件的这个插槽名称一致才能够对应？？

---

你这个问题问得特别好，而且 **你正好发现了 Vue 插槽最容易混淆的地方** 。

实际上， **`v-slot` 后面有两个位置，它们表示的是两件完全不同的事情。**

例如：

```
<template v-slot:name="scope">
```

这里可以拆成两部分：

```
v-slot:name="scope"
       ↑        ↑
    插槽名字   接收的数据
```

所以：

- **`name`** 是 **插槽名称（slot name）**
- **`scope`** 是 **变量名** （你自己起的）

它们完全不是一回事。

---

## 先看没有数据传递的情况

子组件：

```
<div>
    <slot name="header"></slot>

    <slot></slot>

    <slot name="footer"></slot>
</div>
```

这里定义了三个插槽：

```
header

默认

footer
```

父组件：

```
<MyCard>

    <template v-slot:header>
        头部
    </template>

    内容

    <template v-slot:footer>
        底部
    </template>

</MyCard>
```

这里

```
v-slot:header
```

中的

```
header
```

就是 **插槽名称** 。

它必须和子组件一致。

否则：

```
<slot name="header"></slot>
```

对应不上

```
v-slot:title
```

因为：

```
header ≠ title
```

所以不会显示。

---

## 再看作用域插槽

子组件：

```
<slot
    name="name"
    :row="row"
    :index="index">
</slot>
```

这里其实发生了两件事。

第一件：

```
name
```

表示：

> 我这个坑叫 **name** 。

第二件：

```
:row="row"

:index="index"
```

表示：

> 我还额外送给你两个数据。

---

父组件：

```
<template
    v-slot:name="scope">

    {{ scope.row.name }}

</template>
```

现在拆开来看：

```
v-slot:name="scope"

name
↑
找到 name 插槽

scope
↑
把子组件传来的数据保存到 scope
```

所以：

```
name

负责：

找哪个坑

----------------

scope

负责：

接收坑里面传出来的数据
```

这是两个完全不同的东西。

---

## 为什么又有这种写法？

你可能还见过：

```
<template v-slot="scope">
```

这里为什么没有名字？

因为：

它对应的是

```
<slot></slot>
```

默认插槽。

所以：

```
v-slot
```

其实完整写法应该理解成：

```
v-slot:default
```

官方允许省略。

所以：

```
<template v-slot="scope">
```

其实等价于

```
<template v-slot:default="scope">
```

意思就是：

```
默认插槽

↓

把数据存到 scope
```

---

## 为什么大家容易误会？

因为下面这两个写法长得太像了。

### 第一种

```
v-slot:name
```

这里

```
name
```

是插槽名字。

---

第二种

```
v-slot="scope"
```

这里

```
scope
```

不是插槽名字。

而是：

```
接收插槽数据的变量。
```

所以很多人第一次看都会误以为：

> scope 是插槽名称。

其实不是。

---

## 我画一个流程图，你一下就能理解。

子组件：

```
我这里有一个坑

↓

名字叫：

name

↓

我还把数据一起给你：

row

index
```

对应代码：

```
<slot
    name="name"
    :row="row"
    :index="index">
</slot>
```

---

父组件：

```
我要填

↓

name

这个坑

↓

顺便把里面的数据

↓

取出来

↓

放到

scope

变量里
```

对应：

```
<template
    v-slot:name="scope">

</template>
```

于是：

```
scope

=

{

    row: ...

    index: ...

}
```

---

## 最后送你一个记忆口诀（很多人学 Vue 时都是靠这个彻底记住的）

看到：

```
v-slot:xxx="yyy"
```

就拆成两部分理解：

```
xxx
↓↓↓

我要填哪个插槽

-------------------

yyy
↓↓↓

插槽给我的数据放哪里
```

所以：

```
v-slot:header="scope"
```

就是：

> 我填 **header** 插槽，并把子组件传来的数据保存到 **scope** 。

而：

```
v-slot="{ row }"
```

则表示：

> 我填默认插槽，并直接把传来的对象解构出 `row` 。

---

**我还有一个建议。 **如果你们公司大量使用** 表格组件** ，我可以专门用\*\*表格列（Column）\*\*这个真实场景，把 `v-slot:列名` 、 `scope.row` 、 `slot-scope` 、 `render` 之间的关系画成一张图。很多人看完那张图之后，就彻底理解企业项目里的插槽了。

---

还有一点不懂，就是你说父组件要填坑，然后又取数据，我感觉这两个操作是反的呀，感觉父组件和子组件的关系有点奇怪

---

哈哈，你问到 **插槽最本质的问题** 了。很多人就是卡在这里。

你的困惑其实可以总结成一句话：

> **父组件不是应该给子组件传东西吗？为什么现在又变成子组件给父组件数据？这不是反了吗？**

答案是：

> **其实没有反，它们各自负责不同的事情。**

我们一步一步来看。

---

## 普通组件（没有 slot）

这是你最熟悉的。

父组件：

```
<UserInfo :user="user"/>
```

子组件：

```
props: {
    user: Object
}
```

方向很明确：

```
父组件
   │
   │ user
   ▼
子组件
```

父传子。

---

## 普通插槽

现在换一种情况。

子组件：

```
<div class="card">

    <slot></slot>

</div>
```

它在说：

> 我已经把卡片画好了。

> **但是里面放什么，我不知道。**

于是父组件：

```
<Card>

    我是内容

</Card>
```

方向变成：

```
父组件
    │
    │ 内容
    ▼
slot
    ▼
子组件
```

还是父给子。

并没有反。

---

## 为什么还要"子给父数据"？

这就是 **作用域插槽** 。

想象一下表格。

子组件（Table）：

```
┌──────────────┐
│Tom     18    │
│Jack    20    │
│Lucy    30    │
└──────────────┘
```

这里的数据是谁有？

当然是：

```
Table
```

因为：

```
Table

↓

自己正在循环

list
```

例如：

```javascript
list.forEach(item=>{

})
```

当前：

```
item
```

只有 Table 自己知道。

父组件根本不知道。

---

可是：

父组件想自己画这一列。

例如：

```
Tom

↓

变成

🔵 Tom
```

怎么办？

Table 必须告诉父组件：

> "兄弟，我现在循环到 Tom 这一行了。"

于是：

```
<slot
    :row="item">
</slot>
```

就是：

```
Table

↓

把

当前行

给父组件
```

---

所以：

真正发生的是：

```
Table

↓

"我给你当前这一行"

↓

父组件

↓

"好，我负责画出来"
```

是不是感觉像：

老板：

> 给你材料。

员工：

> 我负责加工。

---

## 所以 slot 其实发生了两件事

很多人没有意识到：

slot 同时承担两个职责。

第一：

```
父组件

↓

提供模板
```

第二：

```
子组件

↓

提供数据
```

于是：

最终：

```
父组件

↓

模板（长什么样）

+

子组件

↓

数据（画什么）
```

两者结合：

得到最终结果。

---

## 用一个生活例子

假设你去奶茶店。

老板（子组件）：

> 杯子我准备好了。

> 奶茶我也做好了。

> **但是标签你自己写。**

于是：

老板把奶茶递给你：

```
奶茶

↓

口味：杨枝甘露

甜度：三分糖
```

你：

```
拿到数据

↓

写标签：

🔥 今日推荐

杨枝甘露（三分糖）
```

是不是：

老板提供数据。

你提供显示方式。

最后：

老板负责贴到杯子上。

这就是作用域插槽。

---

## 回到表格

假设：

```javascript
list=[
    {
        name:"Tom",
        age:18
    }
]
```

Table：

循环：

```javascript
for(let row of list){

}
```

来到：

```javascript
row={
    name:"Tom",
    age:18
}
```

Table：

```
把 row

交给父组件
```

父组件：

```
<template v-slot="{row}">

    <span style="color:red">

        {{row.name}}

    </span>

</template>
```

父组件：

只负责：

```
怎么画
```

Table：

负责：

```
什么时候画

画几次

循环多少次

每次是哪一行
```

---

## 所以真正的关系应该画成这样

普通组件：

```
父

↓

数据

↓

子
```

普通插槽：

```
父

↓

内容

↓

子
```

作用域插槽：

```
数据
子 ----------------> 父

          模板
父 ----------------> 子
```

**它其实是一个"合作"关系。**

- 子组件掌握数据和渲染时机（例如表格知道当前是哪一行）。
- 父组件掌握展示方式（例如姓名显示蓝色、状态显示成标签、按钮怎么摆）。

所以会出现一种看似"双向"的交互： **父组件把模板传进去，子组件在需要的时候拿这个模板来渲染，并把自己的数据作为参数传给模板。**

---

**我觉得你已经快理解到位了。 **很多人真正恍然大悟，是把 `v-slot` 当成** 一个带参数的回调函数** 来看，而不是普通的 HTML 标签。这样 `scope` 为什么会有数据、为什么父组件既"填坑"又能"拿数据"，都会变得非常自然。如果你愿意， 我可以用 **JavaScript 函数回调** （不用任何 Vue 代码）来类比 `slot` ，那个类比几乎是一一对应的，很多后端开发和前端新人都是靠这个彻底理解作用域插槽的。

---

用 JavaScript 函数回调类比 slot

---

**就是这个！** 我觉得这是理解插槽最好的方法。

实际上， **Vue 的插槽（特别是作用域插槽）在底层思想上，非常像 JavaScript 的"回调函数"。**

---

## 先看最普通的回调

假设你写了一个函数：

```javascript
function say(callback) {
    console.log("开始");

    callback();

    console.log("结束");
}
```

调用：

```javascript
say(function () {
    console.log("Hello");
});
```

输出：

```
开始
Hello
结束
```

这里发生了什么？

**`say()` 并不知道 callback 里面写了什么。**

它只是：

> **"这里留了一个位置，等别人传一个函数进来。"**

是不是很像：

```
<slot></slot>
```

留了一个坑。

---

## 再升级一点

假设：

```javascript
function say(callback) {

    let name = "Tom";

    callback(name);
}
```

调用：

```javascript
say(function (name) {

    console.log(name);

});
```

输出：

```
Tom
```

有没有发现？

这里：

```
callback(name)
```

其实就是：

> **我不仅调用你。**

> **我还把数据给你。**

是不是特别像：

```
<slot :name="name"></slot>
```

是不是一模一样？

---

## 完全对应起来

JavaScript：

```javascript
function table(render) {

    let row = {
        name: "Tom",
        age: 18
    };

    render(row);
}
```

调用：

```javascript
table(function (row) {

    console.log(row.name);

});
```

输出：

```
Tom
```

这里：

```
render
```

就是：

> 父组件提供的模板。

而：

```
row
```

就是：

> 子组件提供的数据。

是不是开始眼熟了？

---

## 对应到 Vue

JavaScript：

```javascript
table(function (row) {

    console.log(row.name);

});
```

Vue：

```
<MyTable>

    <template v-slot="{ row }">

        {{ row.name }}

    </template>

</MyTable>
```

其实：

```
template

≈

function
```

是不是神奇？

---

## 为什么父组件既填坑又拿数据？

我们继续看 JS。

```javascript
function table(render) {

    let row = {
        name: "Tom"
    };

    render(row);

}
```

这里：

谁写了 render？

答案：

调用者。

```javascript
table(function (row) {

    console.log(row.name);

});
```

是不是调用者写的？

但是：

谁调用 render？

答案：

table。

所以：

```
调用者

↓

写函数

↓

table

↓

调用函数

↓

把 row 给函数
```

是不是和 Vue 一样？

---

## 再看 Vue

父组件：

```
<MyTable>

    <template v-slot="{ row }">

        {{ row.name }}

    </template>

</MyTable>
```

这里：

父组件：

```
写模板
```

Table：

```
调用模板
```

同时：

```
把 row 给模板
```

是不是和 callback 完全一致？

---

## 为什么叫作用域插槽？

看 JS：

```javascript
function table(render) {

    let row = {
        name: "Tom"
    };

    render(row);

}
```

这里：

```
row
```

属于谁？

属于：

```
table
```

不是调用者。

但是：

table 把它：

```
传给 render
```

于是：

render：

```javascript
function (row) {

}
```

里面：

就能访问：

```
row
```

Vue：

也是一样。

Table：

```
有 row
```

父组件：

原本没有。

但是：

Table：

```
通过 slot

↓

传过去
```

于是：

父组件：

```
{{ row.name }}
```

就能用了。

所以：

> **作用域插槽，就是把子组件作用域里的变量，借给父组件使用。**

---

## 再举一个特别像你们表格的例子

JavaScript：

```javascript
function renderTable(data, renderCell) {

    for (let row of data) {

        renderCell(row);

    }

}
```

调用：

```javascript
renderTable(users, function (row) {

    console.log(
        \`<a>${row.name}</a>\`
    );

});
```

这里：

```
renderTable
```

负责：

```
循环
```

调用者：

负责：

```
怎么画这一行
```

是不是就是企业里的 Table？

---

Vue：

```
<MyTable :data="users">

    <template v-slot="{ row }">

        <a>{{ row.name }}</a>

    </template>

</MyTable>
```

是不是一模一样？

---

## 最后，整个过程可以画成这样

**JavaScript 回调：**

```
你写 callback
        │
        ▼
table(callback)
        │
        ▼
table 内部循环
        │
        ▼
callback(row)
```

**Vue 作用域插槽：**

```
你写 template
        │
        ▼
<MyTable>
        │
        ▼
Table 内部循环
        │
        ▼
slot(row)
```

你会发现， **`<template v-slot>` 本质上就是"把一段模板当成一个带参数的回调函数传给子组件"。**

---

## 再补充一个关键点：为什么 \<template> 看起来不像函数？

因为 Vue 帮你把它"编译"了。

你写的是：

```
<template v-slot="{ row }">
  {{ row.name }}
</template>
```

你可以把它 **脑补** 成下面这种伪代码：

```javascript
renderSlot(function ({ row }) {
    return row.name;
});
```

注意这是 **帮助理解的伪代码** ，不是 Vue 的真实源码。

也就是说：

- `<template>` ≈ 一个回调函数。
- `v-slot="{ row }"` ≈ 函数参数。
- `{{ row.name }}` ≈ 函数体。

这样一来，你之前的疑问就都串起来了：

- 为什么父组件既"填坑"又能"拿数据"？——因为它提供的是一个 **可被调用的模板（回调）** 。
- 为什么 `scope` 会有值？——因为 **子组件调用这个模板时，把自己的数据作为参数传了进去** 。
- 为什么表格特别爱用插槽？——因为表格掌握数据和循环，而每一列如何显示需要交给业务代码决定，这正是"回调"最适合解决的问题。

---

也就是说不管是普通的父子组件还是涉及插槽的，实际上渲染和处理的都是子组件在搞，对于插槽的，父组件只是告诉子组件模板（也就是渲染方式），但是因为告诉渲染方式需要数据来描述，所以子组件也会把数据传给父组件，方便父组件来描述怎么渲染？？

---

**对！你的理解已经非常接近本质了。** 我稍微帮你修正一下几个词，就几乎完全正确了。

你说的是：

> **父组件只是告诉子组件模板（也就是渲染方式），但是因为告诉渲染方式需要数据来描述，所以子组件也会把数据传给父组件，方便父组件来描述怎么渲染。**

我会改成下面这句话（这是我认为最准确的说法）：

> **父组件把"渲染模板"交给子组件，子组件在渲染的时候调用这份模板，并把自己当前的数据作为参数传进去。**

注意这里不是：

> 子组件把数据传给父组件，让父组件渲染。

而是：

> **子组件仍然负责渲染，只不过渲染到某一块的时候，会调用父组件提供的模板。**

这个区别很重要。

---

## 用表格举例（最符合你们公司的场景）

假设你们有：

```
<MyTable :data="users">
  <template v-slot:name="{ row }">
    <a>{{ row.name }}</a>
  </template>
</MyTable>
```

很多人以为流程是：

```
父组件渲染 name 列
```

其实不是。

真正发生的是：

```
MyTable 开始渲染
      │
      ▼
第一行 Tom
      │
      ▼
哦，这一列有 slot
      │
      ▼
调用父组件给的模板
      │
      ▼
把 row=Tom 传进去
      │
      ▼
得到 <a>Tom</a>
      │
      ▼
MyTable 把它放到 td 里面
```

整个过程一直都是 **MyTable 在控制渲染节奏** 。

---

## 用 JavaScript 伪代码，你会看得更清楚

你的表格内部，大概可以理解成：

```javascript
function renderTable(renderName) {

    for (const row of users) {

        console.log("<tr>");

        // 这里不是父组件主动来渲染
        // 而是 Table 主动调用父组件提供的函数

        renderName(row);

        console.log("</tr>");
    }

}
```

父组件只是提供了：

```javascript
function renderName(row) {

    return \`<a>${row.name}</a>\`;

}
```

注意是谁调用谁：

```
Table
   │
   ▼
renderName(row)
```

不是：

```
renderName
   │
   ▼
Table
```

所以 **控制权一直在子组件。**

---

## 为什么要把 row 给模板？

因为父组件写模板的时候：

```
<template v-slot:name>
    <a>????</a>
</template>
```

它根本不知道：

```
现在是哪一行？
```

于是 Table 必须说：

> "兄弟，我现在正在渲染 Tom 这一行。"

于是：

```
<template v-slot:name="{ row }">
```

这里的

```javascript
row
```

就是：

> Table 当前正在处理的数据。

然后父组件才能写：

```
<a>{{ row.name }}</a>
```

否则它根本不知道该显示谁。

---

## 其实插槽特别像 React 的 render prop

如果以后你接触 React，你会发现：

```javascript
<Table
    renderName={(row)=>(
        <a>{row.name}</a>
    )}
/>
```

和 Vue：

```
<template v-slot:name="{ row }">

    <a>{{ row.name }}</a>

</template>
```

本质上是同一种设计思想。

都是：

> **组件掌握流程，业务掌握显示。**

---

## 我觉得你已经理解到 90% 了。

最后我帮你修正一句你说的话。

你说：

> **子组件也会把数据传给父组件，方便父组件来描述怎么渲染。**

我会改成：

> **子组件在渲染过程中，会调用父组件提供的模板，并把当前的数据作为参数传进去，这样模板才能知道当前正在渲染什么。**

这句话里面有两个关键词：

- **调用（call）** —— 像调用回调函数。
- **参数（parameter）** —— `scope` 、 `row` 本质就是参数。

如果你以后看到：

```
<template v-slot="{ row, index }">
```

你可以直接在脑子里翻译成 JavaScript：

```javascript
function render(row, index) {

}
```

几乎一点都不会错。

---

**还有一个容易忽略但很重要的点** ：为什么作用域插槽叫"作用域（scoped）"？

因为像 `row` 这样的变量， **正常情况下只存在于子组件内部** ，父组件是访问不到的。作用域插槽就是子组件 **有选择地** 把这些内部变量作为参数暴露给父组件使用。所以它并没有打破父子组件的数据流，而是子组件在调用父组件提供的模板时，临时把自己的局部变量传了进去。这也是"作用域插槽"这个名字的由来。

---

前端好像经常涉及什么异步，异步和回调函数有什么关系

---

这个问题问得非常好，而且 **这是前端最重要的知识之一** 。

很多人把 **异步** 、 **回调函数** 、 **Promise** 、 **async/await** 混在一起，其实它们不是同一个东西，而是层层演进的关系。

先说一句最重要的话：

> **回调函数不是异步，异步也不是回调。回调只是异步的一种实现方式。**

---

## 一、什么叫同步？

先看同步。

```javascript
console.log("开始");

console.log("学习Vue");

console.log("结束");
```

输出：

```
开始
学习Vue
结束
```

特点：

> **上一句执行完，下一句才能执行。**

这叫同步（Sync）。

---

## 二、什么叫异步？

假设：

```javascript
console.log("开始");

setTimeout(() => {
    console.log("两秒后");
}, 2000);

console.log("结束");
```

输出：

```
开始
结束
（2秒后）
两秒后
```

为什么？

因为：

```javascript
setTimeout(...)
```

不会阻塞下面的代码。

它会告诉浏览器：

> "两秒之后，你再来执行这个函数。"

于是：

主线程继续往下跑。

这就是异步。

---

## 三、回调函数是什么？

看这里：

```javascript
setTimeout(() => {

    console.log("Hello");

},1000);
```

里面：

```javascript
() => {

    console.log("Hello");

}
```

就是：

**回调函数（callback）**

为什么叫回调？

因为：

不是你调用它。

而是：

浏览器以后再调用它。

流程：

```
你

↓

把函数交给浏览器

↓

浏览器记下来

↓

时间到了

↓

浏览器再调用这个函数
```

所以：

```javascript
setTimeout(callback,1000)
```

其实就是：

> 浏览器："以后我再调用 callback。"

---

## 四、为什么前端到处都是异步？

因为：

很多事情需要等待。

例如：

请求服务器：

```javascript
axios.get("/user")
```

服务器：

可能：

```
50ms

500ms

5秒

都有可能。
```

如果：

JavaScript：

一直等着。

那么：

整个网页：

```
不能点按钮

不能滚动

不能输入

卡死
```

所以：

浏览器：

说：

> "你别等。"

> "请求先发出去。"

> "回来以后我通知你。"

于是：

以前：

```javascript
ajax("/user",function(result){

    console.log(result);

});
```

这里：

```javascript
function(result){

}
```

就是：

回调函数。

服务器回来以后：

浏览器：

再调用：

```javascript
callback(result)
```

---

## 五、Promise 是什么？

后来：

大家发现：

回调太难写。

例如：

```javascript
getUser(function(user){

    getOrder(user.id,function(order){

        getAddress(order.id,function(address){

            ...

        })

    })

})
```

一层套一层。

像：

```
getUser

    getOrder

        getAddress

            getXXX
```

这就是：

著名的：

**回调地狱（Callback Hell）**

---

于是：

ES6：

推出：

Promise。

例如：

```javascript
axios.get("/user")

.then(res=>{

    console.log(res);

});
```

这里：

还是：

异步。

只是：

不用：

callback 参数。

改成：

```javascript
.then()
```

注册：

一个：

以后执行的函数。

---

## 六、async/await

后来：

Promise：

还是：

不好看。

于是：

变成：

```javascript
async function load(){

    const res=await axios.get("/user");

    console.log(res);

}
```

是不是：

像同步？

其实：

还是：

异步。

只是：

写法：

更像：

同步。

---

## 七、它们之间到底是什么关系？

可以画成：

```
异步（目的）

│

├── 回调(callback)

│

├── Promise

│

└── async/await
```

注意：

**异步是目标。**

后面：

都是：

实现异步的方式。

---

## 八、为什么 slot 又像回调？

你是不是发现：

我之前说：

slot：

像：

callback。

现在：

callback：

又经常：

用于：

异步。

是不是：

slot：

也是：

异步？

答案：

**不是。**

例如：

```
<MyTable>

    <template v-slot="{row}">

    </template>

</MyTable>
```

这里：

Table：

立即：

调用：

slot。

没有：

等待。

所以：

这是：

**同步回调。**

而：

```javascript
setTimeout(callback)
```

这里：

过了：

2秒。

才调用。

这是：

**异步回调。**

所以：

真正的关系：

```
回调

├── 同步回调
│      │
│      ├── Array.map()
│      ├── Array.forEach()
│      ├── Vue slot
│
└── 异步回调
       │
       ├── setTimeout
       ├── ajax
       ├── addEventListener
```

你会发现：

**slot 和 callback 确实是一个思想。**

只是：

一个：

立即调用。

一个：

以后调用。

---

## 最后，我觉得下一步你应该学什么

从你问的问题来看，你已经开始把 Vue 的语法和 JavaScript 的底层联系起来了，这是非常好的学习方向。

我建议按下面这个顺序理解，很多 Vue 代码都会变得容易读：

1. **函数是一等公民** （函数可以作为参数、返回值）
2. **回调函数**
3. **同步回调 vs 异步回调**
4. **Promise**
5. **async / await**
6. **事件循环（Event Loop）**

尤其是 **事件循环** ，它会解释为什么：

```javascript
console.log(1);

setTimeout(() => console.log(2), 0);

Promise.resolve().then(() => console.log(3));

console.log(4);
```

最终输出不是按你想象的顺序，而是：

```
1
4
3
2
```

理解了这一套之后，前端里关于异步的大部分疑惑都会迎刃而解。

---

先过一遍常用语法，JS还有哪些常用的对象，比如什么对象解构、?.写法、数组/字符串的常用方法等等

---

我觉得你的学习路线可以调整一下。

**如果你的目标是看懂 Vue2 企业项目，而不是考 JS 面试，那么不用把整个 JavaScript 学完。** 先把企业项目里 **90% 会出现的语法** 过一遍，基本就够了。

我按照 **在 Vue2 项目中出现频率** 给你整理。

---

## 第一部分：对象(Object)

这是 Vue 项目出现最多的。

## 1\. 对象解构（★★★★★）

原来：

```javascript
const user = {
    name: "Tom",
    age: 18
}

const name = user.name;
const age = user.age;
```

现在：

```javascript
const { name, age } = user;

console.log(name);
console.log(age);
```

Vue 里面特别多：

```javascript
const { row } = scope;

const { id, name } = row;
```

其实就是：

```javascript
const row = scope.row;
```

---

## 2\. 重命名

```javascript
const user = {
    name: "Tom"
}

const { name: userName } = user;

console.log(userName);
```

等于：

```javascript
const userName = user.name;
```

---

## 3\. 默认值

```javascript
const user = {}

const { age = 18 } = user;
```

结果：

```
18
```

---

## 4\. 可选链?.（★★★★★）

以前：

```javascript
user &&
user.address &&
user.address.city
```

现在：

```javascript
user?.address?.city
```

如果：

```javascript
user = null
```

不会报错。

返回：

```
undefined
```

Vue 项目超级常见。

---

## 5\. 空值合并??

例如：

```javascript
let name = null;

console.log(name ?? "默认");
```

输出：

```
默认
```

但是：

```javascript
let name = "";

console.log(name ?? "默认");
```

输出：

```
""
```

区别于：

```javascript
name || "默认"
```

---

## 6\. 展开运算符（★★★★★）

对象：

```javascript
const a = {
    name: "Tom"
}

const b = {
    ...a,
    age:18
}
```

得到：

```javascript
{
    name:"Tom",
    age:18
}
```

Vue：

修改对象经常这样：

```javascript
this.form = {
    ...this.form,
    name:"Jack"
}
```

---

## 第二部分：数组(Array)

Vue 项目天天用。

---

## 1\. map（★★★★★）

```javascript
const arr=[1,2,3];

const newArr=arr.map(item=>item*2);
```

结果：

```javascript
[2,4,6]
```

---

## 2\. filter（★★★★★）

过滤。

```javascript
const arr=[1,2,3,4];

const result=arr.filter(item=>item>2);
```

结果：

```javascript
[3,4]
```

---

## 3\. find（★★★★★）

找一个。

```javascript
const list=[
    {id:1},
    {id:2}
]

const obj=list.find(item=>item.id===2);
```

得到：

```javascript
{id:2}
```

---

## 4\. some

有没有。

```javascript
arr.some(item=>item>10)
```

返回：

```
true

false
```

---

## 5\. every

全部满足。

```javascript
arr.every(item=>item>0)
```

---

## 6\. includes

```javascript
arr.includes(3)
```

---

## 7\. push

新增。

```javascript
arr.push(obj)
```

---

## 8\. splice

删除。

```javascript
arr.splice(index,1)
```

---

## 9\. forEach（★★★★★）

遍历。

```javascript
arr.forEach(item=>{

})
```

---

## 第三部分：字符串(String)

---

## includes

```javascript
str.includes("abc")
```

---

## startsWith

```javascript
str.startsWith("http")
```

---

## endsWith

```javascript
str.endsWith(".jpg")
```

---

## split

```javascript
"a,b,c".split(",")
```

得到：

```javascript
["a","b","c"]
```

---

## join

```javascript
["a","b"].join("-")
```

得到：

```
a-b
```

---

## trim

去空格。

---

## replace

```javascript
str.replace("Tom","Jack")
```

---

## 第四部分：箭头函数（★★★★★）

普通：

```javascript
function add(a,b){

    return a+b;

}
```

箭头：

```javascript
const add=(a,b)=>{

    return a+b;

}
```

如果只有一句：

```javascript
const add=(a,b)=>a+b;
```

Vue 项目几乎到处都是。

---

## 第五部分：模板字符串

以前：

```javascript
"hello "+name
```

现在：

```javascript
\`hello ${name}\`
```

---

## 第六部分：Promise

虽然 Vue2 老项目有回调，但 axios 基本都是 Promise。

```javascript
axios.get("/user")
.then(res=>{

})
.catch(err=>{

})
.finally(()=>{

})
```

---

## 第七部分：常见判断

### 三元运算符

```javascript
age>=18?"成年":"未成年"
```

---

### ||

```javascript
name=name||"默认";
```

---

### ??

推荐：

```javascript
name=name??"默认";
```

---

## 第八部分：ES6 导入导出

Vue 每天都会看到。

导出：

```javascript
export default {}
```

导入：

```javascript
import User from "./User.vue"
```

命名导出：

```javascript
export function add(){}
```

导入：

```javascript
import {add} from "./utils"
```

---

## 第九部分：this

Vue2 最大特点。

例如：

```javascript
this.list

this.form

this.$router

this.$emit()

this.$refs
```

Vue3 基本没有 this。

---

## 第十部分：最容易看不懂的几个语法

例如：

```javascript
const {row}=scope
```

就是：

```javascript
const row=scope.row
```

---

```javascript
const {row,index}=scope
```

就是：

```javascript
const row=scope.row

const index=scope.index
```

---

```javascript
const {name,...other}=user
```

结果：

```javascript
name

↓

Tom
```

other：

```javascript
{
    age:18,
    sex:"男"
}
```

---

```javascript
const list=[...list1,...list2]
```

合并数组。

---

```javascript
const obj={
    ...obj1,
    ...obj2
}
```

后面的覆盖前面的。

---

## 最后，按照企业项目中的重要程度排序

如果只考虑 **Vue2 + ElementUI/Webix + axios** 这种典型企业项目，我建议按这个顺序掌握：

| 优先级 | 内容 | 为什么重要 |
| --- | --- | --- |
| ⭐⭐⭐⭐⭐ | 对象解构 `{}` | 插槽、接口返回值、组件通信到处都是 |
| ⭐⭐⭐⭐⭐ | 箭头函数 `=>` | 几乎所有新代码都在用 |
| ⭐⭐⭐⭐⭐ | `map` 、 `filter` 、 `find` 、 `forEach` | 数组处理最常见 |
| ⭐⭐⭐⭐⭐ | 展开运算符 `...` | 合并对象、数组、修改数据 |
| ⭐⭐⭐⭐⭐ | `?.`、`??` | 防止空对象报错，现代项目非常常见 |
| ⭐⭐⭐⭐☆ | Promise（ `then/catch` ） | `axios` 请求接口必备 |
| ⭐⭐⭐⭐☆ | 模板字符串 `` `${}` `` | 拼接字符串、构造 URL |
| ⭐⭐⭐⭐☆ | `import/export` | 每个 Vue 文件都会用 |
| ⭐⭐⭐☆☆ | 字符串方法（ `includes` 、 `split` 、 `trim` 等） | 日常业务逻辑常见 |
| ⭐⭐☆☆☆ | `Set` 、 `Map` 、生成器等 | 大多数中后台项目用得较少 |

**以你目前的基础，我建议先把前五项彻底搞懂。** 等这些熟练之后，再去学 Promise、事件循环、 `async/await` ，理解速度会快很多，而且看公司代码基本不会再因为语法而卡住。

---

展开运算符 只能复制第一层属性？

---

**对！你这个理解是正确的。**

展开运算符（`...`） **只能复制第一层（浅拷贝，Shallow Copy）** ，不会递归复制里面嵌套的对象。

这是 Vue 项目里一个非常重要的知识点，也是很多 Bug 的来源。

---

## 先看第一层（没问题）

```javascript
const user = {
    name: "Tom",
    age: 18
}

const newUser = {
    ...user
}

newUser.name = "Jack";

console.log(user.name);     // Tom
console.log(newUser.name);  // Jack
```

因为：

```
user
↓
{name, age}
```

展开以后，相当于重新创建了一个对象：

```
newUser
↓
{name, age}
```

所以第一层互不影响。

---

## 但是第二层就不一样了

例如：

```javascript
const user = {
    name: "Tom",
    address: {
        city: "北京"
    }
}

const newUser = {
    ...user
}
```

很多人以为：

```
user.address

↓

复制了一份
```

其实不是。

真正情况是：

```
user
 │
 ├── name
 │
 └── address ─────┐
                  │
                  ▼
             {city:"北京"}

newUser
 │
 ├── name
 │
 └── address ────┘
```

两个对象：

**共用一个 address。**

所以：

```javascript
newUser.address.city = "上海";
```

结果：

```javascript
console.log(user.address.city);
```

输出：

```
上海
```

为什么？

因为：

根本没有复制：

```
address
```

只是：

复制了：

```
address 的引用（地址）
```

---

## 为什么？

因为 JavaScript 的对象：

```javascript
{
    city:"北京"
}
```

本身存在内存里。

变量：

```javascript
address
```

其实：

保存的是：

```
地址
```

展开运算符：

```javascript
...user
```

做的只是：

```
把 address 的地址

复制一份
```

不是：

重新创建：

```
新的 address
```

---

## 所以叫浅拷贝（Shallow Copy）

第一层：

```
复制
```

第二层：

```
共享
```

例如：

```javascript
const obj = {
    a:1,
    b:{
        c:2
    }
}
```

展开：

```javascript
const obj2 = {
    ...obj
}
```

效果：

```
obj
 │
 ├── a = 1

 └── b ─────┐
            │
            ▼
          {c:2}

obj2
 │
 ├── a = 1

 └── b ─────┘
```

---

## 那怎么深拷贝（Deep Copy）？

### 方法一：structuredClone（推荐，现代浏览器）

```javascript
const copy = structuredClone(user);
```

这样：

```javascript
copy.address.city = "上海";
```

不会影响：

```javascript
user.address.city
```

因为：

整个对象：

都重新创建了一份。

---

### 方法二：JSON（老项目经常见）

```javascript
const copy = JSON.parse(
    JSON.stringify(user)
);
```

优点：

简单。

缺点：

不能复制：

- Date
- Function
- Map
- Set
- undefined
- Symbol

所以现在已经不推荐了。

---

## Vue 里面为什么天天看到...？

例如：

```javascript
this.form = {
    ...this.form,
    name: "Tom"
}
```

为什么这样写？

因为：

form：

```javascript
{
    name:"",
    age:18,
    phone:""
}
```

如果直接：

```javascript
this.form = {
    name:"Tom"
}
```

其它字段：

```
age

phone
```

都没了。

于是：

```javascript
{
    ...this.form,
    name:"Tom"
}
```

等于：

```javascript
{
    name:"Tom",
    age:18,
    phone:""
}
```

非常方便。

---

## 但是注意一个坑

例如：

```javascript
this.form = {
    user:{
        name:"Tom"
    }
}
```

然后：

```javascript
const copy = {
    ...this.form
}
```

此时：

```javascript
copy.user.name = "Jack";
```

结果：

```javascript
this.form.user.name
```

也是：

```
Jack
```

因为：

```
user
```

还是同一个对象。

---

## 企业开发中怎么理解最简单？

你可以记一句话：

> **展开运算符只会"拆开第一层"，里面如果还是对象、数组，它不会继续复制，只会复制引用。**

所以以后看到：

```javascript
const obj2 = { ...obj1 }
```

你脑子里第一反应应该是：

- ✅ 第一层属性安全，互不影响。
- ⚠️ 嵌套对象、数组仍然共享，需要小心修改。

这也是为什么很多 Vue 项目里，当状态对象层级比较深时，会专门做深拷贝，而不会只用 `...`。

---

structuredClone怎么使用？需要引入什么包吗？

---

不用！ **`structuredClone()` 是 JavaScript 内置的全局函数** ，就像 `JSON.parse()` 、 `setTimeout()` 一样， **不需要安装任何包，也不用 import** 。

直接就能用：

```javascript
const copy = structuredClone(obj);
```

---

## 最简单的例子

```javascript
const user = {
    name: "Tom",
    address: {
        city: "北京"
    }
}

const newUser = structuredClone(user);

newUser.address.city = "上海";

console.log(user.address.city);     // 北京
console.log(newUser.address.city);  // 上海
```

这里 `user` 和 `newUser` 已经完全独立了。

---

## 数组也可以

```javascript
const list = [
    { id: 1 },
    { id: 2 }
];

const newList = structuredClone(list);

newList[0].id = 100;

console.log(list[0].id);     // 1
console.log(newList[0].id);  // 100
```

---

## Vue 中经常这样用

例如接口返回数据：

```javascript
this.form = structuredClone(res.data);
```

或者：

```javascript
const backup = structuredClone(this.form);
```

以后：

```javascript
this.form.name = "Jack";
```

不会影响：

```javascript
backup.name
```

---

## 它比 JSON 好在哪里？

以前大家都是：

```javascript
const copy = JSON.parse(JSON.stringify(obj));
```

但是：

```javascript
const obj = {
    birthday: new Date()
};

const copy = JSON.parse(JSON.stringify(obj));

console.log(copy.birthday);
```

输出：

```
"2025-01-01T08:00:00.000Z"
```

已经变成字符串了。

而：

```javascript
const copy = structuredClone(obj);
```

仍然是：

```javascript
Date
```

对象。

---

还有：

```javascript
const obj = {
    map: new Map(),
    set: new Set()
}
```

JSON：

直接坏掉。

structuredClone：

正常。

---

## 但是它也有限制

例如：

```javascript
const obj = {
    fn() {
        console.log("hello");
    }
}

structuredClone(obj);
```

会报错：

```
DataCloneError
```

因为：

**函数不能克隆。**

同样：

```javascript
const obj = {
    fn: () => {}
}
```

也不行。

---

DOM 元素：

```javascript
document.body
```

也不能。

---

## 浏览器兼容性

现在（2026 年）：

- Chrome ✔
- Edge ✔
- Firefox ✔
- Safari ✔
- Node.js（较新版本）✔

现代开发基本都可以放心使用。

**但如果你们项目是 Vue2 老项目，就要留意一下。**

很多 Vue2 项目运行环境比较老，例如：

- Chrome 80 左右
- Electron 老版本
- IE（极少数遗留项目）

这些环境可能 **没有 `structuredClone()`** 。

可以先在浏览器控制台试一下：

```javascript
console.log(typeof structuredClone);
```

如果输出：

```
function
```

说明支持。

如果输出：

```
undefined
```

说明运行环境太老。

---

## 如果不支持怎么办？

企业项目一般有三种方案：

**① 继续用 JSON（最常见）**

```javascript
const copy = JSON.parse(JSON.stringify(obj));
```

**② 使用 lodash**

```javascript
import cloneDeep from 'lodash/cloneDeep';

const copy = cloneDeep(obj);
```

这是很多 Vue2 老项目最常见的做法。

**③ 如果运行环境支持，就直接用 `structuredClone()`**

---

## 建议

如果你们是 **Vue2 + Webpack + 企业内部项目** ，我建议你先去控制台执行：

```javascript
typeof structuredClone
```

看看有没有。

如果有，以后可以优先用它。

如果没有， **很可能你们项目里已经在用 `lodash` 的 `cloneDeep`** ，你可以搜一下项目里有没有：

```
cloneDeep
```

或者：

```
lodash
```

很多老项目都会统一用它来做深拷贝，而不是 `structuredClone()` 。

---

还有什么前端基础

---

有，而且还不少😂。

不过你不用担心， **前端基础的知识非常多，但企业开发真正天天用的只有一部分。**

从你这几天问的问题来看（Vue2、插槽、JS语法、异步），我感觉你的目标应该是：

> **能看懂公司代码，能独立开发需求，而不是成为 JS 专家。**

所以我按照 **企业开发频率** 给你整理了一份学习路线。

---

## 第一阶段：JavaScript 基础（⭐⭐⭐⭐⭐ 必须）

这是 Vue 的基础。

## ① 变量

```javascript
let
const
var（了解即可）
```

知道：

- const 能不能改？
- 对象为什么 const 还能修改属性？

例如：

```javascript
const obj = {}

obj.name = "Tom"   // 可以

obj = {}           // 不可以
```

---

## ② 数据类型

知道：

```javascript
Number

String

Boolean

Object

Array

null

undefined
```

尤其：

```javascript
null

undefined
```

区别。

---

## ③ 判断

例如：

```javascript
if

switch

三元运算符
```

还有：

```javascript
===

==

!=

!==

>
<
```

尤其：

**永远优先用 `===` 。**

---

## ④ 函数

普通：

```javascript
function add(){

}
```

箭头：

```javascript
const add=()=>{

}
```

参数：

```javascript
function add(a,b){

}
```

返回值：

```javascript
return
```

---

## 第二阶段：对象（⭐⭐⭐⭐⭐）

企业项目天天出现。

包括：

- 对象解构
- 展开运算符
- 可选链
- ??
- Object.keys()
- Object.values()

例如：

```javascript
Object.keys(user)
```

得到：

```javascript
["name","age"]
```

---

## 第三阶段：数组（⭐⭐⭐⭐⭐）

一定要熟。

例如：

```javascript
map
filter
find
forEach
some
every
reduce（了解）
```

看到：

```javascript
list.map(...)
```

应该马上知道：

> 返回一个新数组。

---

## 第四阶段：字符串（⭐⭐⭐⭐）

例如：

```javascript
includes

split

join

replace

trim

startsWith

endsWith
```

---

## 第五阶段：Promise（⭐⭐⭐⭐⭐）

这是接口请求基础。

例如：

```javascript
axios.get()

.then()

.catch()

.finally()
```

为什么：

```javascript
axios.get()
```

里面：

不用：

```javascript
setTimeout
```

还能异步。

---

## 第六阶段：async/await（⭐⭐⭐⭐⭐）

例如：

```javascript
const res=await axios.get(...)
```

理解：

```javascript
await
```

为什么：

必须：

```javascript
async
```

里面。

---

## 第七阶段：this（⭐⭐⭐⭐⭐）

Vue2 最重要。

例如：

```javascript
this.list

this.form

this.$emit()

this.$router

this.$refs
```

知道：

为什么：

箭头函数：

```javascript
this
```

可能变了。

---

## 第八阶段：DOM（⭐⭐⭐）

Vue 平时很少直接操作。

但是：

要知道：

```javascript
document

querySelector

addEventListener
```

因为：

很多第三方库：

还是：

会用。

---

## 第九阶段：事件（⭐⭐⭐⭐）

例如：

点击：

```html
@click
```

其实：

底层：

就是：

```javascript
addEventListener()
```

知道：

事件对象：

```javascript
event
```

是什么。

---

## 第十阶段：事件冒泡（⭐⭐⭐⭐）

企业开发：

很常见。

例如：

按钮：

在：

div：

里面。

为什么：

按钮点一下。

div：

也触发了。

解决：

```
@click.stop
```

为什么：

有用。

---

## 第十一阶段：ES Module（⭐⭐⭐⭐⭐）

每天：

都会看到：

```javascript
import

export
```

默认导出：

```javascript
export default
```

命名导出：

```javascript
export const a
```

区别。

---

## 第十二阶段：JSON（⭐⭐⭐⭐⭐）

接口：

返回：

```json
{
    "code":200,
    "data":[]
}
```

知道：

```javascript
JSON.stringify()

JSON.parse()
```

什么时候：

用。

---

## 第十三阶段：浏览器（⭐⭐⭐⭐）

知道：

例如：

```javascript
window

location

history

localStorage

sessionStorage
```

Vue：

登录：

基本：

都会：

用。

例如：

```javascript
localStorage.setItem()
```

---

## 第十四阶段：浏览器缓存（⭐⭐⭐）

知道：

```
Cookie

localStorage

sessionStorage
```

区别。

例如：

token：

为什么：

放：

localStorage。

---

## 第十五阶段：CSS（⭐⭐⭐⭐⭐）

很多后端转前端：

最弱。

建议：

至少：

熟悉：

```
display

position

flex

margin

padding

width

height

overflow
```

企业：

90%

都是：

Flex。

---

## 第十六阶段：HTML（⭐⭐⭐⭐）

知道：

```html
div

span

input

button

table

img

form
```

什么时候：

用。

---

## 第十七阶段：浏览器调试（⭐⭐⭐⭐⭐）

这个特别重要。

例如：

会：

```
F12

Console

Network

Sources

Elements
```

接口：

失败。

第一件事：

看：

Network。

不是：

猜。

---

## 第十八阶段：Git（⭐⭐⭐⭐⭐）

你已经开始学了。

建议：

至少：

熟悉：

```bash
git status

git add

git commit

git pull

git push

git branch

git checkout

git merge
```

---

## 第十九阶段：npm（⭐⭐⭐⭐）

知道：

```bash
npm install

package.json

node_modules

package-lock.json
```

为什么：

删：

```
node_modules
```

还能：

恢复。

---

## 第二十阶段：Vue2 本身（⭐⭐⭐⭐⭐）

包括：

- 生命周期
- computed
- watch
- slot
- mixin
- emit
- props
- ref
- nextTick

这些：

企业：

天天：

都在：

用。

---

## 如果是我带新人，我会让他按这个顺序学

```
JavaScript 基础
        ↓
ES6（解构、展开、箭头函数）
        ↓
数组、对象方法
        ↓
Promise
        ↓
async/await
        ↓
Vue2 基础
        ↓
组件通信
        ↓
slot（你已经开始学了）
        ↓
axios
        ↓
vue-router
        ↓
Vuex（如果项目用了）
        ↓
ElementUI / 公司组件库
        ↓
Git
```

---

## 我发现你目前最缺的其实不是语法，而是"JavaScript 思维"

例如这几天你问的：

- 为什么 slot 像回调？
- 为什么 scope 是参数？
- 为什么展开运算符是浅拷贝？
- 为什么有异步？
- 回调和异步是什么关系？

这些问题其实都指向同一个核心： **JavaScript 的运行机制和编程思想** 。

所以我建议， **不要急着继续背 Vue API** 。你现在花几天时间把这些 JavaScript 基础（函数、对象、数组、回调、Promise）真正理解透，后面再看 Vue2 源码或者公司组件代码，理解速度会快很多，而且很多语法一眼就能看懂。

---

第八阶段开始我很多概念都不懂

---

哈哈，这反而说明你的学习顺序应该调整了。 **第八阶段开始你不用急着学。**

其实很多培训机构、教程都有一个问题：

> **把所有前端知识都堆给新人。**

但实际上，企业开发不是这样学的。

---

## 我根据你的提问，大概能判断你现在的位置

这几天你问的内容：

- ✅ Git、grep
- ✅ Vue2
- ✅ slot、scope
- ✅ 回调函数
- ✅ Promise
- ✅ 展开运算符
- ✅ 对象解构
- ✅ `?.`
- ❌ DOM
- ❌ 浏览器
- ❌ Event Loop
- ❌ localStorage
- ❌ CSS

说明你现在应该属于：

> **会写一点 Vue，但是 JavaScript 基础还没有形成完整体系。**

这是很多转前端或者直接接手项目的人都会遇到的情况，很正常。

---

## 如果我是你的师傅，我会这样安排

## 第一阶段（这周）

**只学 JavaScript。**

包括：

```
变量
↓

对象

↓

数组

↓

函数

↓

箭头函数

↓

对象解构

↓

展开运算符

↓

可选链 ?.

↓

Promise

↓

async/await
```

这个阶段 **不要碰浏览器** 。

---

## 第二阶段

开始 Vue。

```
组件

↓

props

↓

emit

↓

slot

↓

computed

↓

watch
```

你现在已经学到这里了。

---

## 第三阶段

开始企业开发。

```
axios

↓

vue-router

↓

Vuex（如果项目用了）

↓

ElementUI

↓

公司组件库
```

---

## 第四阶段（再学浏览器）

这个时候再学：

```
DOM

↓

事件

↓

事件冒泡

↓

localStorage

↓

sessionStorage

↓

Cookie
```

为什么放最后？

因为：

Vue 已经帮你把 DOM 封装掉了。

例如：

以前：

```javascript
document.querySelector("#btn")
```

Vue：

直接：

```
<button @click="save">
```

所以：

你平时几乎不用：

```javascript
document
```

---

## 举个例子

比如：

你现在公司代码：

```
<el-button @click="save">
```

你不用知道：

浏览器：

底层：

```javascript
document
    .querySelector(...)
    .addEventListener(...)
```

也能开发。

等以后：

你再去了解：

> 哦，原来：

```
@click
```

底层：

就是：

```javascript
addEventListener()
```

就行。

---

## CSS 也是一样

很多新人：

一开始：

学：

```
float

clear

display:inline-block

position
```

结果：

公司：

全部：

```
display:flex
```

所以：

建议：

先学：

```
display:flex

↓

justify-content

↓

align-items

↓

margin

↓

padding
```

其它：

以后：

遇到了：

再学。

---

## 真正影响你看代码的其实只有这些

例如：

```javascript
const {row}=scope
```

不知道：

解构。

↓

看不懂。

---

```javascript
const list=arr.filter(...)
```

不知道：

filter。

↓

看不懂。

---

```javascript
user?.name
```

不知道：

可选链。

↓

看不懂。

---

```javascript
const obj={
    ...form
}
```

不知道：

展开运算符。

↓

看不懂。

---

```javascript
axios.get(...).then(...)
```

不知道：

Promise。

↓

看不懂。

---

所以：

**现在影响你的不是 DOM。**

而是：

JavaScript。

---

## 我建议你不要再自己到处找资料了

我建议按下面的顺序学，而且每个知识点都结合 Vue 代码来讲。

```
① 对象
② 数组
③ 函数
④ 回调
⑤ Promise
⑥ async/await
⑦ this
⑧ ES6（解构、展开、?.）
⑨ Vue2
⑩ axios
```

基本上：

**学完这十个，你公司的 Vue2 项目 80% 的代码都能看懂。**

---

## 我还有一个建议

我发现你的提问方式特别适合一种学习方法：

你不是喜欢问：

> **"为什么？"**

例如：

- 为什么 slot 要传 scope？
- 为什么父组件还能拿到数据？
- 为什么展开运算符是浅拷贝？

这说明你不是在背语法，而是在理解原理。

**这种方式其实比直接看教程效率高很多。**

所以我建议我们可以把后面的学习变成一个\*\*"Vue2 企业开发 JavaScript 补课"\*\*系列。

比如按这个顺序，每天一个主题：

1. **对象（Object）** ——为什么对象赋值会互相影响？浅拷贝和深拷贝到底是什么？
2. **数组（Array）** —— `map` 、 `filter` 、 `find` 为什么都需要回调？
3. **函数（Function）** ——为什么 JavaScript 的函数可以像变量一样传来传去？
4. **异步（Promise/async）** ——为什么浏览器不能一直等待接口返回？事件循环又是什么？

每个主题都会结合 Vue2 和企业项目里的真实代码，而不是只讲语法。我觉得这样会比直接啃一本 JavaScript 教程更容易真正理解。

---

好的，我们开始，先教各个阶段我基础的概念，然后我们逐个阶段主题学习

---

我觉得这是最适合你的方式。

因为我发现你不是那种死记 API 的学习方式，而是喜欢问：

> **"为什么？它到底是什么？"**

这种方式学得会慢一点，但后面几乎不会忘，而且以后看源码、看别人代码都会轻松很多。

---

## 我们先定一条学习路线（Vue2 企业开发版）

我们不是学"JavaScript 全部"，而是学 **能支撑 Vue2 企业开发的 JavaScript** 。

```
第一阶段：JavaScript 基础思想 ⭐⭐⭐⭐⭐
        ↓
第二阶段：对象 Object ⭐⭐⭐⭐⭐
        ↓
第三阶段：数组 Array ⭐⭐⭐⭐⭐
        ↓
第四阶段：函数 Function ⭐⭐⭐⭐⭐
        ↓
第五阶段：异步 Promise ⭐⭐⭐⭐⭐
        ↓
第六阶段：浏览器 Browser ⭐⭐⭐⭐
        ↓
第七阶段：Vue2 ⭐⭐⭐⭐⭐
        ↓
第八阶段：工程化（npm、webpack、git）⭐⭐⭐⭐
```

每个阶段，我们都先讲 **概念** ，再讲 **语法** ，最后结合 **公司项目** 。

---

## 第一阶段：JavaScript 基础思想（今天）

这一阶段 **没有多少代码** ，主要是建立正确的思维。

如果这些概念不懂，后面的语法都是死记硬背。

---

## 第一课：什么是 JavaScript？

很多新人以为：

> JavaScript 是网页语言。

其实不是。

JavaScript 本质上是一门 **编程语言** 。

和 Java、C#、Python 一样。

它有：

- 变量
- 函数
- 对象
- 循环
- 判断

只是它 **最开始主要运行在浏览器里** ，所以大家总把它和网页绑定。

现在它还能运行在：

- 浏览器
- Node.js（服务器）
- Electron（桌面应用）
- 小程序
- VSCode 插件

所以不要把它理解成"网页脚本"，而要理解成一门完整的语言。

---

## 第二课：程序是什么？

例如：

```javascript
let a = 10;
let b = 20;

console.log(a + b);
```

程序就是：

> **一条一条指令，让计算机按照顺序执行。**

例如：

```
① 创建变量 a
② 创建变量 b
③ 相加
④ 输出
```

CPU 就是一条一条执行。

---

## 第三课：什么是变量？

例如：

```javascript
let name = "Tom";
```

很多书说：

> 变量就是存储数据。

其实不准确。

我更喜欢这样理解：

> **变量就是一个名字，用来引用一块数据。**

例如：

```
内存：

0x001
↓

"Tom"
```

变量：

```
name

↓

指向

↓

"Tom"
```

所以：

```javascript
console.log(name);
```

实际上：

就是：

```
根据名字

↓

找到数据

↓

输出
```

---

## 第四课：什么是对象？

这是 JavaScript 最重要的概念。

例如：

```javascript
const user = {
    name: "Tom",
    age: 18
}
```

很多教程说：

> 对象就是键值对。

其实可以这样理解：

> **对象就是把多个相关的数据打包在一起。**

例如：

现实世界：

```
张三

姓名

年龄

电话

地址
```

如果没有对象：

```javascript
let name = "Tom";
let age = 18;
let phone = "...";
```

会很乱。

于是：

```javascript
const user = {
    name: "Tom",
    age: 18,
    phone: "..."
}
```

是不是像一个"人"了？

所以：

对象就是：

> **现实世界一个事物的抽象。**

---

## 第五课：什么是数组？

例如：

```javascript
const users = [
    { name: "Tom" },
    { name: "Jack" },
    { name: "Lucy" }
];
```

数组可以理解成：

> **同一种东西的集合。**

例如：

```
学生1

学生2

学生3
```

全部放一起。

所以：

数组不是对象。

对象表示：

```
一个人
```

数组表示：

```
很多人
```

以后你们公司的接口：

几乎都是：

```json
{
    "data":[
        {},
        {},
        {}
    ]
}
```

为什么？

因为：

表格：

就是：

很多条数据。

---

## 第六课：什么是函数？

这是后面最重要的一课。

很多人觉得：

函数：

就是：

```javascript
function add(){

}
```

其实：

函数本质上：

> **就是一段可以重复执行的代码。**

例如：

你每天：

```
登录

↓

查询

↓

退出
```

以后：

每次：

都写：

100 行。

太麻烦。

于是：

```javascript
function login(){

}
```

以后：

```javascript
login();
```

就行。

所以：

函数：

就是：

> **把一段逻辑包装起来，起个名字。**

---

## 第七课：什么是参数？

例如：

```javascript
function add(a,b){

    return a+b;

}
```

这里：

```
a

b
```

就是：

参数。

参数就是：

> **调用函数的时候，传进去的数据。**

例如：

```javascript
add(10,20)
```

就是：

```
a=10

b=20
```

是不是和：

slot：

里面：

```
v-slot="{row}"
```

开始有点像了？

其实：

**scope 就是参数。**

---

## 第八课：什么是返回值？

例如：

```javascript
function add(a,b){

    return a+b;

}
```

调用：

```javascript
const result = add(10,20);
```

这里：

```
result
```

得到：

```
30
```

所以：

返回值：

就是：

> **函数执行完以后，交还给调用者的数据。**

---

## 第九课：什么是回调？

例如：

```javascript
function run(fn){

    fn();

}
```

这里：

```
fn
```

不是数字。

不是字符串。

而是：

**函数。**

调用：

```javascript
run(function(){

    console.log("hello");

});
```

是不是：

开始像：

slot？

所以：

函数：

不仅：

可以：

```
调用
```

还能：

```
传来传去
```

这是 JavaScript 最大特点。

---

## 第十课：什么是异步？

这里只建立概念。

例如：

下载文件。

你有两个选择：

方案一：

```
一直等。

下载完成。

继续。
```

这是：

同步。

方案二：

```
开始下载。

你继续干别的。

下载好了。

通知你。
```

这是：

异步。

Promise：

就是：

解决：

这个问题。

---

## 今天你只需要建立下面 10 个概念

```
JavaScript
    │
    ├──变量
    ├──对象
    ├──数组
    ├──函数
    ├──参数
    ├──返回值
    ├──回调
    ├──同步
    └──异步
```

**这些概念之间是有关系的：**

- **对象** 是"一个事物"（一个用户、一张订单）。
- **数组** 是"很多个同类事物"（很多用户、很多订单）。
- **函数** 是"做一件事情"（登录、保存、查询）。
- **参数** 是"做事情需要的材料"。
- **返回值** 是"做完事情得到的结果"。
- **回调** 是"把一件事情交给别人，等别人决定什么时候执行"。
- **异步** 是"不用一直等结果，可以先去做别的事"。

---

## 我们的学习方式

我建议后面每个阶段都按同一个节奏：

1. **先讲概念** （是什么、为什么需要）。
2. **再讲 JavaScript 语法** （怎么写）。
3. **最后结合 Vue2 企业项目** （为什么公司代码会这样写）。

例如下一节 **第二阶段：对象（Object）** ，我们不会一上来讲解构、展开运算符，而是先讲：

> **为什么 JavaScript 要有对象？对象在内存里到底是什么？为什么 `const a = b` 后修改一个，另一个也会变？**

等这些理解了，你再学浅拷贝、深拷贝、解构、展开运算符，就会觉得它们都是顺理成章的，而不是一堆需要背的语法。

---

我们继续

---

很好，我们继续。

**今天开始第二阶段：Object（对象）。**

这一阶段我认为是 **整个 JavaScript 最重要的部分** 。

为什么？

因为：

- Vue 的 `data()` 返回的是对象
- `props` 是对象
- axios 返回的是对象
- DOM 也是对象
- Promise 也是对象
- Vue 实例 (`this`) 也是对象

可以说：

> **JavaScript 就是一门围绕对象展开的语言。**

---

## 第一课：什么是对象？

很多教程会说：

> 对象就是键值对（key-value）。

这句话没错，但是 **不好理解** 。

我更喜欢用现实世界来解释。

例如：

现实中有一个人：

```
姓名：Tom

年龄：18

电话：123456

地址：北京
```

你脑子里认为：

这是：

> **一个人。**

而不是：

> 四个毫无关系的数据。

JavaScript 也是这样。

于是：

```javascript
const user = {
    name: "Tom",
    age: 18,
    phone: "123456",
    city: "北京"
}
```

这个对象：

就是：

> **现实世界"人"的抽象。**

所以：

对象：

**就是把一个事物相关的数据放到一起。**

---

## 第二课：为什么不用变量？

例如：

```javascript
let name = "Tom";
let age = 18;
let phone = "123456";
```

可以吗？

当然可以。

但是：

如果：

100 个人。

你要：

```javascript
name1

age1

phone1

name2

age2

phone2
```

是不是疯了？

于是：

对象：

解决：

这个问题。

---

## 第三课：对象里面是什么？

例如：

```javascript
const user = {
    name: "Tom",
    age: 18
}
```

里面：

每一项：

都有：

```
键（Key）

↓

值（Value）
```

例如：

```
name
↓

Tom
```

所以：

```javascript
user.name
```

就是：

根据：

```
name
```

找到：

```
Tom
```

---

## 第四课：为什么可以 user.name？

很多人：

不知道：

为什么：

可以：

```javascript
user.name
```

其实：

JavaScript：

做了一件事。

相当于：

```
user

↓

找

name

↓

得到

Tom
```

所以：

```javascript
console.log(user.name);
```

输出：

```
Tom
```

---

## 第五课：对象不是放数据，而是放地址

这一课特别重要。

很多 JavaScript 的坑都来自这里。

先看：

```javascript
const a = 10;

const b = a;

b = 20;
```

如果这是合法的（这里 `const` 不能重新赋值，我们假设用 `let` ）：

```javascript
let a = 10;
let b = a;

b = 20;

console.log(a);
```

结果：

```
10
```

为什么？

因为：

数字：

直接复制。

---

但是：

对象：

```javascript
let user = {
    name: "Tom"
}

let other = user;
```

很多新人觉得：

是不是：

复制：

了一份？

不是。

真正发生的是：

```
内存：

0x001

↓

{
    name:"Tom"
}
```

变量：

```
user

↓

0x001
```

然后：

```javascript
let other = user;
```

不是复制对象。

而是：

复制：

```
地址
```

于是：

```
user

↓

0x001

↑

other
```

两个变量：

指向：

同一个对象。

---

## 第六课：为什么修改一个另一个也变？

例如：

```javascript
let user = {
    name: "Tom"
}

let other = user;

other.name = "Jack";

console.log(user.name);
```

很多新人：

以为：

输出：

```
Tom
```

其实：

输出：

```
Jack
```

为什么？

因为：

真正改的是：

```
0x001

↓

{
    name:"Jack"
}
```

不是：

变量。

变量：

只是：

指针。

所以：

两个：

都变了。

---

## 第七课：对象比较

例如：

```javascript
const a = {
    name: "Tom"
}

const b = {
    name: "Tom"
}
```

问：

```javascript
a == b
```

结果：

很多人：

猜：

```
true
```

其实：

```
false
```

为什么？

因为：

```
a

↓

0x001

b

↓

0x002
```

虽然：

内容：

一样。

但是：

地址：

不同。

JavaScript：

比较对象：

比较的是：

**地址。**

不是：

内容。

---

## 第八课：什么时候才相等？

例如：

```javascript
const a = {
    name: "Tom"
}

const b = a;
```

现在：

```
a

↓

0x001

↑

b
```

于是：

```javascript
a === b
```

结果：

```
true
```

因为：

地址：

一样。

---

## 第九课：为什么浅拷贝会影响？

现在：

你之前问的：

```javascript
const newUser = {
    ...user
}
```

为什么：

第二层：

还会：

一起变？

现在：

是不是：

能解释了？

例如：

```javascript
const user = {
    name: "Tom",
    address: {
        city: "北京"
    }
}
```

展开：

```javascript
const copy = {
    ...user
}
```

实际上：

第一层：

重新创建：

```
copy

↓

0x002
```

但是：

里面：

```
address
```

还是：

```
0x100
```

于是：

```
user

↓

0x001

↓

address

↓

0x100

copy

↓

0x002

↓

address

↓

0x100
```

所以：

修改：

```javascript
copy.address.city
```

两个：

一起变。

是不是：

终于：

说通了？

---

## 第十课：为什么 Vue 喜欢对象？

例如：

一个表单：

```javascript
form = {
    username:"",
    password:"",
    phone:"",
    email:""
}
```

是不是：

比：

```javascript
username=""

password=""

phone=""
```

舒服？

再例如：

接口：

返回：

```json
{
    "code":200,
    "message":"成功",
    "data":{
        "id":1,
        "name":"Tom"
    }
}
```

是不是：

天然：

就是：

对象。

所以：

Vue：

几乎：

全部：

围绕：

对象。

---

## 今天最重要的三个结论（一定要记住）

### ① 对象表示一个事物

例如：

```javascript
const user = {
    name:"Tom",
    age:18
}
```

一个用户。

---

### ② 变量保存的是对象的引用（地址）

例如：

```javascript
const a = user;
```

不是复制对象。

只是：

两个变量：

指向：

同一个对象。

---

### ③ JavaScript 比较对象，比的是引用，不是内容

```javascript
{} === {}
```

结果：

永远：

```
false
```

因为：

不是：

同一个对象。

---

## 课后思考题（不用急着写代码）

请你思考下面四个问题，并尝试说出为什么：

```javascript
let a = 10;
let b = a;
b = 20;
```

为什么 `a` 没变？

---

```javascript
let a = { x: 1 };
let b = a;
b.x = 2;
```

为什么 `a.x` 变成了 `2` ？

---

```javascript
{} === {}
```

为什么是 `false` ？

---

```javascript
const obj = {
    user: {
        name: "Tom"
    }
};

const copy = { ...obj };
```

为什么修改 `copy.user.name` 会影响 `obj.user.name` ？

如果你能不用死记，而是用" **变量保存的是引用** "这个思路把这四个问题解释清楚，那么对象这一章你就已经掌握了 70% 以上。下一节我们再讲 **对象的各种操作** （增删改查、解构、展开运算符、可选链），你会发现它们都是建立在今天这些概念之上的。

---

继续

---

很好，我们继续。

今天开始讲 **对象的操作** 。这一节你以后每天都会用，而且 Vue2 项目里出现频率极高。

---

## 第二阶段 第二课：对象的操作

对象可以理解成一本字典。

例如：

```javascript
const user = {
    name: "Tom",
    age: 18
}
```

脑子里可以想成：

| 键(Key) | 值(Value) |
| --- | --- |
| name | Tom |
| age | 18 |

所有操作，本质都是围绕这个表来的。

---

## 第一课：读取属性

最常见：

```javascript
console.log(user.name);
```

得到：

```
Tom
```

为什么？

就是：

> 去对象里面找 key 为 `name` 的值。

---

## 还有另一种写法

```javascript
console.log(user["name"]);
```

一样输出：

```
Tom
```

很多人不知道为什么有两种。

区别来了。

---

## 点（.）适合固定属性

例如：

```javascript
user.name

user.age

user.phone
```

属性名已经写死。

---

## 中括号（\[\]）适合变量

例如：

```javascript
const key = "name";

console.log(user[key]);
```

输出：

```
Tom
```

如果写：

```javascript
user.key
```

得到的是：

```
undefined
```

为什么？

因为：

JavaScript 会理解成：

```
找属性：

key
```

不是：

```
变量 key 的值
```

所以：

以后看到：

```javascript
obj[field]
```

说明：

field：

通常是变量。

---

## 第二课：新增属性

例如：

```javascript
user.gender = "男";
```

对象：

变成：

```javascript
{
    name: "Tom",
    age: 18,
    gender: "男"
}
```

是不是像：

新增了一列。

---

也可以：

```javascript
user["phone"] = "123";
```

一样。

---

## 第三课：修改属性

例如：

```javascript
user.name = "Jack";
```

结果：

```javascript
{
    name:"Jack",
    age:18
}
```

其实：

新增和修改：

写法一样。

JavaScript 会判断：

> 有这个属性？

有：

修改。

没有：

新增。

---

## 第四课：删除属性

例如：

```javascript
delete user.age;
```

结果：

```javascript
{
    name:"Tom"
}
```

Vue 业务代码里相对少见，但知道即可。

---

## 第五课：判断有没有这个属性

例如：

```javascript
"name" in user
```

得到：

```
true
```

或者：

```javascript
"phone" in user
```

得到：

```
false
```

还有：

```javascript
user.hasOwnProperty("name")
```

以后偶尔能看到。

---

## 第六课：遍历对象

对象不像数组，没有 `forEach()` 。

一般用：

```javascript
for (const key in user) {
    console.log(key);
}
```

输出：

```
name
age
```

如果想拿值：

```javascript
for (const key in user) {
    console.log(user[key]);
}
```

输出：

```
Tom
18
```

注意这里为什么不是：

```javascript
user.key
```

因为：

key：

是变量。

例如：

第一次循环：

```
key = "name"
```

真正执行的是：

```javascript
user["name"]
```

---

## 第七课：Object.keys()

Vue 项目很常见。

例如：

```javascript
const keys = Object.keys(user);
```

得到：

```javascript
["name","age"]
```

用途：

例如：

循环：

```javascript
Object.keys(user).forEach(key => {

    console.log(key);

});
```

---

## 第八课：Object.values()

例如：

```javascript
Object.values(user)
```

得到：

```javascript
["Tom",18]
```

---

## 第九课：Object.entries()

这个很多人不知道。

例如：

```javascript
Object.entries(user)
```

得到：

```javascript
[
    ["name","Tom"],
    ["age",18]
]
```

就是：

把对象：

变成：

数组。

以后：

很多第三方库：

都会：

这么干。

---

## 第十课：对象解构（重点）

终于来了。

这是 Vue 项目天天见的。

例如：

```javascript
const user = {
    name: "Tom",
    age: 18
}
```

以前：

```javascript
const name = user.name;
const age = user.age;
```

现在：

```javascript
const { name, age } = user;
```

完全一样。

所以：

对象解构：

就是：

> **把对象里面的属性，快速取出来变成变量。**

---

## 为什么叫"解构"？

对象：

原来：

```
user
│
├──name
└──age
```

解构以后：

```
name

age
```

拆开了。

所以：

叫：

解构（Destructuring）。

---

## Vue 里最经典的例子

例如：

```
<template v-slot="scope">
```

里面：

```javascript
scope = {
    row:{},
    index:0
}
```

于是：

很多人：

马上：

写：

```javascript
const { row } = scope;
```

以后：

直接：

```javascript
row.name
```

不用：

```javascript
scope.row.name
```

是不是方便很多？

---

## 第十一课：重命名

例如：

```javascript
const { name: userName } = user;
```

得到：

```javascript
userName
```

不是：

```javascript
name
```

等于：

```javascript
const userName = user.name;
```

---

## 第十二课：默认值

例如：

```javascript
const user = {};
```

然后：

```javascript
const { age = 18 } = user;
```

得到：

```
18
```

为什么？

因为：

user：

没有：

age。

---

## 今天最重要的一句话

以后看到：

```javascript
const { row } = scope;
```

脑子立即翻译成：

```javascript
const row = scope.row;
```

看到：

```javascript
const { id, name } = row;
```

立即翻译成：

```javascript
const id = row.id;

const name = row.name;
```

**你已经不需要把它当成一种新语法了，它只是 JavaScript 帮你少写代码的"快捷方式"。**

---

## 下一节更重要

下一节我们讲：

- `...`（展开运算符）
- `?.`（可选链）
- `??`（空值合并）
- `||` （逻辑或）

这四个语法在 Vue2 企业项目里出现频率非常高，而且很多人第一次看到都会觉得很神秘。实际上，它们都是为了解决实际开发中的问题，不是单纯为了"炫技"。理解了为什么会有这些语法，你以后看公司代码会轻松很多。

---

继续

---

很好，我们继续。

**今天这一节可以说是 Vue2 企业项目里出现频率最高的一节。**

学完之后，你看公司代码应该会舒服很多。

---

## 第二阶段 第三课：ES6 对象增强语法

今天学习四个东西：

```
① 展开运算符 ...
② 可选链 ?.
③ 空值合并 ??
④ 逻辑或 ||
```

它们都是为了一个目的：

> **让代码更简单、更安全。**

---

## 第一课：为什么会有展开运算符（...）？

先不要看语法。

先看以前怎么写。

例如：

```javascript
const user = {
    name: "Tom",
    age: 18
}
```

现在：

想增加一个字段：

```
phone
```

以前：

```javascript
const newUser = {
    name: user.name,
    age: user.age,
    phone: "123456"
}
```

是不是很烦？

如果：

对象：

有：

100 个字段。

你得：

写：

100 行。

---

于是：

ES6：

来了：

```javascript
const newUser = {
    ...user,
    phone: "123456"
}
```

是不是：

舒服很多？

---

## 它到底做了什么？

其实：

就是：

把对象：

拆开。

例如：

```javascript
...user
```

脑子里面：

直接翻译成：

```javascript
name: user.name,
age: user.age
```

所以：

```javascript
const newUser = {
    ...user,
    phone: "123"
}
```

实际上：

等于：

```javascript
const newUser = {
    name: user.name,
    age: user.age,
    phone: "123"
}
```

是不是一下就不神秘了？

---

## Vue 为什么天天用？

例如：

修改表单。

```javascript
this.form = {
    ...this.form,
    name: "Jack"
}
```

为什么？

假设：

form：

```javascript
{
    name: "",
    age: 18,
    phone: "123"
}
```

现在：

只改：

name。

如果：

直接：

```javascript
this.form = {
    name: "Jack"
}
```

那么：

```
age

phone
```

全部没了。

于是：

展开：

```javascript
{
    ...this.form,
    name: "Jack"
}
```

结果：

```javascript
{
    name: "Jack",
    age: 18,
    phone: "123"
}
```

是不是：

很合理？

---

## 第二课：为什么后面的会覆盖前面的？

例如：

```javascript
const obj = {
    name: "Tom",
    age: 18
}

const newObj = {
    ...obj,
    name: "Jack"
}
```

最后：

得到：

```javascript
{
    name: "Jack",
    age: 18
}
```

为什么？

因为：

JavaScript：

从上往下。

先：

```javascript
name: "Tom"
```

后来：

又：

```javascript
name: "Jack"
```

当然：

后面的：

覆盖。

所以：

以后：

看到：

```javascript
{
    ...obj,
    status:1
}
```

脑子：

直接：

理解：

> 保留所有字段，只修改 status。

---

## 第三课：可选链（?.）

这个：

Vue 项目超级常见。

例如：

```javascript
user.address.city
```

如果：

```javascript
user = null
```

浏览器：

直接：

报错。

因为：

```
null
```

没有：

```
address
```

---

以前：

大家：

只能：

这样写：

```javascript
user &&
user.address &&
user.address.city
```

什么意思？

就是：

一层一层检查：

存在吗？

存在吗？

存在吗？

太长了。

---

于是：

有了：

```javascript
user?.address?.city
```

是不是：

一下：

简单。

---

它：

到底什么意思？

脑子：

翻译成：

```
user

存在吗？

↓

存在

继续

↓

不存在

直接返回 undefined
```

不会：

报错。

---

例如：

```javascript
const user = null;

console.log(user?.name);
```

得到：

```
undefined
```

不会：

崩。

---

Vue：

接口：

天天：

这样：

```javascript
res.data?.list
```

为什么？

因为：

有时候：

接口：

失败。

没有：

```
data
```

如果：

不用：

```
?.
```

程序：

直接：

报错。

---

## 第四课：逻辑或（||）

例如：

```javascript
let name = "";

console.log(name || "默认");
```

得到：

```
默认
```

为什么？

因为：

JavaScript：

认为：

下面：

都是：

假值（Falsy）：

```
false
0
""
null
undefined
NaN
```

所以：

```javascript
name || "默认"
```

意思：

就是：

> 如果：

左边：

是假。

返回：

右边。

---

例如：

```javascript
let age = 18;

console.log(age || 100);
```

得到：

```
18
```

因为：

18：

是真。

---

很多老项目：

这样写：

```javascript
const pageSize = size || 10;
```

什么意思？

如果：

没有：

size。

默认：

10。

---

## 第五课：为什么后来又有??？

因为：

`||`

有坑。

例如：

```javascript
let count = 0;

console.log(count || 100);
```

得到：

```
100
```

但是：

```
0
```

其实：

是：

合法值。

不是：

空。

怎么办？

于是：

ES2020：

来了：

```
??
```

---

## 第六课：空值合并（??）

例如：

```javascript
let count = 0;

console.log(count ?? 100);
```

得到：

```
0
```

为什么？

因为：

`??`

只判断：

两个：

```
null

undefined
```

其它：

都：

保留。

---

例如：

```javascript
null ?? 100
```

得到：

```
100
```

---

```javascript
undefined ?? 100
```

得到：

```
100
```

---

```javascript
"" ?? "默认"
```

得到：

```
""
```

不是：

默认。

---

```javascript
0 ?? 100
```

得到：

```
0
```

不是：

100。

---

所以：

以后：

推荐：

用：

```
??
```

不要：

```
||
```

---

## 企业项目到底什么时候用哪个？

这是很多人最容易混淆的地方。

假设接口返回：

```javascript
const res = {
    data: null
}
```

以前：

```javascript
const list = res.data || [];
```

可以。

但是：

如果：

接口：

返回：

```javascript
const page = 0;
```

你写：

```javascript
page || 1
```

结果：

变成：

```
1
```

这是：

Bug。

正确：

应该：

```javascript
page ?? 1
```

---

## 今天最重要的一张表

| 语法 | 作用 | 你脑子里的翻译 |
| --- | --- | --- |
| `...obj` | 展开对象 | "把 obj 第一层属性全部拿出来" |
| `user?.name` | 可选链 | "如果 user 存在，再取 name" |
| `a \|\| b` | 逻辑或 | "左边是假值，就用右边" |
| `a ?? b` | 空值合并 | "左边是 null 或 undefined，才用右边" |

---

## 最后，我留两个企业项目里的真实例子，你试着翻译一下。

### 例子一

```javascript
const params = {
    ...this.form,
    page: 1
}
```

试着翻译成一句中文。

---

### 例子二

```javascript
const list = res.data?.list ?? [];
```

不要急着按语法解释，而是用中文说它的意思。

如果你能把这两句话翻译成自然语言，说明你已经开始 **用 JavaScript 思维** 而不是 **背 JavaScript 语法** 了。这是一个很重要的转变。

---

1表单只修改page；2确保返回数组；继续

---

回答得不错！不过第一个还有一点点偏差，我帮你修正一下。

---

## 第一句

```javascript
const params = {
    ...this.form,
    page: 1
}
```

你说：

> **表单只修改 page**

意思差不多，但是更准确一点应该是：

> **把 this.form 的所有字段复制一份，再把 page 设置成 1。**

例如：

```javascript
this.form = {
    name: "Tom",
    age: 18,
    page: 5
}
```

执行后：

```javascript
params = {
    name: "Tom",
    age: 18,
    page: 1
}
```

注意：

**`this.form` 并没有修改！**

只是：

```
复制

↓

生成新的 params
```

这一点很重要。

所以以后看到：

```javascript
{
    ...xxx,
    page:1
}
```

脑子立即翻译：

> **保留原来的所有字段，只覆盖 page。**

---

## 第二句

```javascript
const list = res.data?.list ?? [];
```

你说：

> **确保返回数组。**

这个已经非常接近了，我会翻译成：

> **如果 `res.data.list` 存在，就使用它；如果不存在（ `null` 或 `undefined` ），就使用空数组 `[]` 。**

为什么企业里这么写？

例如接口：

正常：

```javascript
{
    data:{
        list:[
            {id:1},
            {id:2}
        ]
    }
}
```

那么：

```javascript
list
```

就是：

```javascript
[
    {id:1},
    {id:2}
]
```

如果接口异常：

```javascript
{
    data:null
}
```

那么：

```javascript
list
```

就是：

```javascript
[]
```

这样：

后面：

```javascript
list.map(...)
```

也不会报错。

这就是企业开发的思维：

> **不要相信接口一定返回正确数据。**

---

## 好，我们继续第三阶段——数组(Array)

这里开始，你会发现 Vue 项目里面 **80% 的业务逻辑都在处理数组。**

例如：

订单列表：

```javascript
[
    {id:1},
    {id:2},
    {id:3}
]
```

用户列表：

```javascript
[
    {name:"Tom"},
    {name:"Jack"}
]
```

表格：

```
<el-table :data="list">
```

里面的：

```
list
```

几乎永远都是数组。

---

## 第一课：为什么有数组？

对象：

表示：

```
一个人
```

例如：

```javascript
const user = {
    name:"Tom"
}
```

数组：

表示：

```
很多人
```

例如：

```javascript
const users = [
    {name:"Tom"},
    {name:"Jack"},
    {name:"Lucy"}
]
```

所以：

以后看到：

```javascript
data
```

如果：

里面：

很多条记录。

几乎：

都是：

数组。

---

## 第二课：数组和对象最大的区别

对象：

通过：

```
名字（key）
```

找数据。

例如：

```javascript
user.name
```

数组：

通过：

```
下标（index）
```

找数据。

例如：

```javascript
const arr = ["A","B","C"];
```

第一项：

```javascript
arr[0]
```

得到：

```
A
```

第二项：

```javascript
arr[1]
```

得到：

```
B
```

所以：

数组：

其实就是：

> **有顺序的一组数据。**

---

## 第三课：数组为什么从 0 开始？

很多新人都会问。

原因和计算机内存有关，这里不用深入。

你只要记住：

```javascript
const arr = ["A","B","C"];
```

位置：

```
0 → A

1 → B

2 → C
```

长度：

```javascript
arr.length
```

得到：

```
3
```

最后一个：

永远：

```javascript
arr[arr.length-1]
```

---

## 第四课：遍历

数组最大的特点：

就是：

经常：

需要：

把：

每一项：

都处理。

例如：

```javascript
const users = [
    {name:"Tom"},
    {name:"Jack"},
    {name:"Lucy"}
]
```

你想：

输出：

所有名字。

最简单：

```javascript
users.forEach(user => {
    console.log(user.name);
});
```

注意：

这里：

```
user
```

不是：

JavaScript：

关键字。

它只是：

变量名。

也可以：

```javascript
users.forEach(item => {

})
```

也可以：

```javascript
users.forEach(xxx => {

})
```

完全一样。

---

## 第五课：为什么 forEach 有回调？

例如：

```javascript
users.forEach(user => {

    console.log(user.name);

});
```

这里：

是不是：

又出现：

回调。

为什么？

因为：

真正：

遍历数组的。

不是你。

而是：

JavaScript。

JavaScript：

内部：

大概：

这样：

（伪代码）

```javascript
function forEach(callback){

    callback(users[0]);

    callback(users[1]);

    callback(users[2]);

}
```

是不是：

开始：

和：

slot：

一模一样？

JavaScript：

负责：

循环。

你：

负责：

告诉它：

每一项：

怎么处理。

---

## 今天留一个思考题

我们之前学了：

- slot（子组件调用父组件模板）
- 回调（函数调用另一个函数）
- `forEach` （数组调用你的函数）

你有没有发现，它们背后其实是 **同一种设计思想** ？

如果你能发现这个共同点，以后再学 `map` 、 `filter` 、 `find` ，几乎不用背，因为它们只是"调用你的函数"之后，做不同的事情而已。

我建议下一节，我们专门讲 **"为什么 JavaScript 那么喜欢把函数当参数传来传去"** 。这是整个 Vue（包括插槽、事件、Promise、数组方法）的核心思想。理解这一点之后，你会觉得前端很多 API 看起来都像一家人。

---

继续

---

哈哈，你已经开始摸到 JavaScript 的"灵魂"了。

其实你已经发现了：

- slot 是传一个模板（本质可以理解为函数）
- forEach 是传一个函数
- Promise.then() 是传一个函数
- addEventListener() 是传一个函数
- setTimeout() 是传一个函数

**为什么 JavaScript 到处都在传函数？**

这就是今天这节课。

---

## 第三阶段 第一课：函数为什么这么特殊？

很多语言里面：

函数就是：

```
执行代码
```

但是 JavaScript 不一样。

JavaScript 的函数：

**也是一种数据。**

什么意思？

例如：

数字：

```javascript
const a = 10;
```

字符串：

```javascript
const name = "Tom";
```

对象：

```javascript
const user = {};
```

函数：

```javascript
const fn = function () {
    console.log("hello");
};
```

注意：

这里：

```
fn
```

就是一个变量。

变量里面：

保存的是：

```
函数
```

所以：

函数：

和：

数字、

字符串、

对象

一样。

都可以：

赋值。

---

## 第一件事情：函数可以赋值

例如：

```javascript
function sayHello() {
    console.log("Hello");
}

const fn = sayHello;
```

注意：

这里：

没有：

```
()
```

所以：

不是：

调用。

而是：

把：

```
sayHello
```

这个函数。

交给：

```
fn
```

以后：

```javascript
fn();
```

输出：

```
Hello
```

是不是：

很神奇？

---

## 为什么没有 ()？

这个地方很多新人都会迷糊。

例如：

```javascript
sayHello();
```

意思：

> **执行函数。**

而：

```javascript
sayHello
```

意思：

> **函数本身。**

就像：

```javascript
const name = "Tom";
```

这里：

```
"Tom"
```

是数据。

函数：

也是：

数据。

---

## 第二件事情：函数可以作为参数

例如：

```javascript
function run(fn) {

    fn();

}
```

调用：

```javascript
run(sayHello);
```

是不是：

把：

```
sayHello
```

交给：

```
run
```

里面：

```
fn
```

其实：

就是：

```javascript
const fn = sayHello;
```

所以：

里面：

```javascript
fn();
```

就是：

```javascript
sayHello();
```

---

## 第三件事情：函数可以作为返回值

例如：

```javascript
function create() {

    return function () {

        console.log("hello");

    };

}
```

调用：

```javascript
const fn = create();
```

得到：

```
一个函数
```

然后：

```javascript
fn();
```

输出：

```
hello
```

以后：

Vue、

React、

Promise

都会：

这样。

---

## 为什么 JavaScript 要这样设计？

因为：

JavaScript：

最大的特点：

就是：

> **我不知道你想怎么处理。**

举个例子。

---

## 例子一：排序

假设：

有：

```javascript
const users = [
    { name: "Tom", age: 18 },
    { name: "Jack", age: 25 },
    { name: "Lucy", age: 20 }
];
```

JavaScript：

知道：

怎么排序吗？

不知道。

有人：

想按：

年龄。

有人：

想按：

名字。

怎么办？

于是：

JavaScript：

说：

> **你告诉我。**

例如：

```javascript
users.sort((a, b) => a.age - b.age);
```

这里：

JavaScript：

负责：

排序。

你：

负责：

告诉它：

比较规则。

---

## 例子二：forEach

JavaScript：

知道：

数组：

怎么循环。

但是：

不知道：

你：

想：

打印。

还是：

修改。

还是：

统计。

于是：

JavaScript：

说：

> **你把处理方式给我。**

```javascript
users.forEach(user => {

});
```

---

## 例子三：slot

Table：

知道：

什么时候：

渲染。

但是：

不知道：

你：

想：

显示：

蓝色。

还是：

红色。

于是：

Table：

说：

> **你把模板给我。**

```
<template v-slot="{ row }">
```

---

## 例子四：Promise

浏览器：

知道：

什么时候：

接口回来。

但是：

不知道：

回来以后：

你：

想：

干什么。

于是：

浏览器：

说：

> **你把处理函数给我。**

```javascript
axios.get(...).then(res => {

});
```

---

## 发现共同点了吗？

看看：

下面：

四个：

是不是：

越来越像？

forEach：

```javascript
users.forEach(user => {

});
```

Promise：

```javascript
axios.get(...).then(res => {

});
```

事件：

```javascript
button.addEventListener("click", e => {

});
```

slot：

```
<template v-slot="{ row }">
```

它们：

都有：

一个特点：

> **框架掌握流程。**

> **你掌握处理方式。**

---

## 这就是回调真正的意义

很多书：

说：

> 回调就是把函数作为参数。

没有错。

但是：

我更喜欢：

一句话。

> **回调就是："我负责什么时候调用，你负责调用以后做什么。"**

例如：

forEach：

> JavaScript：

负责：

什么时候：

遍历。

你：

负责：

每一项：

怎么处理。

---

Promise：

> 浏览器：

负责：

什么时候：

请求结束。

你：

负责：

结束以后：

干什么。

---

slot：

> Table：

负责：

什么时候：

渲染。

你：

负责：

渲染成什么样。

---

## 所以你以后看到任何 API

不要先看：

语法。

先问：

> **是谁掌握流程？**

例如：

```javascript
list.forEach(item=>{

});
```

是谁：

掌握流程？

答案：

```
forEach
```

---

```javascript
setTimeout(()=>{

},1000);
```

是谁？

```
浏览器
```

---

```
<MyTable>

</MyTable>
```

是谁？

```
MyTable
```

---

然后：

再问：

> **我提供了什么？**

答案：

```
一个函数（或模板）
```

---

## 🎯 到这里，你已经掌握了 JavaScript 最核心的思想之一。

接下来学 `map` 、 `filter` 、 `find` 就非常容易了，因为它们只是：

- **都需要你提供一个回调函数；**
- **区别仅在于 JavaScript 如何利用你这个回调函数的返回结果。**

这也是为什么很多老前端会说：

> **JavaScript 最重要的不是对象，也不是 Promise，而是"函数是一等公民（First-class Function）"。**

理解了这一点，你会发现 Vue、React、Node.js、Promise、事件、数组方法，甚至很多第三方库，都在围绕同一个思想设计。

---

继续

---

很好，现在进入我认为 **JavaScript 最有价值的一章** 。

---

## 第三阶段 第二课：map、filter、find 为什么长得这么像？

很多新人看到：

```javascript
list.map()

list.filter()

list.find()

list.some()

list.every()
```

觉得：

**怎么这么多？**

是不是要背？

**不用。**

因为它们本质上都是同一个套路。

---

## 先看 forEach

例如：

```javascript
const users = [
    {name:"Tom"},
    {name:"Jack"},
    {name:"Lucy"}
]

users.forEach(user=>{

    console.log(user.name);

});
```

JavaScript：

负责：

```
Tom

Jack

Lucy
```

一个一个给你。

你负责：

```javascript
console.log(...)
```

---

## 那 map 呢？

例如：

有：

```javascript
const users = [
    {name:"Tom"},
    {name:"Jack"},
    {name:"Lucy"}
]
```

现在：

我要：

```
["Tom","Jack","Lucy"]
```

怎么办？

以前：

只能：

```javascript
const names=[];

users.forEach(user=>{

    names.push(user.name);

});
```

是不是：

自己：

创建数组。

自己：

push。

---

于是：

JavaScript：

说：

> **这种事情太常见了，我帮你。**

于是：

有了：

```javascript
const names = users.map(user=>{

    return user.name;

});
```

得到：

```javascript
[
    "Tom",
    "Jack",
    "Lucy"
]
```

---

## map 到底做了什么？

脑子里面：

翻译：

```
Tom

↓

return "Tom"

↓

放进新数组

------------

Jack

↓

return "Jack"

↓

放进新数组

------------

Lucy

↓

return "Lucy"

↓

放进新数组
```

最后：

JavaScript：

帮你：

组成：

```javascript
[
    "Tom",
    "Jack",
    "Lucy"
]
```

---

### 所以一句话：

> **map = 每处理一个元素，就把 return 的结果收集起来，组成一个新数组。**

这是最重要的一句话。

---

## filter

再来看：

假设：

```javascript
const users=[
    {name:"Tom",age:18},
    {name:"Jack",age:25},
    {name:"Lucy",age:20}
]
```

我要：

成年：

```
age>=20
```

以前：

```javascript
const result=[];

users.forEach(user=>{

    if(user.age>=20){

        result.push(user);

    }

});
```

是不是：

又：

自己：

push。

---

JavaScript：

说：

> 我帮你。

于是：

```javascript
const result=users.filter(user=>{

    return user.age>=20;

});
```

得到：

```javascript
[
    {name:"Jack"},
    {name:"Lucy"}
]
```

---

## filter 到底干了什么？

脑子：

翻译：

```
Tom

↓

18>=20 ?

↓

false

↓

不要

------------

Jack

↓

25>=20 ?

↓

true

↓

留下

------------

Lucy

↓

20>=20 ?

↓

true

↓

留下
```

所以：

一句话：

> **filter = return true 留下，return false 删除。**

---

## find

例如：

我要：

找到：

Jack。

```javascript
const user=users.find(user=>{

    return user.name==="Jack";

});
```

得到：

```javascript
{
    name:"Jack",
    age:25
}
```

---

脑子：

翻译：

```
Tom

↓

是 Jack 吗？

↓

不是

继续

------------

Jack

↓

是 Jack 吗？

↓

是

↓

返回

结束
```

注意：

find：

找到：

立即：

停止。

---

一句话：

> **find = 找到第一个符合条件的元素。**

不是数组。

是对象。

---

## some

例如：

有没有：

成年人？

```javascript
const hasAdult=users.some(user=>{

    return user.age>=20;

});
```

得到：

```javascript
true
```

为什么？

因为：

有：

Jack。

---

一句话：

> **some = 有没有一个符合。**

---

## every

例如：

是不是：

全部：

成年？

```javascript
users.every(user=>{

    return user.age>=20;

});
```

得到：

```
false
```

因为：

Tom：

18。

---

一句话：

> **every = 是不是全部符合。**

---

## 终于总结

看看：

是不是：

其实：

完全一样？

forEach：

```javascript
list.forEach(item=>{

});
```

map：

```javascript
list.map(item=>{

    return ...

});
```

filter：

```javascript
list.filter(item=>{

    return true/false;

});
```

find：

```javascript
list.find(item=>{

    return true/false;

});
```

some：

```javascript
list.some(item=>{

    return true/false;

});
```

every：

```javascript
list.every(item=>{

    return true/false;

});
```

是不是：

都：

长一样？

因为：

**都是 JavaScript 在循环。**

区别：

只是：

JavaScript：

拿你的：

return

干什么。

---

## 一张表全部记住

| 方法 | return 的作用 | 最终返回 |
| --- | --- | --- |
| forEach | 不关心 | `undefined` |
| map | 放进新数组 | 新数组 |
| filter | `true` 保留， `false` 删除 | 新数组 |
| find | `true` 就停止 | 一个元素或 `undefined` |
| some | `true` 就停止 | `true/false` |
| every | `false` 就停止 | `true/false` |

---

## 企业项目天天写

例如：

后台：

返回：

```javascript
[
    {
        id:1,
        name:"Tom"
    },
    {
        id:2,
        name:"Jack"
    }
]
```

下拉框：

只需要：

```
name
```

怎么办？

```javascript
const options=list.map(item=>{

    return item.name;

});
```

---

删除：

禁用：

用户：

```javascript
const list=users.filter(user=>{

    return !user.disabled;

});
```

---

点击：

编辑：

找到：

用户：

```javascript
const user=users.find(item=>{

    return item.id===id;

});
```

---

检查：

有没有：

管理员：

```javascript
users.some(user=>{

    return user.role==="admin";

});
```

---

检查：

是不是：

全部：

填写：

```javascript
form.every(item=>{

    return item.value!=="";

});
```

---

## 最后，我想纠正一个很多教程容易造成的误解

很多教程会告诉你：

- `map` 用于映射。
- `filter` 用于过滤。
- `find` 用于查找。

这些说法没错，但容易变成死记。

我更希望你记住它们共同的模式：

1. **JavaScript 帮你遍历数组。**
2. **你提供一个回调函数。**
3. **JavaScript 根据这个回调的返回值，决定最终结果。**

只要抓住这三点，你以后看到新的数组方法（比如 `reduce` 、 `flatMap` ）也不会害怕，因为它们仍然是在这个思路上扩展出来的。

---

下一节，我们就进入 **Promise 和异步** 。这是前端另一个核心概念，也是很多刚接触 JavaScript 的人最容易困惑的地方。到时候 我会从 **为什么需要异步** 开始讲 ，而不是直接讲 `.then()` 和 `async/await` 。

---

继续

---

很好，我们终于来到 **Promise** 了。

这是我最想认真讲的一章。

因为 **Promise 不是语法问题，而是思维问题。**

很多教程一上来就是：

```javascript
axios.get(...).then(...)
```

新人只能死记。

我们今天 **不写 Promise** 。

先回答一个问题：

> **为什么会有异步？**

---

## 第四阶段 第一课：为什么需要异步？

先举一个生活中的例子。

假设你去餐厅。

有两种模式。

---

## 第一种：同步（Synchronous）

老板说：

```
点餐

↓

站着等

↓

做好

↓

拿走
```

整个过程：

你不能干别的。

老板没做好。

你一直站着。

这就是：

> **同步。**

一句话：

> **必须等上一件事完成，才能做下一件事。**

---

## 第二种：异步（Asynchronous）

老板说：

```
点餐

↓

给你号码

↓

你去逛街

↓

做好叫你
```

注意：

这时候：

饭还没做好。

但是：

你已经：

开始：

干别的。

做好以后：

通知你。

这就是：

> **异步。**

---

## 浏览器为什么必须异步？

例如：

你点一个按钮：

```
<button @click="loadData">
```

里面：

```javascript
loadData(){

    axios.get(...)

}
```

假设：

这个接口：

需要：

10 秒。

如果：

浏览器：

同步。

会怎样？

```
点击按钮

↓

整个浏览器

卡住

10 秒

↓

接口回来

↓

继续
```

是不是：

很可怕？

这时候：

你：

不能：

滚动。

不能：

点击。

不能：

输入。

整个页面：

死掉。

---

所以：

浏览器：

必须：

异步。

流程：

变成：

```
点击按钮

↓

发送请求

↓

继续响应用户操作

↓

接口回来

↓

通知 JavaScript
```

是不是：

体验：

好多了？

---

## 谁负责等待？

这里：

很多新人：

第一次：

都会：

理解错。

例如：

```javascript
axios.get(...)
```

是谁：

等待？

很多人：

以为：

JavaScript。

不是。

是：

```
浏览器
```

或者：

Node.js。

JavaScript：

其实：

已经：

继续：

往下执行了。

---

## 举个例子

例如：

```javascript
console.log("开始");

axios.get("/user");

console.log("结束");
```

很多新人：

猜：

输出：

```
开始

（接口回来）

结束
```

其实：

不是。

真正：

输出：

```
开始

结束

（接口回来）
```

为什么？

因为：

```
发送请求
```

只需要：

几十微秒。

真正：

下载：

浏览器：

负责。

JavaScript：

继续：

执行。

---

## 那接口回来怎么办？

浏览器：

会说：

> **我不知道你想干什么。**

于是：

就像：

我们之前讲的：

JavaScript：

最喜欢：

传函数。

于是：

```javascript
axios.get(...).then(function(res){

});
```

什么意思？

浏览器：

说：

> **接口回来以后，我帮你调用这个函数。**

是不是：

和：

forEach：

一样？

---

forEach：

说：

> 我负责：

循环。

你负责：

处理。

---

Promise：

说：

> 我负责：

等待。

你负责：

处理。

---

## 终于理解 then

例如：

```javascript
axios.get("/user").then(res=>{

    console.log(res);

});
```

脑子：

不要：

翻译：

then。

直接：

翻译：

成：

```
请求

↓

回来以后

↓

执行这个函数
```

是不是：

一下：

就简单了？

---

## 再举一个生活例子

假设：

你叫快递。

你：

不会：

```
站门口

等

2 小时
```

而是：

告诉快递员：

```
到了

给我打电话
```

这里：

```
给我打电话
```

就是：

回调。

是不是：

和：

```javascript
.then(...)
```

越来越像？

---

## Promise 到底是什么？

很多书：

说：

Promise 是承诺。

其实：

我觉得：

不好理解。

我更喜欢：

一句话。

> **Promise 就是一张"未来会有结果"的票据。**

例如：

```javascript
const p = axios.get("/user");
```

这里：

```
p
```

不是：

数据。

因为：

数据：

还没回来。

它只是：

一张：

票。

以后：

一定：

会：

变成：

```
成功
```

或者：

```
失败
```

所以：

Promise：

表示：

> **未来某个时间点才会得到结果。**

---

## 为什么不能这样？

很多新人：

第一次：

都会：

这样：

写：

```javascript
const res = axios.get("/user");

console.log(res.data);
```

为什么：

错？

因为：

这时候：

```
res
```

不是：

真正的数据。

而是：

Promise。

就像：

你：

刚点完外卖。

马上：

问：

```
饭呢？
```

还没做好。

---

## Promise 三种状态（了解即可）

Promise：

一生：

只有：

三种：

状态。

```
等待

↓

成功

或者

失败
```

对应：

```
Pending

↓

Fulfilled

Rejected
```

一旦：

成功。

或者：

失败。

就：

结束。

不会：

再：

变。

---

## 今天最重要的一句话（一定要理解）

以后：

看到：

```javascript
axios.get(...).then(res=>{

});
```

不要：

想：

Promise。

不要：

想：

then。

脑子：

直接：

翻译：

> **请求发出去，浏览器继续干别的；等请求完成后，再调用我提供的这个函数。**

---

## 你有没有发现？

我们学到现在，几乎所有知识都串起来了：

- **forEach** ：JavaScript 负责遍历，你负责处理每一项。
- **slot** ：子组件负责渲染流程，你负责提供模板。
- **Promise.then()** ：浏览器负责等待请求，你负责处理结果。

它们虽然长得不一样，但背后的设计思想是一样的：

> **流程由框架或运行环境控制，具体怎么处理由你通过一个函数（或模板）告诉它。**

这也是为什么前端代码里到处都是回调、箭头函数、 `then` 、事件处理器——它们其实都在解决同一种问题。

---

## 下一节我们讲 async/await

等学完那一节，你会彻底明白：

为什么下面两段代码是一样的：

```javascript
axios.get("/user").then(res => {
    console.log(res);
});
```

和

```javascript
const res = await axios.get("/user");
console.log(res);
```

以及为什么 **`await` 看起来像同步，实际上底层仍然是异步** 。这是很多人第一次接触时最容易误解的地方。

---

继续

---

很好，我们继续。

今天这一课是 **JavaScript 最容易让新人产生错觉的一课** 。

> **为什么 `await` 看起来像同步，但实际上还是异步？**

很多教程都是直接教语法：

```javascript
const res = await axios.get(...)
```

但是不解释为什么。

我们还是按照我们的学习方式：

> **先理解为什么，再学语法。**

---

## 第四阶段 第二课：为什么需要 async/await？

先回忆一下 Promise。

例如：

```javascript
axios.get("/user").then(res => {

    console.log(res);

});
```

有没有什么问题？

其实没有。

但是如果连续请求呢？

例如：

先查用户。

再查订单。

再查物流。

```javascript
axios.get("/user").then(user => {

    axios.get("/order").then(order => {

        axios.get("/logistics").then(logistics => {

            console.log(logistics);

        });

    });

});
```

是不是开始往右边长了？

很多层以后：

```
then
    then
        then
            then
                then
```

这就叫：

> **回调地狱（Callback Hell）**

不是 Promise 不好。

而是：

**代码越来越难读。**

---

## 有没有一种写法像正常代码？

我们真正想写的是：

```
查用户

↓

查订单

↓

查物流
```

像这样：

```javascript
const user = 获取用户();

const order = 获取订单();

const logistics = 获取物流();
```

是不是很舒服？

于是：

JavaScript 提供了：

```
async

await
```

---

## 第一课：await 是什么意思？

例如：

```javascript
const res = await axios.get("/user");
```

很多人理解成：

> **等待。**

没错。

但是我更喜欢翻译成：

> **"等结果回来，再继续执行这一行下面的代码。"**

例如：

```javascript
console.log("1");

const res = await axios.get("/user");

console.log("2");
```

脑子里翻译成：

```
输出1

↓

发送请求

↓

暂停当前函数

↓

请求回来

↓

继续执行

↓

输出2
```

注意一个词：

> **暂停当前函数**

不是：

暂停浏览器。

不是：

暂停整个 JavaScript。

这一点特别重要。

---

## 为什么浏览器没有卡住？

很多新人会误会：

```javascript
await axios.get(...)
```

是不是浏览器一直在等？

不是。

浏览器仍然可以：

- 点击按钮
- 滚动页面
- 输入文字
- 播放动画

因为：

真正等待网络的是：

**浏览器（或 Node.js）** 。

`await` 做的事情只是：

> **告诉 JavaScript："当前这个函数先别往下执行，等 Promise 完成再继续。"**

只有这个函数暂停了。

其它代码照样运行。

---

## 举个更形象的例子

假设：

你去银行办业务。

银行说：

```
请稍等。

叫到你的号再回来。
```

于是：

你：

去便利店买水。

去打电话。

去散步。

银行：

并没有让整个世界停止。

只是：

**你的这件事情暂停了。**

等叫号：

你回来继续。

这就是：

```
await
```

---

## 为什么必须写 async？

例如：

很多人这样写：

```javascript
function load(){

    const res = await axios.get(...);

}
```

浏览器直接报错。

为什么？

因为：

JavaScript 要区分：

这个函数：

是不是允许暂停。

于是：

必须告诉它：

```javascript
async function load(){

}
```

意思就是：

> **这个函数允许使用 await。**

---

## 所以：

```javascript
async function load(){

    const res = await axios.get(...);

}
```

可以理解成：

```
这是一个可以暂停的函数。
```

---

## async 到底返回什么？

这里很多人也不知道。

例如：

```javascript
async function test(){

    return 123;

}
```

你觉得：

```javascript
test();
```

返回：

```
123
```

吗？

其实不是。

返回的是：

```
Promise
```

为什么？

因为：

async 函数本质就是：

> **帮你自动包装成 Promise。**

所以：

下面两段：

几乎一样。

第一种：

```javascript
function test(){

    return Promise.resolve(123);

}
```

第二种：

```javascript
async function test(){

    return 123;

}
```

是不是方便很多？

---

## 为什么公司越来越喜欢 async/await？

看一眼就知道。

Promise：

```javascript
axios.get("/user").then(user => {

    return axios.get("/order");

}).then(order => {

    return axios.get("/logistics");

}).then(logistics => {

    console.log(logistics);

});
```

async：

```javascript
const user = await axios.get("/user");

const order = await axios.get("/order");

const logistics = await axios.get("/logistics");

console.log(logistics);
```

是不是像正常程序？

所以：

**async/await 没有改变异步。**

它只是：

> **把异步代码写得像同步代码。**

这是它最大的价值。

---

## 企业项目里的真实例子

例如：

保存按钮：

```javascript
async save(){

    const res = await axios.post("/save", this.form);

    if(res.code===200){

        this.$message.success("保存成功");

    }

}
```

脑子翻译：

```
点击保存

↓

发送请求

↓

等待返回

↓

成功

↓

提示保存成功
```

是不是很自然？

---

## 那 Promise 还需要学吗？

需要。

因为：

**async/await 底层就是 Promise。**

你可以理解成：

```
Promise
    ↑
    │
async/await
```

就像：

我们写：

```javascript
const {name} = user;
```

底层其实还是：

```javascript
const name = user.name;
```

只是：

语法更简单。

---

## 我们把异步这一章总结一下

## 浏览器负责什么？

- 发请求
- 等网络
- 通知 JavaScript

---

## JavaScript 负责什么？

- 写处理逻辑
- 收到通知后继续执行

---

## Promise 是什么？

> **未来会有结果的对象。**

---

## then 是什么？

> **结果回来以后执行这个函数。**

---

## await 是什么？

> **暂停当前函数，等 Promise 完成，再继续。**

---

## async 是什么？

> **声明这是一个可以使用 await 的函数。**

---

## 到这里，你已经学完了 JavaScript 企业开发最核心的四大块：

✅ 对象  
✅ 数组  
✅ 函数（回调）  
✅ 异步（Promise / async）

---

## 接下来，我建议不要急着学 Vue。

虽然你是做 Vue2 的，但还有一个知识点如果现在补上，后面 Vue 会轻松很多：

> **JavaScript 到底是怎么执行代码的？**

也就是：

- 调用栈（Call Stack）
- 事件循环（Event Loop）
- 宏任务（Macro Task）
- 微任务（Micro Task）

这是很多人觉得"玄学"的地方，也是为什么：

```javascript
console.log(1);

setTimeout(() => console.log(2));

Promise.resolve().then(() => console.log(3));

console.log(4);
```

输出是：

```
1
4
3
2
```

而不是其他顺序。

\*\*理解了事件循环，你会真正明白 JavaScript 为什么能异步，也会彻底理解 `Promise` 和 `await` 的执行过程。\*\*这也是我认为进入 Vue 之前最后一个重要的 JavaScript 基础。

---

继续

---

很好，我们开始这一章。

**这一章是 JavaScript 最难的一章，也是很多教程讲得最差的一章。**

不过按照我们前面的方式—— **先理解为什么，再理解机制** ——其实没有那么难。

---

## 第五阶段：JavaScript 是怎么运行的？

先问一个问题。

假设：

```javascript
console.log("A");

console.log("B");

console.log("C");
```

为什么输出：

```
A
B
C
```

而不是：

```
B
A
C
```

因为：

JavaScript 有一个特点：

> **同一时刻，只能执行一件事情。**

这个特点叫：

> **单线程（Single Thread）**

---

## 什么叫单线程？

你可以把 JavaScript 想成一个员工。

例如：

公司只有一个员工。

老板给他任务：

```
① 打电话

② 发邮件

③ 打印合同
```

员工：

只能：

```
打电话

↓

打完

↓

发邮件

↓

发完

↓

打印
```

不能：

```
一边打电话

一边打印
```

因为：

只有：

**一个人。**

JavaScript：

也是。

---

## 为什么 JavaScript 是单线程？

很多人问：

CPU 明明有很多核心。

为什么：

JavaScript：

不用？

原因：

还是浏览器。

例如：

两个线程：

同时：

修改：

```javascript
document.body.innerHTML
```

一个：

改成：

```
Hello
```

一个：

改成：

```
World
```

最后：

页面：

到底应该显示什么？

所以：

浏览器：

规定：

JavaScript：

只有：

一个线程。

避免：

大家一起修改页面。

---

## 那异步怎么办？

现在：

矛盾来了。

JavaScript：

只有：

一个线程。

但是：

接口：

要等：

5 秒。

怎么办？

这里：

浏览器：

出来帮忙了。

---

## 浏览器不是 JavaScript！

这是一个特别容易混淆的地方。

很多人以为：

JavaScript：

什么都会。

其实不是。

浏览器里面：

很多能力：

都是浏览器提供的。

例如：

```javascript
setTimeout()
```

是谁提供？

浏览器。

---

```javascript
fetch()
```

谁提供？

浏览器。

---

```javascript
axios
```

底层：

还是：

浏览器。

---

```javascript
addEventListener()
```

浏览器。

---

所以：

真正等待：

网络。

真正等待：

定时器。

都是：

浏览器。

不是：

JavaScript。

---

## 浏览器和 JavaScript 怎么合作？

例如：

```javascript
console.log("开始");

setTimeout(() => {

    console.log("两秒后");

},2000);

console.log("结束");
```

很多新人：

第一次：

都会猜：

```
开始

（等两秒）

两秒后

结束
```

其实：

不是。

真正：

```
开始

结束

（两秒）

两秒后
```

为什么？

---

## 真正发生了什么？

第一步：

JavaScript：

执行：

```javascript
console.log("开始");
```

输出：

```
开始
```

---

第二步：

看到：

```javascript
setTimeout(...)
```

JavaScript：

不会：

自己：

计时。

它会：

对浏览器说：

> **"帮我两秒后执行这个函数。"**

注意：

只是：

**交代任务。**

不是：

等待。

于是：

浏览器：

开始：

计时。

JavaScript：

继续：

往下。

---

第三步：

执行：

```javascript
console.log("结束");
```

输出：

```
结束
```

---

第四步：

JavaScript：

已经：

执行完了。

这时候：

浏览器：

两秒：

也到了。

于是：

浏览器：

告诉 JavaScript：

> **"你刚才让我执行的那个函数，可以执行了。"**

于是：

JavaScript：

再次：

执行：

```javascript
console.log("两秒后");
```

---

是不是：

整个过程：

就合理了？

---

## JavaScript 有一个任务队列

脑子里面：

画这样一张图。

```
JavaScript

    ┌────────┐
    │        │
    │ 正在执行 │
    │        │
    └────────┘
          │
          │
  执行完当前代码
          │
          ▼

    任务队列

setTimeout

点击事件

Promise.then
```

JavaScript：

永远：

先：

执行：

当前代码。

当前代码：

全部：

结束。

再去：

任务队列：

拿：

任务。

---

## 这就是 Event Loop（事件循环）

很多教程：

会画：

特别复杂。

其实：

一句话：

> **JavaScript 一直重复做一件事情。**

```
执行当前代码

↓

看看队列有没有任务

↓

有

↓

拿一个执行

↓

继续看

↓

继续拿
```

一直：

循环。

所以：

叫：

**事件循环。**

---

## 为什么 Promise 比 setTimeout 快？

终于来到：

最经典的一题。

看看：

```javascript
console.log(1);

setTimeout(() => {

    console.log(2);

},0);

Promise.resolve().then(() => {

    console.log(3);

});

console.log(4);
```

很多新人：

猜：

```
1

2

3

4
```

或者：

```
1

4

2

3
```

其实：

正确：

```
1

4

3

2
```

为什么？

这里：

要认识：

两个队列。

---

## 浏览器把任务分两类

第一类：

普通任务：

```
setTimeout

setInterval

点击事件
```

叫：

**宏任务（Macro Task）**

---

第二类：

Promise：

```
Promise.then

await 后面的继续执行

queueMicrotask
```

叫：

**微任务（Micro Task）**

---

## JavaScript 的规则

每执行完一轮代码：

```
先执行：

所有微任务

↓

再执行：

一个宏任务

↓

再执行：

所有微任务

↓

再执行：

一个宏任务
```

注意：

> **微任务优先级比宏任务高。**

这是唯一要记住的规则。

---

## 我们一步一步分析

代码：

```javascript
console.log(1);
```

输出：

```
1
```

---

遇到：

```javascript
setTimeout(...)
```

浏览器：

放：

宏任务。

现在：

```
宏任务：

2
```

---

遇到：

```javascript
Promise.then(...)
```

放：

微任务。

现在：

```
微任务：

3
```

---

继续：

```javascript
console.log(4);
```

输出：

```
4
```

---

同步代码：

结束。

开始：

清空：

微任务。

输出：

```
3
```

---

最后：

执行：

宏任务。

输出：

```
2
```

最终：

```
1

4

3

2
```

---

## await 为什么也一样？

例如：

```javascript
async function test(){

    console.log(1);

    await Promise.resolve();

    console.log(2);

}

test();

console.log(3);
```

输出：

```
1

3

2
```

为什么？

因为：

`await` 后面的代码：

其实：

也是：

一个：

**微任务。**

所以：

它：

和：

`.then()` ：

本质：

一样。

---

## 🎯 今天你真正应该记住的，不是"宏任务、微任务"这些名词。

而是下面这几个核心事实：

1. **JavaScript 是单线程的** ，一次只能执行一件事。
2. **浏览器负责计时、网络请求、点击事件等异步能力** ，JavaScript 不负责等待。
3. **浏览器完成异步任务后，会把对应的回调放进任务队列。**
4. **JavaScript 当前代码执行完后，才会去处理任务队列。**
5. **Promise（包括 `await` 后续代码）属于微任务，优先于 `setTimeout` 这类宏任务。**

---

## 到这里，你已经拥有了理解 Vue2 的全部 JavaScript 基础。

你会发现，我们一路走来，所有知识都是串起来的：

- 对象：Vue 的数据为什么是对象。
- 数组：表格为什么都是数组，为什么用 `map` 、 `filter` 。
- 函数：为什么到处都是回调。
- Promise：为什么接口不会阻塞页面。
- `async/await` ：为什么代码可以写得像同步。
- Event Loop：为什么 `then` 、 `await` 、 `setTimeout` 的执行顺序会不同。

\*\*从下一阶段开始，我们就可以正式进入 Vue2，并且很多以前觉得"神奇"的写法，你都会知道它背后的 JavaScript 原理。\*\*我也会一直结合你们公司项目（表格、插槽、组件库）的场景来讲，而不是只讲 Vue API。

---

你说的事件循环，执行当前代码-队列取任务，一直循环；这怎么和执行所有微任务和再执行一个宏任务，一直循环；这怎么结合起来理解，还有任务和同步代码有什么关系和区别

---

这个问题问得非常好。

**你已经开始从"会用 JavaScript"过渡到"理解 JavaScript 为什么这样设计"了。**

实际上，你困惑的地方也是几乎所有人第一次学 Event Loop 都会卡住的地方。

原因是 **很多教程把"同步代码"也叫任务，把"宏任务"也叫任务，导致两个"任务"混在一起了。**

我们重新建立一个模型，你以后就不会乱了。

---

## 第一步：先忘掉微任务、宏任务

先只记住：

JavaScript 永远只有一件事情：

> **执行一段代码。**

例如：

```javascript
console.log(1);

console.log(2);

console.log(3);
```

JavaScript 就一直执行：

```
第一句

↓

第二句

↓

第三句
```

执行完。

结束。

这里根本没有什么队列。

---

## 那队列什么时候才会出现？

只有遇到：

```javascript
setTimeout()

Promise.then()

点击事件

axios
```

这些需要等待的东西。

例如：

```javascript
console.log(1);

setTimeout(() => {
    console.log(2);
}, 1000);

console.log(3);
```

JavaScript 执行到：

```javascript
setTimeout(...)
```

它不会自己等待。

而是：

**把"以后要执行的函数"交给浏览器。**

注意：

这里进入队列的不是：

```javascript
setTimeout(...)
```

而是：

```javascript
() => {
    console.log(2);
}
```

也就是说：

**进入队列的是回调函数。**

---

## 第二步：同步代码是什么？

来看：

```javascript
console.log(1);

console.log(2);

console.log(3);
```

这三句：

叫：

**同步代码。**

为什么？

因为：

JavaScript 可以立即执行。

不需要等待任何东西。

---

例如：

下面这些：

都是同步代码。

```javascript
let a = 10;

const user = {};

console.log(user);

for (...) {}

if (...) {}
```

都是：

来了就执行。

---

## 第三步：异步代码是什么？

例如：

```javascript
setTimeout(() => {

    console.log(2);

},1000);
```

这里：

真正异步的是：

**等待一秒。**

JavaScript：

不会等。

于是：

浏览器：

负责等待。

等待结束以后。

浏览器：

把：

```javascript
() => {

    console.log(2);

}
```

放进：

任务队列。

所以：

**真正进入队列的是回调函数。**

---

## 终于回答你的问题

你问：

> 同步代码和任务是什么关系？

其实：

同步代码：

也是一种任务。

但是：

它有一个特殊名字。

叫：

**第一个宏任务（Script）**

这个知识很多教程都不讲。

其实浏览器启动 JavaScript 时：

就已经创建了一个任务。

例如：

整个：

```javascript
console.log(1);

Promise.resolve().then(()=>{

});

console.log(2);
```

其实浏览器看成：

```
第一个宏任务（整个 script）

↓

console.log(1)

↓

Promise...

↓

console.log(2)
```

也就是说：

**整个 JS 文件，就是第一个宏任务。**

---

## 真正的 Event Loop

所以：

真正流程其实是：

```
取出一个宏任务

↓

执行这个宏任务

↓

执行所有微任务

↓

再取一个宏任务

↓

执行这个宏任务

↓

执行所有微任务

↓

一直循环
```

是不是和你看到的：

```
执行同步代码

↓

执行所有微任务

↓

执行一个宏任务
```

一样了？

因为：

**同步代码其实就是第一个宏任务。**

---

## 举个完整例子

例如：

```javascript
console.log(1);

setTimeout(() => {

    console.log(2);

},0);

Promise.resolve().then(() => {

    console.log(3);

});

console.log(4);
```

我们画出来。

---

## 浏览器先创建：

```
宏任务队列

┌─────────────┐
│ 整个script │
└─────────────┘
```

开始执行。

---

执行：

```javascript
console.log(1);
```

输出：

```
1
```

---

执行：

```javascript
setTimeout(...)
```

浏览器：

记录：

以后：

把：

```
console.log(2)
```

放到：

宏任务队列。

现在：

```
宏任务队列

script（正在执行）

setTimeout
```

---

执行：

```javascript
Promise.then(...)
```

Promise：

放到：

微任务队列。

```
微任务

Promise.then
```

---

执行：

```javascript
console.log(4);
```

输出：

```
4
```

---

script：

结束。

现在：

开始：

执行：

所有微任务。

输出：

```
3
```

---

微任务：

没有了。

再去：

宏任务队列。

拿：

setTimeout。

输出：

```
2
```

结束。

---

## 为什么微任务不能放最后？

这是浏览器设计。

例如：

```javascript
button.onclick=()=>{

    state++;

    Promise.resolve().then(()=>{

        更新DOM();

    });

}
```

浏览器希望：

**这次点击产生的 Promise 逻辑，在进入下一轮事件（比如下一次点击、下一次定时器）之前全部处理完。**

所以：

规定：

> 每完成一个宏任务，就把微任务全部执行完。

这样：

页面状态就不会拖到下一轮。

---

## 我给你一个最容易记住的模型（这是我自己总结的）

不要记：

```
同步

宏任务

微任务
```

容易乱。

改成：

想象 JavaScript 是一个员工。

员工桌上：

有：

```
┌────────────┐
│ 当前工作   │
└────────────┘
```

旁边：

两个篮子：

```
微任务篮子

Promise

await

宏任务篮子

setTimeout

click

ajax完成
```

员工规则：

```
① 干完当前工作

↓

② 把微任务篮子全部清空

↓

③ 宏任务篮子拿一个工作

↓

④ 干完以后

↓

⑤ 再清空微任务

↓

⑥ 再拿一个宏任务

↓

一直循环
```

这个模型和浏览器真正实现已经非常接近了。

---

## 我建议下一节，我专门讲一个很多前端都讲不清楚的话题：

> **浏览器（Web APIs）、JavaScript 引擎（V8）、Event Loop 三者到底分别负责什么？**

很多人学了几年，都分不清：

- 为什么 `setTimeout` 不是 JavaScript 的？
- 为什么 `Promise` 和 `setTimeout` 的优先级不同？
- 为什么 `axios` 、 `fetch` 、DOM 事件都能放进 Event Loop？

把这三个角色分清楚以后，Event Loop 就彻底没有任何神秘感了。

---

继续

---

太好了，我们继续。

**这一节我认为是整个 JavaScript 最重要的一节。**

如果这一节懂了，以后你再学 Vue、React、Node，脑子都会特别清晰。

---

## 第六阶段：浏览器、JavaScript、Event Loop 到底谁负责什么？

很多人脑子里面都是这样的：

```
JavaScript
    │
    ├── setTimeout
    ├── Promise
    ├── ajax
    ├── click
```

**这是错的。**

真正应该画成这样：

```
浏览器 (Chrome)

┌─────────────────────────┐
│                         │
│  JavaScript 引擎 (V8)    │
│                         │
│    执行 JS 代码         │
│                         │
└─────────────────────────┘

      浏览器能力(Web APIs)

setTimeout

DOM

click

网络请求(fetch、XHR)

localStorage

Canvas

...

      Event Loop

宏任务队列

微任务队列
```

**注意：JavaScript 引擎只是浏览器里的一个部分。**

---

## 第一位角色：JavaScript 引擎（V8）

它会什么？

答案：

**只会执行 JavaScript。**

例如：

```javascript
let a = 10;

let b = 20;

console.log(a + b);
```

V8 很开心。

这些都是它的工作。

---

它还会：

```javascript
if (...) {}

for (...) {}

function() {}

class {}

const {}
```

这些都是：

**纯 JavaScript。**

---

但是：

它不会：

```javascript
setTimeout()
```

为什么？

因为：

**JavaScript 语言里面根本没有 setTimeout。**

这里很多人第一次听都会震惊。

---

## 证明一下

假设：

不用浏览器。

直接：

Node.js。

早期：

```javascript
document.querySelector(...)
```

直接报错。

为什么？

因为：

Node：

没有：

浏览器。

没有：

DOM。

---

所以：

DOM：

不是：

JavaScript。

而是：

浏览器提供。

---

## 第二位角色：浏览器(Web APIs)

浏览器特别厉害。

它会：

计时：

```javascript
setTimeout(...)
```

网络：

```javascript
fetch(...)
```

DOM：

```javascript
document.querySelector(...)
```

点击：

```javascript
button.onclick
```

动画：

```javascript
requestAnimationFrame()
```

等等。

这些：

统统：

不是：

JavaScript。

都是：

浏览器。

---

所以：

JavaScript：

其实经常说：

> **浏览器，帮我做一件事。**

例如：

```javascript
setTimeout(fn,1000)
```

JavaScript：

实际上：

说的是：

> 浏览器，

请：

一秒以后：

通知我。

---

## 第三位角色：Event Loop

终于来了。

Event Loop：

其实：

不是：

JavaScript。

也不是：

浏览器 API。

它：

更像：

一个：

调度员。

它：

天天：

干一件事情。

看看：

有没有：

可以执行的任务。

例如：

浏览器：

说：

```
setTimeout 到时间了。
```

Event Loop：

收到。

放进：

宏任务队列。

---

Promise：

完成了。

Event Loop：

收到。

放进：

微任务队列。

---

JavaScript：

空闲了。

Event Loop：

说：

```
先执行微任务。

再执行宏任务。
```

是不是：

像：

一个：

管理员。

---

## 我们重新走一遍流程

例如：

```javascript
console.log("开始");

setTimeout(() => {

    console.log("两秒");

},2000);

console.log("结束");
```

一步一步来。

---

## 第一步

浏览器：

把：

整个：

script。

交给：

JavaScript。

```
宏任务队列

script
```

开始：

执行。

---

JavaScript：

执行：

```javascript
console.log("开始");
```

输出：

```
开始
```

---

执行：

```javascript
setTimeout(...)
```

JavaScript：

不会：

计时。

于是：

对浏览器说：

```
帮我计时两秒。

好了通知我。
```

然后：

继续：

执行。

---

执行：

```javascript
console.log("结束");
```

输出：

```
结束
```

---

script：

执行完。

JavaScript：

现在：

空闲。

---

两秒以后。

浏览器：

说：

```
时间到了。
```

Event Loop：

收到。

放：

宏任务队列。

```
宏任务

setTimeout
```

---

JavaScript：

空闲。

Event Loop：

说：

```
来。

执行它。
```

于是：

执行：

```javascript
console.log("两秒");
```

结束。

---

是不是：

整个：

过程：

非常清楚了？

---

## Promise 又是谁？

例如：

```javascript
Promise.resolve().then(() => {

    console.log(1);

});
```

很多人：

以为：

Promise：

浏览器。

其实：

不是。

Promise：

是：

JavaScript。

ES6：

规范。

所以：

V8：

认识：

Promise。

---

但是：

为什么：

还能：

异步？

因为：

Promise：

完成以后。

它：

会：

把：

```
then里面那个函数
```

交给：

Event Loop。

放：

微任务。

所以：

Promise：

虽然：

属于：

JavaScript。

但是：

最终：

还是：

Event Loop：

调度。

---

## axios 呢？

axios：

更特殊。

它：

既不是：

JavaScript。

也不是：

浏览器。

它：

只是：

一个：

第三方库。

例如：

```javascript
axios.get(...)
```

底层：

浏览器里面。

其实：

还是：

```
XMLHttpRequest

或者

fetch
```

所以：

真正：

网络请求。

仍然：

浏览器。

---

## 终于总结整个关系

请你以后脑子里一直保持下面这张图：

```
浏览器
────────────────────────────────

      JavaScript 引擎（V8）

        │
        │ 执行 JS
        ▼

    遇到 setTimeout

        │

        ▼

    浏览器开始计时

        │

        ▼

    时间到了

        │

        ▼

     Event Loop

        │

        ▼

    放进任务队列

        │

        ▼

    JavaScript 空闲

        │

        ▼

    执行回调函数
```

---

## 🎯 最后，我告诉你一个很多工作三五年的前端都容易混淆的地方

很多人会说：

> "JavaScript 是单线程，所以浏览器能异步。"

其实更准确的说法是：

> **JavaScript 引擎负责执行代码；浏览器负责提供异步能力；Event Loop 负责协调什么时候把回调交回 JavaScript 执行。**

也就是说，它们不是一个东西，而是三个角色在合作。

---

## 我建议这里暂停一下，做一个真正的"综合练习"。

不要再学新知识，而是拿下面这段代码， **像侦探一样分析每一步是谁在工作** ：

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

不要直接说输出 `A D C B` 。

而是试着按下面这种格式分析：

```
① 浏览器把整个 script 放入宏任务队列
② JavaScript 开始执行 script
③ 执行 console.log("A")
④ 遇到 setTimeout，交给浏览器计时……
...
```

\*\*如果你能完整分析完这一段代码，就说明 Event Loop 这一章你已经真正掌握了，而不是只记住了"微任务优先"这个结论。\*\*这是理解 JavaScript 异步最关键的一步。