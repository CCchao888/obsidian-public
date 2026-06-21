


## 1. 为什么要区分 `dependencies` 和 `devDependencies`

- **dependencies**：项目 **运行时** 必须的依赖（线上要用的）  
    比如：
    
    - `express`（后端框架，项目启动时必须有）
        
    - `react`（前端运行时必须有）
        
- **devDependencies**：项目 **开发/构建时** 用到的依赖（线上不需要）  
    比如：
    
    - `eslint`（代码检查工具）
        
    - `webpack`、`vite`（打包工具）
        
    - `jest`（测试框架）
        

👉 为什么要分？

- 线上部署时，很多公司会执行 `npm install --production`，这样只装 `dependencies`，不装 `devDependencies`，节省体积，避免把无关的开发工具放到生产服务器。
    
- 如果全混在一起，线上就会下载一堆没必要的包，增加部署时间和风险。
    

所以本质原因：**为了区分线上运行必需 vs 开发时工具**。

---

## 2. `npm install` 会不会每次都更新 `package-lock.json`？

- 情况分两种：
    

### ✅ 不更新

- 你执行 `npm install`，没有改动 `package.json`，`package-lock.json` 也没变化 → 不会更新。
    
- 因为它会直接安装 `package-lock.json` 里锁定的版本。
    

### ⚠️ 会更新

- 你新增依赖：`npm install lodash` → `package.json` & `package-lock.json` 都更新。
    
- 你删除依赖：`npm uninstall lodash` → 两个文件也都会更新。
    
- 如果你手动改了 `package.json` 的版本号范围，比如 `"express": "^4.17.1"` 改成 `"express": "^4.18.0"`，再 `npm install` → lock 文件也会更新。
    

👉 所以并不是“每次 install 都更新”，而是“依赖树发生变化时才更新”。

---

## ~~3. npm 安装依赖的优先级~~

~~执行 `npm install` 时流程是这样的：~~

1. ~~**先看 `package-lock.json` 有没有**~~
    
    - ~~有 → 按照里面的精确版本装（保证一致性）~~
        
    - ~~没有 → 按 `package.json` 的版本范围装，然后生成新的 lock 文件~~
        
2. ~~如果 `package.json` 改了（比如版本号范围不同），但 lock 文件还在 →~~
    
    - ~~npm 默认会用 lock 里的精确版本，而不是重新解析 `package.json`。~~
        
    - ~~除非你 `npm update` 或 `rm -rf node_modules && npm install`，才会把 lock 更新到新版本。~~
        

~~👉 所以只要 `package-lock.json` 在，依赖不会乱跳。~~

---

## 4. 全局模块放哪儿？

- **默认情况**：
    
    - 如果你用系统安装的 Node（非 nvm），全局模块会放在 Node 的安装目录：
        
        - Linux/macOS: `/usr/local/lib/node_modules`
            
        - Windows: `C:\Users\<你的用户名>\AppData\Roaming\npm\node_modules`
            
    - 同时会有一个可执行文件目录（bin），比如：
        
        - Linux/macOS: `/usr/local/bin`
            
        - Windows: `C:\Users\<你的用户名>\AppData\Roaming\npm`
            
- **用 nvm 时**：
    
    - 每个 Node 版本的全局模块安装在：
        
        ```
        ~/.nvm/versions/node/vXX.X.X/lib/node_modules
        ```
        
    - 可执行文件在：
        
        ```
        ~/.nvm/versions/node/vXX.X.X/bin
        ```
        

---

## 5. 需要配置环境变量吗？

- **一般情况下**：不需要，你用官方安装包 / nvm 安装，环境变量都会自动设置好。
    
- 但有些情况需要你自己配置：
    
    - 如果你改了 npm 的 `prefix`（全局安装路径）
        
    - 或者你希望把全局依赖装到一个自定义目录
        

### 配置方式：

- 在 `.npmrc` 里指定：
    
    `prefix=/Users/you/.node_global cache=/Users/you/.node_cache`
    
- 然后把 `prefix/bin` 加到 PATH：
    
    `export PATH=$HOME/.node_global/bin:$PATH`
    
- 这样全局安装的命令行工具（比如 `eslint`, `tsc`）就能直接运行。
    

---

## 6. 总结要点

- `dependencies` = 项目运行必须，`devDependencies` = 只开发时用。
    
- `npm install` 并不是每次都改 lock 文件，只有依赖树变化才会。
    
- npm 先看 `package-lock.json`，有的话优先用它保证一致。
    
- 全局模块位置取决于 Node 安装方式（系统装 vs nvm）。
    
- 全局模块要想自定义路径，可以用 `.npmrc` 配置 + PATH 环境变量。