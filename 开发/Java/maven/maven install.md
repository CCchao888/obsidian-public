下面我把 **SNAPSHOT vs RELEASE（如 1.0-SNAPSHOT vs 1.0）** 在 **本地 install** 时的行为讲得非常清楚，一次性让你完全理解 Maven 的构件版本机制。

#🧠 ① Maven 会比较源码时间戳，但只用于 **编译、打包是否跳过**

|是否影响 compile|影响|
|---|---|
|✔ 源码时间戳|决定是否需要重新编译|
|✔ target 下已有文件时间戳|决定是否跳过|
|❌ 与 deploy 无关|deploy 不管源码时间戳|

---

#🧠 ② deploy 与源码变化无关！最终是否上传取决于目标仓库规则

|类型|代码没变时 deploy|结果|
|---|---|---|
|SNAPSHOT|会上传|生成新的 timestamp 版本|
|RELEASE|远程已有则拒绝|避免覆盖正式发布|

---

 🧠 ③ install 的行为与 deploy 不同

|行为|install（本地仓库）|deploy（远程仓库）|
|---|---|---|
|SNAPSHOT|覆盖同名 snapshot|生成多个 timestamp|
|RELEASE|覆盖本地 release|远程禁止覆盖|

---

 🎯 一段话总结

> **Maven 会比较源码时间戳，但只用于判断是否重新编译。  
> Deploy 是否触发与源码是否改变无关。  
> SNAPSHOT 总是可以 deploy（产生 timestamp），release 除非版本号变化否则不能重复 deploy。**

---

# ✅ **一、1.0-SNAPSHOT 的 install 会发生什么？**

### **情况 A：没有修改代码，多次 `mvn install`**

行为如下：

|操作|结果|
|---|---|
|`mvn install` 一次|生成一份 snapshot，放进 `~/.m2/repository/.../1.0-SNAPSHOT/`|
|第二次 `mvn install`（代码没有改）|Maven 会比较源码时间戳，发现没有变化 **不会重新打包**（节省时间）|
|本地仓库里的构件|不变（不会产生多个 timestamp）|

🔍 **为什么？**  
本地 install 不会产生 timestamped 版本（`1.0-20250214.123456-1.jar`）。  
只有 deploy 到远程仓库才会生成 timestamp 版本。

本地仓库里的 snapshot 是一个固定文件，比如：

```
my-service-1.0-SNAPSHOT.jar
```

---

### **情况 B：修改了代码，多次 `mvn install`**

行为如下：

|操作|结果|
|---|---|
|每次有代码变化再执行 `mvn install`|重新编译，并覆盖原本的 `my-service-1.0-SNAPSHOT.jar`|
|本地仓库里的构件|永远只有一个 snapshot jar，被覆盖|

👉 **本地 snapshot 始终是“最新的覆盖旧的”。**

---

# ✅ **二、1.0（RELEASE 版本）install 会发生什么？**

### **情况 A：没有修改代码，多次 install**

|操作|结果|
|---|---|
|第一次 install|把 `my-service-1.0.jar` 安装到本地|
|第二次、第三次 install（源代码没变）|Maven 发现无变化 → 不重新打包|
|本地仓库里的构件|不变|

---

### **情况 B：修改了代码，多次 install（不改版本号）**

|操作|结果|
|---|---|
|每次 install 都会覆盖 `my-service-1.0.jar`|本地同样允许覆盖|
|本地仓库里的 jar|永远只有一个（被覆盖）|

⚠️ **注意：这是为什么 release 版本不能随意 install、用 SNAPSHOT 开发的原因。**

在团队开发中：

- RELEASE 应该是不可变的（immutable）
    
- 本地 install 覆盖 release 是危险行为，因为其他模块可能引用它
    

---

# ❗ 关键区别：只有 deploy 才会创建 timestamped SNAPSHOT

|过程|本地 install|远程 deploy|
|---|---|---|
|SNAPSHOT 是否产生多个版本？|❌ 不会（只覆盖）|✅ 会（timestamped 文件）|
|RELEASE 是否允许覆盖？|✔️ 可以（但危险）|❌ 不允许（Nexus 会拒绝覆盖）|

例如部署到 Nexus 时：

```
my-service-1.0-20250302.113322-1.jar
my-service-1.0-20250302.122244-2.jar
```

Maven 依赖解析机制会自动选择 **最新 timestamp**。

---

# 🔥 一句话总结两个版本的 install 行为

## **1.0-SNAPSHOT（开发用）**

- 每次 install → 覆盖旧 snapshot
    
- 本地永远只有一个 snapshot jar
    
- 只在 deploy 时才生成 timestamp 版本
    

## **1.0（release）**

- install 会覆盖本地 release jar
    
- 但部署到远程仓库时禁止覆盖（immutable）
    
- 团队中 release 版本必须改版本号才能发布
    

---

# 🎯 再次强化概念（重要）

## **本地仓库 install = 缓存 + 仅自己使用**

- 覆盖很正常（snapshot、release 都会被覆盖）
    
- 不会生成多个版本
    

## **远程仓库 deploy = 对团队发布**

- snapshot 会生成多个 timestamp 版本
    
- release 不允许覆盖
    

---

如果你愿意，我可以继续帮你把：

✔ Maven 版本（SNAPSHOT, RELEASE, timestamp）  
✔ 本地仓库机制  
✔ 远程仓库（Nexus）机制  
✔ CI/CD 流水线中如何使用 Maven 构件

