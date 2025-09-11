# 1. 仓库配置
## 1.1 settings.xml VS pom.xml

1. **项目POM (`pom.xml`)**:
    
    - **`<repositories>`**: **定义下载源**。声明本项目需要从哪些仓库“拉取”依赖。
        
    - **`<distributionManagement>`**: **定义上传目标**。声明本项目构建的包要“发布”到哪个仓库。
        
2. **全局配置 (`settings.xml`)**:
    
    - **`<mirrors>`**: **定义下载镜像**。它是`<repositories>`的**拦截重定向器**。它将原本发往`<repositories>`中定义的地址的请求，转发到镜像地址（通常为了加速或统一管理）。
        
    - **`<servers>`**: **定义认证信息**。它为`pom.xml`中定义的**任何一个**仓库（无论是下载`<repositories>`还是上传`<distributionManagement>`）提供用户名和密码等“钥匙”。它本身不定义任何仓库地址，只通过`<id>`进行关联。
        

这个机制的设计非常巧妙，实现了**配置的分离**：

- **项目POM**关心的是**“是什么”**（项目的依赖和发布地址是什么）。
    
- **全局Settings**关心的是**“怎么做”**（如何加速下载、如何认证访问）。
    

---

为了让这个流程更加一目了然，下图展示了Maven构建过程中各个配置文件的协作关系：

![[Pasted image 20250912005348.png]]

-----

-   **`pom.xml` 中的 `<distributionManagement>`**：
    -   这个标签**专门**用于配置**发布（deploy）** 制品的位置。
    -   它定义了 `<repository>`（发布正式版）和 `<snapshotRepository>`（发布快照版）的地址。
    -   **目的**：告诉 `mvn deploy` 命令“**把我生成的包上传到哪里去**”。

-   **`pom.xml` 中的 `<repositories>`**：
    -   这个标签用于配置**拉取（download）** 依赖的位置。
    -   **目的**：告诉Maven“**当我要编译时，去哪里下载我需要的依赖包**”。

-   **`settings.xml` 中的配置**：
    -   它主要包含**认证信息**（`<servers>`）和全局镜像（`<mirrors>`）。
    -   它通过 `<server><id>` 来为 `pom.xml` 中定义的仓库（无论是`<distributionManagement>`还是`<repositories>`里定义的）提供用户名和密码。

**工作流程与解决“不同仓库”的问题：**
1.  你执行 `mvn deploy`。
2.  Maven 首先查看项目 `pom.xml` 中的 `<distributionManagement>`，找到目标发布仓库的 `id` (例如 `my-company-repo`) 和 `url`。
3.  Maven 接着去全局或用户的 `settings.xml` 文件中，找到 `<servers>` 里 `<id>` 为 `my-company-repo` 的配置，获取用户名和密码。
4.  最后，Maven 使用这些信息将包认证、上传到指定的 `url`。

**关键点：拉取和发布的仓库可以（并且经常）是不同的！** 这是一种标准做法。通常公司会有一个统一的Nexus/Artifactory，它内部包含多种类型的仓库：

-   **`snapshots` 仓库**：用于存放 `SNAPSHOT` 版本。
-   **`releases` 仓库**：用于存放正式版本（如 `1.0.0`）。
-   **`central` 或 `public` 代理仓库**：用于代理Maven中央仓库和其他公共仓库。

在你的 `pom.xml` 中，配置通常会像这样，指向同一个Nexus服务器的不同路径：
```xml
<!-- 告诉Maven去哪里下载依赖 -->
<repositories>
    <repository>
        <id>company-nexus</id>
        <url>https://nexus.yourcompany.com/repository/maven-public/</url>
    </repository>
</repositories>

<!-- 告诉Maven打包后上传到哪里 -->
<distributionManagement>
    <snapshotRepository>
        <id>company-nexus</id> <!-- 这个id必须与settings.xml中的server id匹配 -->
        <url>https://nexus.yourcompany.com/repository/maven-snapshots/</url>
    </snapshotRepository>
    <repository>
        <id>company-nexus</id>
        <url>https://nexus.yourcompany.com/repository/maven-releases/</url>
    </repository>
</distributionManagement>
```

----

`<servers>` 标签的真正作用

**Q: `<servers>`到底是配置远程仓库还是认证信息？**

**A:** **`<servers>` 标签`只`用于配置认证信息（用户名、密码、私钥等）。**

它的工作原理是 **“通过ID进行关联”**：

1.  首先，你在项目的 `pom.xml` 中的 `<distributionManagement>` 或 `<repositories>` 里定义了一个仓库，并给它一个唯一的 `<id>`，比如 `my-company-repo`，同时指定了它的 `<url>`。
    ```xml
    <distributionManagement>
        <repository>
            <id>my-company-repo</id>
            <url>https://nexus.company.com/repository/maven-releases</url>
        </repository>
    </distributionManagement>
    ```
2.  然后，你在**全局的 `settings.xml`** 文件中，配置一个 `<server>`，它的 `<id>` 必须和上面pom中的 `id` **一模一样**（这里是 `my-company-repo`）。
    ```xml
    <settings>
        <servers>
            <server>
                <id>my-company-repo</id> <!-- 这个ID必须匹配！ -->
                <username>deployment-user</username>
                <password>super-secret-password</password>
            </server>
        </servers>
    </settings>
    ```
3.  当你执行 `mvn deploy` 时，Maven会：
    -   读取pom文件，发现要把包上传到 `id` 为 `my-company-repo` 的仓库，地址是 `https://...`。
    -   去 `settings.xml` 中寻找 `id` 为 `my-company-repo` 的 `<server>` 配置。
    -   使用找到的用户名和密码去登录那个URL对应的仓库，进行认证和上传。

**所以，`<servers>` 不定义仓库，只定义访问仓库的“钥匙”，而“门牌号”是在pom里定义的。** 这种设计实现了安全（密码不进入项目代码）和灵活性（一个账号可以访问多个不同地址的仓库，只要ID匹配）的分离。

## 1.2 标签
### 1.2.1 `settings.xml` 的 `<mirrors>` vs `pom.xml` 的 `<repositories>`

这是一个关于 **“地址重写”** 和 **“地址声明”** 的区别。

1. `<repositories>` (在 `pom.xml` 中)

- **作用**：**声明**本项目**需要从哪些仓库下载依赖**。
    
- **好比**：你的手机通讯录里存了几个朋友的**家庭地址**。你知道想找谁，就去哪个地址找他。
    
- **示例**：你声明了需要从公司Nexus和Spring的官方仓库拉取依赖。

```
    <repositories>
        <repository>
            <id>company-nexus</id>
            <url>https://nexus.mycompany.com/repository/maven-public/</url>
        </repository>
        <repository>
            <id>spring-milestones</id>
            <url>https://repo.spring.io/milestone</url>
        </repository>
    </repositories>
```

2. `<mirrors>` (在 `settings.xml` 中)

- **作用**：**拦截**所有或部分对仓库的请求，并将其**重定向**到另一个镜像仓库（通常是为了加速或统一管理）。
    
- **好比**：你设置了一个**快递代收点**。你告诉快递员：“不管通讯录里写的是哪个地址，所有我的包裹都请直接放到这个代收点。” 你无需修改通讯录本身。
    
- **示例**：著名的阿里云镜像。它拦截了对Maven中央仓库（`central`）的请求，所有下载都去阿里云，速度更快。
    
```
    <settings>
        <mirrors>
            <mirror>
                <id>alimaven</id>
                <name>aliyun maven</name>
                <url>https://maven.aliyun.com/repository/public</url>
                <!-- 这个镜像替代的是所有仓库，也可以用mirrorOf指定替代某个id的仓库 -->
                <mirrorOf>central</mirrorOf> 
            </mirror>
        </mirrors>
    </settings>
```

**核心区别总结：**

| 特性     | `<repositories>` | `<mirrors>`       |
| ------ | ---------------- | ----------------- |
| **位置** | 项目 `pom.xml`     | 全局 `settings.xml` |
| **目的** | **声明**依赖的来源      | **重定向/替换**仓库的请求   |
| **角色** | 定义“原始地址”         | 定义“代理地址”          |
| **粒度** | 可声明多个特定仓库        | 可镜像一个、多个或所有仓库     |

**执行顺序**：当Maven需要下载一个依赖时，它会：

1. 查看 `pom.xml` 中的 `<repositories>`，确定应该去哪个原始URL找。
    
2. 检查 `settings.xml` 中的 `<mirrors>` 规则，看这个原始URL的请求是否被某个镜像替代。
    
3. 最终向**镜像的URL**（如果匹配）或**原始的URL**（如果不匹配）发起请求。
    

---

### 1.2.2 `<distributionManagement>` vs `<repositories>`

- **`<repositories>`**： **下载** -> **“我从哪里`拉取`依赖”**
    
    - 配置的是本项目作为**消费者**时，去哪里获取别人发布的jar包。
        
- **`<distributionManagement>`**： **上传** -> **“我把我的包`部署`到哪里”**
    
    - 配置的是本项目作为**生产者**时，把自己生成的jar包发布到哪个仓库供别人使用。
        

它们通常指向同一个Nexus服务器的不同路径（如 `maven-public` vs `maven-releases`），但职责截然相反。


---

# 其他

### 关于之前的命令

**Q: 刚刚那个命令并没有发布jar包吧，只推送了docker镜像到远程？**

**A:** 你的观察非常准确！**是的，你提供的命令序列只完成了“Docker镜像的发布和部署”，但缺少了“Maven Jar包的发布”。**

这是一个非常重要的区别。完整的流程应该是：

1.  **发布Jar包到Maven仓库** (`mvn deploy`)： 这样**其他Java服务**在编译时才能依赖你这个服务的最新代码。
2.  **构建和推送Docker镜像** (`docker buildx build --push ...`)： 这样**Kubernetes**才能拉取镜像来运行你的服务。

你提供的命令 `mvn clean package` 只会把包打到你本地的 `target/` 目录，用于后续的Docker构建，但**并没有执行 `deploy` 阶段将其上传到Nexus**。

一个更完整的手动命令序列应该是：
```bash
# 1. 编译、测试、并将Jar包发布到Nexus (供其他服务依赖)
mvn clean deploy -DskipTests=true --settings .github/settings.xml

# 2. 使用刚打好的Jar包构建Docker镜像，并推送到镜像仓库 (供K8s运行)
docker buildx build --platform linux/amd64 --push -t your-registry.com/your-service:dev -f ./Dockerfile .

# 3. 重启K8s服务，让其拉取新镜像
kubectl rollout restart deployment/your-service -n your-namespace
```

---

### Jenkins 是什么？

**Q: Jenkins是什么？**

**A:** **Jenkins是一个开源的、可扩展的自动化服务器。** 它是CI/CD（持续集成/持续部署）领域的“老大哥”和最著名的工具之一。

你可以把它想象成一个**不知疲倦、全能的机器人助理**：

-   **它的核心工作**：**自动化的执行任务**。这些任务就是你刚才手动输入的那些命令（`mvn clean deploy`, `docker build`, `kubectl rollout` 等）。
-   **它如何被触发**：可以由事件触发，比如：
    -   Git代码推送（git push）
    -   定时任务（例如每天凌晨2点构建）
    -   手动点击按钮
-   **它的能力**：
    -   **持续集成 (CI)**：自动拉取代码、编译、运行测试、发布包。
    -   **持续部署 (CD)**：自动将应用部署到测试、预生产、生产环境。
    -   **非常强大的插件生态**：有数以千计的插件来集成各种工具（Maven, Docker, Kubernetes, Jira, Email等）。

**简单来说，Jenkins就是为了把你之前在小公司手动执行的那一系列命令，变成一套全自动、可重复、可追溯的流水线。** 你定义好流程（通过Jenkins的Web界面或编写`Jenkinsfile`），它来负责可靠地执行。


非常好，这些问题都是深入使用Maven和CI/CD时必然会遇到的核心概念。我们来彻底讲清楚。

---
