理解，如果你们的流水线暂时**没有自动改版本号**，那就回到你的场景：

- 微服务很多
    
- 手动改版本号风险高
    
- 多人协作容易冲突
    
- 临近上线要改成 RELEASE，怕时间不够或改错
    
- 希望尽量不改 POM 或减少改动成本
    

接下来我给你 **3 种“代码内可控、风险最小、不依赖流水线”的方案**，都是在大厂（含金融 IT）经常用的。

---

# ✅ 方案 1：**使用 Maven Versions Plugin 自动改版本号（本地改，不手写）**

适合你们当前情况，最简单可落地。

你不手改，只运行命令：

## 👉 开发阶段

开发阶段永远保持：

```
1.3.0-SNAPSHOT
```

## 👉 发布前（例如进入 UAT 或上线前）

在根目录执行：

```sh
mvn versions:set -DnewVersion=1.3.0
```

它会自动修改所有 module 的 pom.xml  
（适合微服务 + 多 Module 项目，**不需要一个一个改**）

### 然后 commit 一次就行。

## 👉 发布后（下一版本的开发开始）

执行：

```sh
mvn versions:set -DnewVersion=1.3.1-SNAPSHOT
```

### 优点

✔ **无需手改 POM**  
✔ **不会漏改**（所有微服务都一起改）  
✔ **不会改错**（自动生成）  
✔ **一次性全项目统一修改版本号**  
✔ 任何人都能无脑操作  
✔ 风险远低于手改几十个微服务的版本号

### 缺点

需要 commit 一次（不可避免）

---

# ✅ 方案 2：**使用 Maven 父 POM（revision 统一管理）**

如果多个微服务共享父 POM 或 BOM，你可以这样做：

在父 POM 写：

```xml
<properties>
    <revision>1.3.0-SNAPSHOT</revision>
</properties>

<version>${revision}</version>
```

其他子 POM 曰：

```xml
<parent>
   <version>${revision}</version>
</parent>
```

### 发布前你只改 **父 POM 一处**，所有服务自动跟随。

### 优点

✔ 所以微服务 **不用一个一个改**  
✔ 避免 20 个项目重复做事  
✔ 改一次就完事  
✔ 无需脚本  
✔ 通常是大厂推荐做法

### 缺点

需要所有项目结构统一，使用父/子结构  
（如果你们微服务完全拆开、各项目独立，此方法不适用）

---

# ✅ 方案 3：使用 “双版本号” —— POM 永远写 SNAPSHOT，RELEASE 从外部传入

你在 POM 固定写：

```xml
<version>1.3.0-SNAPSHOT</version>
```

发布时运行：

```sh
mvn clean package -DreleaseVersion=1.3.0
```

然后在 `pom.xml` 中 version 写成：

```xml
<version>${project.version}</version>
```

并在 `maven-jar-plugin` 中注入 manifest：

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-jar-plugin</artifactId>
      <configuration>
        <archive>
          <manifestEntries>
            <Implementation-Version>${releaseVersion}</Implementation-Version>
          </manifestEntries>
        </archive>
      </configuration>
    </plugin>
  </plugins>
</build>
```

构建出的 JAR 会带 releaseVersion（比如“1.3.0”），  
但 **源码中的版本号始终是 SNAPSHOT，不变。**

### 优点

✔ 代码不改  
✔ SNAPSHOT/RELEASE 全靠构建参数  
✔ 不怕改错 POM  
✔ 不涉及流水线（本地也能构建）

### 缺点

CI 要统一传同样的参数  
得团队风格统一

---

# ⭐ 最推荐你当前的状态用的方案（不需要改流水线）

# 👉 **方案 1（Versions Plugin 自动改） + 父 POM（统一管理）**

这是现实中最少工作量、最少出错、最容易落地的。

---

# 🧠 给你一个实际的团队操作流程（适合你们）

### **平常开发（永远是 snapshot）**

保持：

```
1.4.0-SNAPSHOT
```

### **发布上线前**

执行一次：

```
mvn versions:set -DnewVersion=1.4.0
```

commit

### **上线后**

执行一次：

```
mvn versions:set -DnewVersion=1.5.0-SNAPSHOT
```

commit

**全项目几十个服务几千行 POM 一次性改好，不需要人工修改。**

---

# 📌 如果你愿意，我还能帮你做两件事

1. **为你的团队写一个“版本号管理规范.md”**
    
    - 如何使用 Maven versions 插件
        
    - 如何升 snapshot 版本
        
    - 如何标记 release 版本
        
    - commit 如何写
        
    - 防止错版本号检查脚本
        
2. **给你生成一个“自动升版本号脚本（Win + Linux 可用）”**  
    你输入：
    
    ```
    ./release.sh 1.4.0
    ```
    
    自动帮你：
    
    - set newVersion
        
    - 构建打包
        
    - 打 tag
        
    - revert 或升 snapshot
        

你需要其中哪一个？