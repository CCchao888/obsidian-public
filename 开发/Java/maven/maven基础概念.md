### 1. SNAPSHOT 版本 vs Release 版本

这是Maven版本管理的基石，理解它们之间的区别至关重要。

| 特性          | **SNAPSHOT (快照) 版本**                                                                                  | **Release (发布) 版本**                                                           |
| :---------- | :---------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **含义**      | 代表**正在活跃开发中、不稳定的**版本。                                                                                 | 代表一个**稳定、不可变的**发布版本。                                                          |
| **版本号**     | 以 `-SNAPSHOT` 结尾，例如 `1.0.0-SNAPSHOT`, `2.1.0-SNAPSHOT`。                                               | 纯数字或带有其他后缀（但不含`SNAPSHOT`），例如 `1.0.0`, `2.1.0-RELEASE`。                        |
| **可变性**     | **可变的**。你今天部署的 `1.0.0-SNAPSHOT` 和明天部署的 `1.0.0-SNAPSHOT` 可以是完全不同的代码。                                   | **不可变的**。一旦 `1.0.0` 被发布到Release仓库，你就永远不能修改它。如果你修复了一个bug，必须发布一个新版本，例如 `1.0.1`。 |
| **Maven行为** | 当依赖SNAPSHOT版本时，Maven 对 SNAPSHOT 版本默认会按更新策略（如 daily）定期检查是否有新版本。如果使用 `-U` 参数，Maven 将强制获取最新的 SNAPSHOT 包。 | 当依赖Release版本时，Maven一旦在本地仓库下载了该版本，就**永远不会**再去远程仓库检查更新，除非你手动删除本地缓存。             |
| **使用场景**    | **开发阶段、测试环境**。用于团队内部协作，让其他开发者能方便地获取你最新的代码进行联调。                                                        | **生产环境、正式发布**。保证生产环境的稳定性和可追溯性。`任何一个Release版本都应该对应一个特定的Git Tag。`               |

**简单比喻：**
-   **SNAPSHOT** 就像一本正在写的书的**草稿**，作者每天都在修改，你可以随时看到最新的草稿内容。
-   **Release** 就像这本书的**正式印刷版**（第一版、第二版），一旦印刷就无法更改。如果需要修改，必须出修订版（新版本）。

### **Maven 对 SNAPSHOT 的处理机制**

Maven 会尝试从远程仓库获取最新的 SNAPSHOT 版本，但是是否检查更新 **取决于本地缓存策略**：

|Maven 行为|说明|
|---|---|
|**默认情况下（没有参数配置时）**|Maven 会根据 `updatePolicy` 策略决定是否检查更新，默认是 **每天检查一次 (daily)**|
|**使用 `-U` 参数（force update）**|强制更新所有 SNAPSHOT 依赖，**立即从远程再次下载最新包**|
|**本地已有缓存且未到更新策略时间**|Maven **不会反复立即更新**，会使用本地现有 SNAPSHOT|

```
<repository>
  <id>snapshots</id>
  <url>https://repo.maven.apache.org/maven2</url>
  <releases><enabled>false</enabled></releases>
  <snapshots>
    <enabled>true</enabled>
    <updatePolicy>daily</updatePolicy> <!-- 默认 daily -->
  </snapshots>
</repository>

```
`updatePolicy` 选项：**只对 Maven 从该仓库“下载依赖（resolve dependencies）”时生效**。  它们不控制上传行为（deploy/upload）**。

| 值             | 含义          |
| ------------- | ----------- |
| `always`      | 每次构建都检查更新   |
| `daily`       | 每天检查一次（默认）  |
| `interval:10` | 每 10 分钟检查一次 |
| `never`       | 永不检查更新      |

**运行项目实际上使用的都是本地仓库的 jar。**  
**强制更新、更新策略都是检查远程仓库 → 再更新本地仓库。**
运行只依赖本地仓库，本地仓库是否需要更新由 updatePolicy 及强制更新控制。

无论在哪个环境，Java 应用运行都不会直接用远程仓库依赖。运行永远依赖本地缓存的 jar。
- 即便是流水线，流水线服务器也有自己的缓存（本地仓库）
- 远程仓库（Nexus / Artifactory）和流水线服务器（CI 机器）是完全独立的
	- 远程仓库 = 公司 Nexus（整个公司的中央依赖库）
	- 流水线服务器 = Jenkins / GitLab CI / 公司自研流水线的构建机



---

# ✅ 一、Classpath 不是本地仓库目录

你问：

> “classpath 本身就是一个路径，让运行时能从本地仓库找到对应的jar？？"

**不是的。**

这是最容易搞混的地方。

---

## ❌ 错误理解（很多人这样误会）

classpath 指向本地仓库路径：

```
~/.m2/repository/
```

然后 JVM 会自己遍历目录去找 jar。

🚫 **这是错误的。JVM 根本不会这样做。**

---

## ✔ 正确理解 — classpath 是“具体的 jar 文件路径列表”

比如一个 Spring Boot 启动时的 classpath 会像这样（示意）：

```
-classpath
/home/user/.m2/repository/org/springframework/spring-core/6.1.3/spring-core-6.1.3.jar:
/home/user/.m2/repository/com/fasterxml/jackson/core/jackson-databind/2.17.0/jackson-databind-2.17.0.jar:
/home/user/.m2/repository/org/apache/commons/commons-lang3/3.14.0/commons-lang3-3.14.0.jar:
/project/target/classes
```

注意：

### ✔ JVM 只知道具体的 jar 绝对路径

不是 repo 的目录。

---

## 🔍 那么 Maven 怎么确定这些路径？

流程是：

1. Maven 解析 `pom.xml` 的依赖
    
2. 去本地仓库找对应的 jar
    
3. 将这些 jar 的绝对路径拼成一个长长的 classpath 字符串
    
4. 注入 JVM 启动参数启动你的 Spring Boot 应用
    

所以：

> JVM 不会“从本地仓库查找 jar”，JVM 只会加载 Maven 给它的精确路径。

---

# 📌 小总结（一定要记住）

### ✔ 本地仓库是 Maven 的缓存

### ✔ classpath 是 JVM 的加载路径

### ✔ Maven 会根据依赖从本地仓库查找对应 jar

### ✔ 然后把 jar 的绝对路径写入 JVM 的 classpath 参数里

### ✔ JVM 根本不认识本地仓库，它只认识具体的 jar 路径

这就是 “Maven 使用本地仓库，但 classpath 不是整个repo” 的含义。

---

# ✅ 二、`mvn spring-boot:run` 的编译过程 vs `mvn compile`

你的理解很接近了，这里给你完全清晰化。

---

## ✔ `mvn compile` 只做一件事：

```
编译 Java 源码 → target/classes
```

不会运行应用，也不会监听文件变化。

---

## ✔ `mvn spring-boot:run` 会做很多事情：

### 第一步：检查源码是否需要编译

它会自动执行 compile：

```
mvn compile
```

### 第二步：解析依赖、准备 classpath

它会构造一个完整 classpath，包括：

- target/classes
    
- target/test-classes
    
- 所有依赖的 jar 路径
    

### 第三步：启动 Spring Boot 应用

它内部相当于执行：

```
java -classpath [一大串 jar 路径]  org.springframework.boot.loader.JarLauncher
```

### 第四步：文件变更时自动重新编译（可选）

如果你安装了 spring-boot-devtools，它还能自动重启应用。

---

## 📌 用一句话解释它们的关系：

> `spring-boot:run` = compile + 解析依赖 + 启动应用（开发模式）

> `mvn compile` = 单纯编译，不运行

---

# 📌 完整总结

### ✔ classpath 是 JVM 启动时的精确 jar 路径列表

不是本地仓库目录。

### ✔ Maven 从本地仓库找到需要的 jar

然后把 jar 的绝对路径加入 classpath。

### ✔ `spring-boot:run` 的编译过程 ≈ `mvn compile`

但它还包含：

- 依赖解析
    
- 启动应用
    
- 自动重启（带 devtools）
    
- 构造 classpath
    

是更完整的开发运行命令。

---

如果你愿意，我可以继续帮你：

📌 画出“本地仓库 → Maven → classpath → JVM 程序运行”的完整流程图  
📌 讲解“为什么 IntelliJ IDEA 能运行项目但不需要 Maven classpath”  
📌 继续深入讲解 snapshot 解析的内部机制（非常有用）

你想继续深入哪个部分？



下面我把你问的两个点 **讲到最透彻、最精确的程度**：

---

# ✅ **① 什么叫 “仓库里会保留 timestamped build”？为什么 Maven 总是指向最新的？**

先看一个 SNAPSHOT 在 Nexus/Artifactory 中**真实存在的样子**。

## 当你 deploy `1.4.0-SNAPSHOT` 时，仓库里其实会生成：

### **1）一个可变的最新版本：**

```
1.4.0-SNAPSHOT.jar
1.4.0-SNAPSHOT.pom
maven-metadata.xml
```

这是 Maven 指向的主版本，它会被**覆盖**。

---

### **2）多个带时间戳的“不可变快照”版本：**

比如：

```
1.4.0-20250102.152030-1.jar
1.4.0-20250103.090010-2.jar
1.4.0-20250104.191542-3.jar
```

编号 -1、-2、-3 表示不同的构建。

这些是**仓库内部历史版本保存机制**，不是给项目直接依赖的。

---

# ⭐ Maven 为什么永远指向最新？

因为依赖里写的是：

```
1.4.0-SNAPSHOT
```

Maven 会按照仓库里最新的 `maven-metadata.xml` 去解析最新的时间戳版本：

例如 metadata：

```xml
<snapshot>
    <timestamp>20250104.191542</timestamp>
    <buildNumber>3</buildNumber>
</snapshot>
```

意思是：

- SNAPSHOT 对应时间戳 `20250104.191542`
    
- 最新构建号是 3
    

所以 Maven 实际会下载：

```
1.4.0-20250104.191542-3.jar
```

即 **最新的时间戳版本**。

---

# ⚠️ 重点：

- 仓库里保留多个 timestamped 版本（为了存档）
    
- 但 Maven 依赖永远指向最新构建
    
- 因为 SNAPSHOT 的本质就是“永远取最新”
    

---

# 🟦 **② updatePolicy（daily、always）检查的是哪个仓库？**

这是你问的最关键的点，我给你讲透：

---

# ⭐ updatePolicy **检查的是“远程仓库是否有新版本”**

✔ **不是检查你本地仓库**

✔ **也不是检查你本地私服上的“本地镜像仓库”**

✔ **是 Maven 检查“我依赖的远程仓库”是否有更新**

从 Maven 视角：

- **远程仓库 = 你在 settings.xml 中配置的 mirror（Nexus/Artifactory）**
    
- **本地仓库 = `~/.m2/repository`（缓存）**
    

---

# ▶ 示例

你本地 settings.xml:

```xml
<mirrors>
  <mirror>
    <id>internal-nexus</id>
    <url>http://nexus.xxx.com/repository/maven-public/</url>
    <mirrorOf>*</mirrorOf>
  </mirror>
</mirrors>
```

Maven 下载依赖时会：

1. 看本地 `~/.m2/repository` 是否已有缓存
    
2. 如果缓存过期（updatePolicy 规则触发）  
    → **去远程 Nexus（真正意义上的远程仓库）检查最新版本**
    

---

# 🟥 **因此，updatePolicy= daily 的逻辑是：**

每天第一次构建时：

- Maven 发现缓存过期（超过 24 小时）
    
- 于是向远程仓库（Nexus）发 HTTP 请求：
    
    ```
    GET .../1.4.0-SNAPSHOT/maven-metadata.xml
    ```
    
- 如果 metadata 里有新 timestamp  
    → Maven 下载最新 SNAPSHOT
    

如果 metadata 没变化  
→ Maven 使用本地缓存，不下载

---

# ⭐ **所以 updatePolicy 并不是检查你的本地私仓，而是检查 Maven 配置的“远程仓库”。**

---

# 🟩 **总结**

## ① “仓库里保留时间戳版本” =

仓库会保存历史构建（带时间戳的版本），但 Maven 永远依赖最新的那个。

## ② Maven 的 updatePolicy（daily/always）检查的是：

✔ 远程仓库（一般是 Nexus/Artifactory）  
✔ 不检查你本地仓库  
✔ 不检查你本地的 IDEA/项目目录

## ③ 本地跑微服务时，daily 的逻辑是：

- 每天第一次构建时检查远程 Nexus 是否有新 SNAPSHOT
    
- 如果有 → 下载
    
- 如果没有 → 使用本地缓存
    
- 当天后面的构建都使用缓存，不再检查远程
    

---

# 如果你愿意，我可以帮你画：

- SNAPSHOT 依赖流程图（构建 → 部署 → 下载 → 缓存）
    
- updatePolicy 的完整行为图
    
- 私服（Nexus）和本地 Maven 行为的内部机制图
    

这样整个概念体系会一秒通透。