可以，而且 **完全可行**，并且这是另一种非常常用、非常稳的跨标签页传参方案，比 postMessage 还简单，不需要担心消息丢失，通常用于同域页面之间一次性传参。

你说的流程实际上是：

# ✅ **LocalStorage 一次性中转 + SessionStorage 持久化（单Tab）方案**

流程如下：

1. **旧标签页下钻前**  
    → 把参数写到 localStorage（带唯一 key）
    
2. **新标签页第一次打开**  
    → 读取 localStorage（根据 key）  
    → 成功后立刻写入 sessionStorage（因为 sessionStorage 只在当前 tab 有效）  
    → 再把 localStorage 清掉（避免影响其它 tab）
    
3. **新标签页刷新**  
    → 从 sessionStorage 读取（不会依赖 localStorage）
    

---

# ⭐ 这种方案的优点

### ✔ 1. **不会有 postMessage 的加载时机问题**

localStorage 是同步的，浏览器保证可读取，100% 不会丢数据。

### ✔ 2. **不需要两个标签页之间通信**

不需要 window.opener  
不需要 ready 信号  
不需要监听 message

逻辑更简单。

### ✔ 3. **不会跨标签页污染（因为有 key）**

### ✔ 4. **sessionStorage 自动在标签页关闭后清除**

不需要你清理。

---

# ⚠ 这种方案的缺点

### ❗ localStorage 写入/删除 必须保证及时

否则：

- 若该 key 被多个标签页读取 → 混乱
    
- 若你忘了删除 → 旧数据可能残留
    

不过，你可以通过 key + timestamp 完全避免冲突。

---

# ✨ 推荐使用唯一 key 来隔离不同标签页

比如：

```js
const key = `drill_${Date.now()}_${Math.random()}`;
```

---

# 🧩 完整 Demo（可直接使用）

## 📁 旧标签页（mainPage.vue）

```js
openNewTab() {
  const payload = {
    query: this.queryParams,
    time: Date.now(),
  };

  const key = `drill_${payload.time}_${Math.random()}`;

  // 写入 localStorage，供新标签页读取
  localStorage.setItem(key, JSON.stringify(payload));

  // 打开新标签页
  window.open(`/#/myPage?key=${key}`, "_blank");
}
```

---

## 📁 新标签页（myPage.vue）

```vue
<script>
export default {
  data() {
    return {
      key: null,
      params: null,
    }
  },

  mounted() {
    const urlParams = new URLSearchParams(location.hash.split("?")[1]);
    this.key = urlParams.get("key");

    if (!this.key) {
      // 普通标签页，自己初始化
      this.params = { type: "normal" };
      return;
    }

    // 有 key = 下钻标签页
    this.initDrillPage();
  },

  methods: {
    initDrillPage() {
      const sessionKey = `pageParams_${this.key}`;

      // 1. 刷新情况 → 从 sessionStorage 恢复
      const saved = sessionStorage.getItem(sessionKey);
      if (saved) {
        console.log("刷新页面，从 sessionStorage 恢复");
        this.params = JSON.parse(saved);
        return;
      }

      // 2. 第一次打开 → 从 localStorage 读取
      const fromLocal = localStorage.getItem(this.key);
      if (!fromLocal) {
        console.error("localStorage 中没有数据，可能是打开太久或已被清除");
        return;
      }

      this.params = JSON.parse(fromLocal);

      // 写入 sessionStorage（用于刷新）
      sessionStorage.setItem(sessionKey, JSON.stringify(this.params));

      // 立刻删除 localStorage（避免脏数据）
      localStorage.removeItem(this.key);

      console.log("第一次打开，从 localStorage 获取数据并写入 sessionStorage");
    }
  }
};
</script>

<template>
  <div>
    <h2>MyPage 标签页</h2>

    <pre>{{ params }}</pre>
  </div>
</template>
```

---

# 📌 细节说明（非常关键）

### 1. 为什么只有第一次打开用 localStorage？

因为 localStorage 是全域共享的，只能当临时管道，不能当持久存储。

### 2. 为什么第二次刷新时不能再从 localStorage 拿？

因为你已经删掉了，避免下一个 tab 错误读取。

### 3. 为什么 sessionStorage 正好适合新标签页？

因为 sessionStorage 是 **每个标签页独立** 的，只在当前 tab 有效。

### 4. 为什么整个流程不需要修改后端？

因为全部在浏览器前端完成，不需要任何后端参与。

---

# ✔ 对比一下两个方案

|方案|稳定性|强一致性|是否需要两页通信|是否会丢数据|
|---|---|---|---|---|
|postMessage + sessionStorage|⭐⭐⭐⭐⭐|很强|是|有可能（加载太快/太慢需 ready 机制）|
|localStorage 中转 + sessionStorage|⭐⭐⭐⭐⭐|强|否|不会丢（localStorage 是同步的）|

### 🤝 因此

你觉得更好用是 **localStorage → sessionStorage** 方案，没错。

它确实更简洁、更稳、更容易维护。

---

# 如果你愿意

我可以：

✨ 把这个模式封装成一个 Vue composable: `useCrossTabParam()`  
或者  
✨ 让你通过一个函数就能“极简使用”

你需要吗？