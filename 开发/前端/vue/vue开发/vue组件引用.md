
---

## 1. Vue 组件依赖和数据传递方式

Vue 中组件之间共享/传递数据的常见方式：

1. **props**
    
    - 父组件传值给子组件。
        
    - 子组件通过 `props` 定义接收字段。
        
    
    ```vue
    <!-- 父组件 -->
    <UserCard :username="name" />
    
    <!-- 子组件 -->
    <script>
    export default {
      props: {
        username: String
      }
    }
    </script>
    ```
    
    👉 子组件里 `username` 就是父组件传入的值。  
    ⚠️ `props` 在子组件里是**只读**的（直接改会报警告）。
    

---

2. **emit**
    
    - 子组件向父组件通信。
        
    
    ```vue
    <!-- 子组件 -->
    <button @click="$emit('login', user)">登录</button>
    
    <!-- 父组件 -->
    <UserCard @login="handleLogin" />
    ```
    

---

3. **mixin**
    
    - 提取公共逻辑的方式，可以混入到多个组件。
        
    - 会把 `data`、`methods`、`computed` 等合并到组件中。
        
    
    ```js
    export const commonMixin = {
      data() {
        return { count: 0 }
      },
      methods: {
        log() { console.log('log from mixin') }
      }
    }
    ```
    
    ```vue
    <script>
    import { commonMixin } from './mixins/commonMixin.js'
    export default {
      mixins: [commonMixin]
    }
    </script>
    ```
    

---

4. **provide / inject**
    
    - 祖先组件给后代组件传值，不必一层层 props 传递。
        
    
    ```js
    // 父组件
    provide() { return { theme: 'dark' } }
    
    // 子孙组件
    inject: ['theme']
    ```
    

---

5. **Vuex / Pinia (全局状态管理)**
    
    - 项目大了后常用。
        

---

## 2. 同名冲突时的规则

Vue 的合并策略大致是：

- **props vs data**
    
    - 如果 `props` 和 `data` 里定义了同名字段，`data` 的优先。
        
    - 但是 Vue 会报警告，提示有冲突。
        
- **props vs methods**
    
    - 方法名和 `props` 冲突时，`methods` 覆盖 `props`。
        
    - 但是逻辑上容易引发混乱，不推荐。
        
- **mixin vs 组件本身**
    
    - 如果 **methods/computed/data** 重名，组件本身优先，覆盖 mixin。
        
    - 生命周期钩子（如 `mounted`）会**合并执行**，先执行 mixin，再执行组件自身。
        
- **provide/inject vs data/props**
    
    - 如果 inject 下来的 key 和本地 data 重名，本地 data 覆盖。
        

---

## 3. 作用域机制

- 每个组件有独立的作用域（`data`、`methods` 不会直接污染父子）。
    
- 父组件调用子组件的方法/变量，需要通过 **ref** 或事件通信。
    
    ```vue
    <Child ref="childRef" />
    this.$refs.childRef.someMethod()
    ```
    

---

## 4. 实际开发中的建议

- **props 用于数据输入**，子组件不要随意修改。
    
- **emit 用于事件通知**。
    
- **mixin 尽量少用**，因为冲突不易排查（Vue3 推荐用 Composition API 的 `setup` 组合函数代替）。
    
- 命名时避免和 `props`、`methods` 重名。
    
- 格式化规则（eslint + vue eslint plugin）可以帮你提前发现冲突。
    



---

## 1. 谁是父组件？谁是子组件？

**父子组件关系 = 组件之间的嵌套关系**

例子：

```vue
<!-- App.vue -->
<template>
  <div>
    <UserCard :username="name" />  <!-- UserCard 是子组件 -->
  </div>
</template>

<script>
import UserCard from './UserCard.vue'
export default {
  components: { UserCard },
  data() {
    return { name: 'Alice' }
  }
}
</script>
```

- **App.vue** 是父组件，因为它引入并使用了 `<UserCard />`。
    
- **UserCard.vue** 是子组件，因为它被父组件引用。
    

👉 简单记：谁“包含”谁，包含者就是父，里面被用的就是子。

---

## 2. mixin 是什么？

mixin **不是父也不是子**，它是一个“代码片段/逻辑模块”。

- 它不会出现在模板层级里。
    
- 它只是被“混入”到某个组件，让这个组件获得更多功能。
    

例子：

```js
// commonMixin.js
export const commonMixin = {
  data() {
    return { count: 0 }
  },
  methods: {
    log() { console.log('log from mixin') }
  }
}
```

```vue
<script>
import { commonMixin } from './commonMixin.js'
export default {
  mixins: [commonMixin],  // 混入逻辑
  data() {
    return { name: 'Alice' }
  }
}
</script>
```

- 这个组件会同时拥有 `count` 和 `name`，也会有 `log()` 方法。
    
- mixin 只是“拷贝进来”，而不是一个“父组件”。
    

---

## 3. 父子组件 vs mixin 的区别

|特性|父子组件|mixin|
|---|---|---|
|关系|结构上的嵌套（DOM/组件树）|逻辑层面的合并（代码复用）|
|数据传递方式|`props`（父传子）、`emit`（子传父）|直接合并到组件 `data/methods`|
|生命周期|各自独立，互不干扰|生命周期钩子会**合并执行**|
|模板使用|父组件里 `<子组件 />`|不能直接 `<mixin />`|
|调用方式|通过模板或 ref/emit 交互|像写在自己组件里一样调用|

---

## 4. 举个比喻

- **父子组件** = 房子和里面的家具。房子（父）里放了沙发（子），关系是结构上的。
    
- **mixin** = 装修工人。它把灯、电路、墙漆（逻辑）拷贝进房子，但它本身不是家具，也不会出现在房子里。
    

---

要不要我给你画一个 **图**，用“组件树”展示父子关系，再用“代码注入”展示 mixin？这样你就能一眼看出两者的区别。