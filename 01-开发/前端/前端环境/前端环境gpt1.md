


## 🧩 一、几个核心概念和关系

1. **Node.js（node）**
    
    - 是一个 **运行环境**，让你在浏览器之外（比如服务器、本地命令行）运行 JavaScript。
        
    - 安装 Node.js 后，会自带 **npm**。
        
2. **npm**
    
    - Node.js 自带的包管理器（Node Package Manager）。
        
    - 用来下载、安装、管理 JS 库（包）。
        
    - npm 既是一个命令行工具，也是一个**远程仓库（registry）**。
        
    - 类似于 Python 的 `pip`。
        
3. **yarn**
    
    - Facebook 出的另一个包管理器（npm 的竞争对手）。
        
    - 功能和 npm 类似，也用来安装依赖，速度快、锁文件稳定。
        
    - 不会自动安装，得你自己装。
        
4. **nvm**
    
    - Node Version Manager（Node 版本管理器）。
        
    - 用来管理多个 Node.js 版本，随时切换。
        
    - **切 Node 版本 = 换 Node + npm**（因为 npm 跟随 Node 版本自带）。
        

---

## 🔗 二、关系图

```
                nvm
                 │
   ┌─────────────┴─────────────┐
  node v16                     node v18
    │                            │
    └── 自带 npm (v8.x)           └── 自带 npm (v9.x)

  （你用 nvm 切换 node，npm 也跟着切换）
  
  yarn 是单独装的，依赖 node 运行
```

---

## 🛠️ 三、安装方式 & 环境变量

#### 1. 安装 Node.js

- 两种方式：
    
    - 直接官网安装包（固定一个版本）
        
    - 用 **nvm** 安装（推荐，能随时切换）
        
- 安装好 Node，就会自动有一个 **npm**。
    

#### 2. 安装 nvm

- Windows/macOS/Linux 都有 nvm 工具。
    
- nvm 安装后，就可以：
    
    ```bash
    nvm install 18   ## 装 Node.js v18
    nvm use 18       ## 切到 v18
    ```
    
- 切 Node 版本时，npm 也会跟着换。
    

#### 3. 安装 yarn

- 需要 node 环境支持。
    
- 装法：
    
    ```bash
    npm install -g yarn
    ```
    
- 装完就有 `yarn` 命令了，独立于 npm。
    

---

## 📦 四、依赖安装去哪了？

当你在一个前端项目里执行 `npm install` / `yarn install` 时：

1. **项目依赖** → 安装到当前项目目录的 `node_modules/`
    
    - 例如：
        
        ```
        my-project/
          node_modules/
            react/
            lodash/
          package.json
          package-lock.json
        ```
        
    - 所以项目依赖是“局部的”。
        
2. **全局依赖（-g）**
    
    - 用 `npm install -g xxx` 安装的模块，存放在一个全局目录下。
        
    - 位置由 **npm config prefix** 决定。
        
    - 比如：
        
        - Windows: `C:\Users\你\AppData\Roaming\npm\node_modules`
            
        - mac/Linux: `~/.nvm/versions/node/v18.x/lib/node_modules`
            
3. **缓存**
    
    - npm/yarn 下载的包，不是每次都去远程仓库，而是先放到本地缓存目录。
        
    - 目录由 **npm config cache** 决定。
        
    - 下次再装同样的包，就直接从缓存拿，提高速度。
        

---

## ⚙️ 五、npm config 配置项

执行 `npm config list -l` 会看到很多配置，几个核心的：

1. **registry**
    
    - 包的下载源（默认是 `https://registry.npmjs.org/`）
        
    - 国内常改成淘宝镜像：
        
        ```bash
        npm config set registry https://registry.npmmirror.com
        ```
        
2. **prefix**
    
    - 全局安装的目录。
        
    - `npm install -g` 就把包装到 `prefix/lib/node_modules` 下，并在 `prefix/bin` 建立命令。
        
3. **cache**
    
    - 缓存目录（下载下来的 tarball 压缩包、解压内容）。
        
    - 下次装同版本，就直接从缓存拷贝，不用再联网。
        
4. **其他常见项**
    
    - `init-author-name` / `init-license` → 默认生成 package.json 的信息
        
    - `save-exact` → 安装依赖时是否固定版本号
        

---

## 🔄 六、关键问答

**Q1: nvm 切换 Node 版本时，npm 会变化吗？**  
👉 会。因为 npm 是随 Node.js 一起发布的，切到不同 Node，npm 版本也会跟着换。  
如果想固定 npm 版本，可以自己升级/降级：

```bash
npm install -g npm@8
```

---

**Q2: 安装其中一个会影响其他吗？**

- 安装 Node → 自动有 npm
    
- 安装 nvm → 不会影响 npm，但会帮你安装/切 Node + npm
    
- 安装 yarn → 独立的，不会影响 npm
    

---

**Q3: 项目里 `npm i` 到底安装到哪里？**  
👉 安装到项目的 `node_modules/` 下（局部），并记录在 `package-lock.json`。  
除非加 `-g`，才会装到全局。

---

**Q4: node_global / node_cache 是什么？**

- `node_global`：npm 全局安装路径（prefix）
    
- `node_cache`：npm 缓存路径（cache）  
    很多公司文档里让你配置：
    

```bash
npm config set prefix "C:\node_global"
npm config set cache "C:\node_cache"
```

是为了避免权限问题，把全局目录放到你自己用户空间。

---

## 🧭 七、总结一句话

- **Node.js**：运行环境
    
- **npm**：Node 自带的包管理器
    
- **yarn**：npm 的替代品（要自己装）
    
- **nvm**：管理 Node 版本的工具，切 Node 时 npm 一起切
    
- **npm i**：默认装到项目的 `node_modules/`（局部依赖）
    
- **npm -g**：装到 prefix 指定的全局目录
    
- **npm config**：npm 的配置系统（registry 下载源、cache 缓存目录、prefix 全局目录）
    



# 