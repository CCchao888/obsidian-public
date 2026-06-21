下面给你 **可直接用、逻辑清晰且完整的 Vue + postMessage + sessionStorage 方案代码**，完全满足你现在的需求：

**“同一个 Vue 文件、同一个路由、两个标签页，一个是正常标签页，一个是下钻标签页；下钻标签页第一次加载需要从主标签页拿数据（postMessage），刷新后从 sessionStorage 拿数据。”**

---

# ✅ 总体设计（再次确认逻辑）

|情况|数据来源|说明|
|---|---|---|
|**A. 新标签页第一次打开（带 key）**|来自旧页面：postMessage|页面初次加载，sessionStorage 还没有数据，需要等待旧页面 postMessage|
|**B. 新标签页刷新（带 key）**|来自 sessionStorage|因为旧页面不再 postMessage，所以从 sessionStorage 取|
|**C. 普通标签页（无 key）**|自己初始化数据|主页面不需要跨标签页传参|

---

# 📁 1. 主页面（旧标签页）打开新标签页

```js
// mainPage.vue
openNewTab() {
  const payload = {
    query: this.queryParams,
    time: Date.now(),
  };

  const key = 'tab_' + payload.time;

  const url = `${location.origin}/#/myPage?key=${key}`;

  const newWin = window.open(url, "_blank");

  // 等待新页面建立联系（确保不会“打开太慢导致接收不到消息”）
  const onReady = (e) => {
    if (e.data === `ready:${key}`) {
      newWin.postMessage({
        type: 'initData',
        key,
        payload
      }, "*");

      window.removeEventListener("message", onReady);
    }
  };

  window.addEventListener("message", onReady);
}
```

---

# 📁 2. myPage.vue（同一个 Vue 文件，两个标签页都用它）

## 🧠 核心逻辑

- 判断 URL 是否带 key
    
- 如果不带 key → 主标签页
    
- 如果带 key → 下钻标签页
    
- 下钻标签页：
    
    - 如果 sessionStorage 有 → 页面刷新
        
    - 如果没有 → 第一次加载，向 opener 请求数据，等待 postMessage
        

---

## ✔ 完整代码（可直接复制使用）

```vue
<script>
export default {
  data() {
    return {
      key: null,
      params: null, // 页面真实使用的参数
    }
  },

  mounted() {
    const urlParams = new URLSearchParams(location.hash.split("?")[1]);
    this.key = urlParams.get("key");

    if (!this.key) {
      // 普通标签页处理逻辑
      this.initNormalPage();
      return;
    }

    // 下钻标签页
    this.initDrillPage();
  },

  methods: {
    initNormalPage() {
      console.log("普通标签页");
      this.params = { type: "normal" };
    },

    async initDrillPage() {
      console.log("下钻标签页，key=", this.key);

      // 先尝试从 sessionStorage 读取
      const saved = sessionStorage.getItem(`pageParams_${this.key}`);
      if (saved) {
        console.log("刷新页面，从 sessionStorage 恢复");
        this.params = JSON.parse(saved);
        return;
      }

      // sessionStorage 没数据 → 说明是第一次打开
      console.log("第一次打开，通过 postMessage 请求主页面数据");

      // 向 opener（旧标签页）发送准备就绪信号
      if (window.opener) {
        window.opener.postMessage(`ready:${this.key}`, "*");
      }

      // 等新页面收到数据
      this.waitForPostMessage();
    },

    waitForPostMessage() {
      const handler = (e) => {
        const data = e.data;
        if (data.type === "initData" && data.key === this.key) {
          console.log("收到来自旧页的数据", data.payload);

          this.params = data.payload;

          // 保存到 sessionStorage（用于刷新恢复）
          sessionStorage.setItem(
            `pageParams_${this.key}`,
            JSON.stringify(this.params)
          );

          window.removeEventListener("message", handler);
        }
      };

      window.addEventListener("message", handler);
    }
  }
};
</script>

<template>
  <div>
    <h2>MyPage 页面</h2>
    <pre>{{ params }}</pre>
  </div>
</template>
```

---

# 📌 关键点解释（非常重要）

### **1. 为什么新标签页一定能接到 postMessage？**

因为我们设计了同步机制：

- 新标签页加载后发送：  
    `window.opener.postMessage("ready:xxx")`
    
- 主标签页收到 ready 才发送真正的数据
    

👉 这样无论谁加载快/慢，消息一定成功。

---

### **2. sessionStorage 为什么不会冲突？**

你用了 key 作为区分：

```
/#/myPage?key=tab_123456
```

不同 tab 拥有不同 key，对应存储：

```
sessionStorage["pageParams_tab_123456"]
```

一个标签页刷新不会影响别的标签页。

---

### **3. 刷新后为什么不丢？**

因为逻辑是：

```
如果 sessionStorage 有 → 刷新场景
如果没有 → 第一次加载 → postMessage 获取 → 保存 sessionStorage
```

刷新时不会再依赖主页面。

---

### **4. 什么时候清理 sessionStorage？**

你可以：

- 关闭标签页前清理
    
- 或页面操作完成后清理
    
- 或定期清理老的 key
    

推荐在标签页关闭时清理：

```js
window.addEventListener("beforeunload", () => {
  if (this.key) {
    sessionStorage.removeItem(`pageParams_${this.key}`);
  }
});
```

---

# 🎁 最终你得到的完整方案

- ✔ 适用于 `_blank` 打开新标签页
    
- ✔ 两个标签页用同一个 Vue 文件
    
- ✔ URL 用 key 区分 tab
    
- ✔ 使用 postMessage 实现首次传参
    
- ✔ 使用 sessionStorage 实现刷新恢复
    
- ✔ 稳定、高效、不会掉消息
    
- ✔ 不污染 URL，不依赖后端
    

---

如果你愿意，我还可以帮你：

✅ 把这个方案封装成一个 composable（`useCrossTabParam()`）  
或  
✅ 把这套逻辑做成一个可复用的 Vue 组件

要不要？