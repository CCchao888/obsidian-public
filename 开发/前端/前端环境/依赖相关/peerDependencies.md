

### 1. `peerDependencies` 的设计初衷

- **普通依赖 (`dependencies`)**  
    👉 直接装进你的项目里，`npm install` 就会下载到 `node_modules`。
    
- **同伴依赖 (`peerDependencies`)**  
    👉 不是给库自己用的，而是要求 **使用这个库的项目（宿主项目）** 提前安装好指定版本的某个依赖。
    

📌 例子：  
假设你写了一个 `vue-plugin` 插件，里面代码依赖 `vue`。

- 你不应该把 `vue` 放在 `dependencies`，否则别人安装你插件时，可能会装两个 `vue`（一个你的，一个他们自己的）。
    
- 正确做法是：
    
    ```json
    {
      "peerDependencies": {
        "vue": "^3.0.0"
      }
    }
    ```
    
    这样别人用你的插件时，必须在他们的项目里自己安装 `vue@^3.0.0`。
    

---

### 2. `npm install` 的行为

- 默认不会自动安装 `peerDependencies`（npm v3～v6 都是这样的）。
    
- 从 **npm v7 开始**，会尝试自动安装 `peerDependencies`，但如果版本冲突，仍然需要手动解决。
    

所以你现在看到 **`peer dependency ... missing` 或 `invalid` 报错**，就是因为：

- 你的依赖 A 声明了一个 `peerDependencies`（比如 `react@^18`），
    
- 但你的项目里没装或者版本不对，
    
- 所以运行时报错。
    

---

### 3. 为什么你要自己手动安装

因为你的项目是 **使用方**：

- 你引入了某个三方库，它里面有 `peerDependencies`。
    
- npm 不会默认帮你装（除非是 npm7+ 且没冲突）。
    
- 所以你要 **手动安装**，保证版本匹配。
    

📌 例子：  
项目里装了 `antd`，它 `peerDependencies` 里要求：

```json
"peerDependencies": {
  "react": ">=16.9.0",
  "react-dom": ">=16.9.0"
}
```

如果你没装 `react`，就会报错。你就得：

```bash
npm install react react-dom
```

---

### 4. `package.json` 和 `peerDependencies` 的关系

- 你的项目 `package.json` 里 **不会自动出现别的库的 peerDependencies**。
    
- 必须你手动写进去（通过 `npm install` 装好后），才能保证你的项目依赖完整。
    

---

✅ 总结：

- `dependencies`：我自己用，安装时就带上。
    
- `peerDependencies`：使用我的人要装，我只声明要求。
    
- `npm install`：不会帮你自动装 `peerDependencies`（npm7 除外，但有冲突还是要自己装）。
    
- 你的项目作为“使用方”，要根据报错手动安装 `peerDependencies`。
    

---

要不要我帮你写一个**排查 `peerDependencies` 缺失的实用命令/步骤**，这样你就能一键检查哪些要手动装？