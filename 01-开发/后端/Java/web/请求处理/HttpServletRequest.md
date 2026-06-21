
好的，这是一个非常核心且常见的问题，我们来详细拆解一下。

### 第一部分：场景分析与 HttpServletRequest 基础

首先，我们来回答你的两个场景。

- **场景一：前端压根不传查询参数**
    - 后端通过 `request.getParameter("name")` 获取到的值是 **`null`**。
    - 原因：在 `HttpServletRequest` 的参数映射表（一个类似 Map 的结构）中，根本不存在名为 `"name"` 的键。

- **场景二：前端传 `?name=`**
    - 后端通过 `request.getParameter("name")` 获取到的值是 **空字符串 `""`**。
    - 原因：参数映射表中存在名为 `"name"` 的键，但其对应的值为空。

**核心结论：** 你的理解是完全正确的。HTTP 请求参数在 `HttpServletRequest` 中被封装成**键值对**的集合。`getParameter("key")` 方法就是根据键去查找对应的值。键不存在返回 `null`，键存在但值为空则返回 `""`。


### 深入讲解 HttpServletRequest

`HttpServletRequest` 是 Java Servlet 规范中定义的一个接口，它代表了客户端的 HTTP 请求。任何基于 Java 的 Web 框架（如 Spring MVC, Spring Boot, JAX-RS, Struts 等）底层都构建在 Servlet 容器（如 Tomcat, Jetty）之上，因此它们都能获取到 `HttpServletRequest` 对象。框架提供的便捷功能（如 `@RequestParam`, `@RequestBody`）最终也是通过这个对象来获取数据的。

**HTTP 协议是基于文本的协议，所有通过 HTTP 传输的数据在网络上都是字节流，可以被理解为字符串。**

一个 HTTP 请求被 Servlet 容器接收后，会被解析并封装成一个 `HttpServletRequest` 对象。这个对象包含以下部分：

#### 1. 请求行信息
- **请求方法：** `GET`, `POST`, `PUT`, `DELETE` 等。通过 `request.getMethod()` 获取。
- **请求 URL：** 包括协议、服务器名、端口、路径等。通过 `request.getRequestURL()` 等方法获取。
- **查询字符串：** URL 中 `?` 后面的部分，例如 `name=zhangsan&age=20`。通过 `request.getQueryString()` 获取。

#### 2. 请求头
- 包含了许多键值对，如 `Content-Type`, `User-Agent`, `Authorization` 等。
- 通过 `request.getHeader("Header-Name")` 获取。

#### 3. 请求参数
这是你最关心的部分。请求参数可以来自两个地方：

- **URL 查询字符串：** 例如 `GET /api/user?name=zhangsan&age=20` 中的 `name` 和 `age`。
- **请求体：** 主要针对 `POST`, `PUT` 等方法。但**需要满足特定的 Content-Type**：
    - `application/x-www-form-urlencoded`：这是 HTML 表单默认的格式，数据格式和查询字符串一样 `name=zhangsan&age=20`。
    - `multipart/form-data`：常用于文件上传。

**重要特点：** Servlet 容器会**将查询字符串和请求体（如果是上述两种格式）中的参数“合并”到同一个参数映射表里**。这就是为什么你可以用统一的 `request.getParameter("key")` 方法来获取参数，而不用关心它来自哪里。

#### 4. 请求体
- 这是 `POST`, `PUT` 等请求携带的主要数据部分。
- 它是一个**数据流**，只能被读取一次。通过 `request.getInputStream()` 或 `request.getReader()` 获取。
- 当 Content-Type 是 `application/json` 或 `application/xml` 时，数据就在请求体中，但**不会被自动解析到 `getParameter()` 方法**的映射表中。

----

#### HttpServletRequest 主要数据来源：

1. **参数（Parameters）** - `request.getParameter()`
    
    - **来源**：查询字符串（URL 中 `?` 后面） + 表单数据（Content-Type: `application/x-www-form-urlencoded`）
        
    - **特点**：键值对格式，自动合并到同一参数映射表中
        
    - **对应注解**：`@RequestParam`, `@ModelAttribute`
        
2. **路径变量（Path Variables）** - **不在 `getParameter()` 中！**
    
    - **来源**：URL 路径中的动态部分，如 `/users/{id}` 中的 `{id}`
        
    - **获取方式**：需要框架级别的路由解析，通过 `@PathVariable` 获取
        
    - **重要**：路径变量是**路由的一部分**，不是查询参数
        
3. **请求体（Body）** - `request.getInputStream()`
    
    - **来源**：POST/PUT 请求的正文内容
        
    - **格式**：JSON、XML、纯文本等（取决于 Content-Type）
        
    - **对应注解**：`@RequestBody`
        
4. **请求头（Headers）** - `request.getHeader()`
    
    - **来源**：HTTP 头部信息
        
    - **对应注解**：`@RequestHeader`
---

### 第三部分：@RequestBody 注解详解

现在来回答你的最后一个问题：**`@RequestBody` 注解的参数是不是只能有一个？**

**答案是：是的，在一个处理请求的方法中，`@RequestBody` 注解最多只能使用一次。**

#### 为什么？

1.  **物理限制：** 一个 HTTP 请求只有一个请求体。请求体是一个输入流（`InputStream`），就像水管里的水，只能被读取一次。如果你在多个方法参数上都加了 `@RequestBody`，框架试图从同一个流里读取多次，这是不可能的。
2.  **设计哲学：** `@RequestBody` 的设计意图是将整个请求体反序列化（绑定）到一个对象上。如果你的请求体是一个 JSON，它通常对应一个完整的业务对象（如 `User`, `Order`）。将相关的数据封装在一个对象中是更清晰、更面向对象的设计。

#### 正确用法

你应该用一个对象来接收整个请求体。

**前端请求（JSON）：**
```json
{
  "name": "张三",
  "age": 25,
  "email": "zhangsan@example.com"
}
```

**后端代码：**
```java
@PostMapping("/user")
public ResponseEntity<String> createUser(@RequestBody UserCreateRequest userRequest) {
    // 框架（如Spring）会使用HttpMessageConverter（默认是Jackson）
    // 将请求体的JSON字符串整个转换为UserCreateRequest对象
    System.out.println(userRequest.getName());
    System.out.println(userRequest.getAge());
    // ... 处理业务
    return ResponseEntity.ok("User created");
}

// 专门用于接收请求体的DTO（Data Transfer Object）
public class UserCreateRequest {
    private String name;
    private Integer age;
    private String email;
    // ... 必须要有getter和setter
}
```

#### 如果请求数据来自不同地方怎么办？

遵循 RESTful 和常见最佳实践：
- **路径变量：** 用于标识资源，如 `/users/{id}` -> `@PathVariable Long id`
- **查询参数：** 用于过滤、排序、分页，如 `?page=1&size=10` -> `@RequestParam int page, @RequestParam int size`
- **请求体：** 用于提交需要创建或更新的完整数据 -> `@RequestBody UserDTO user`

**示例：**
```java
@PutMapping("/users/{userId}")
public ResponseEntity<String> updateUser(
        @PathVariable Long userId,         // 来自URL路径
        @RequestParam(required = false) String detail, // 来自查询字符串 ?detail=foo
        @RequestBody UserUpdateRequest updateRequest) { // 来自请求体（JSON）
    // 业务逻辑
    return ResponseEntity.ok("User updated");
}
```

### 总结对比

| 特性 | `HttpServletRequest` | `@RequestParam` | `@RequestBody` |
| :--- | :--- | :--- | :--- |
| **数据来源** | 参数映射表（查询字符串 + 表单体） | 参数映射表（查询字符串 + 表单体） | **请求体**（通常是JSON/XML） |
| **获取方式** | `request.getParameter("key")` | 直接作为方法参数 | 直接作为方法参数 |
| **数量** | 可获取任意多个参数 | 一个方法可以有多个 | **一个方法只能有一个** |
| **类型转换** | 返回 `String`，需手动转换 | 支持自动类型转换（String -> int/Long等） | 支持复杂对象反序列化（JSON -> Java Object） |
| **层级** | 底层 Servlet API | 框架提供的高级抽象 | 框架提供的高级抽象 |
