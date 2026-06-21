


### 方法一：查看现有前端代码（最可靠、首选）

这是最直接、最准确的方法。你需要去找到调用你这个接口的前端代码。

**1. 查找网络请求部分：**
在前端项目中（通常是 JavaScript/TypeScript 代码），搜索你的 API 端点地址，比如 `/api/users`。

**你会看到类似这样的代码：**

```javascript
// 场景A：发送 JSON 数据 (使用 @RequestBody)
fetch('/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json' // ✅ 关键标识：JSON
    },
    body: JSON.stringify({ // ✅ 关键标识：使用 JSON.stringify
        name: 'John',
        age: 25
    })
});

// 或者使用 axios
axios.post('/api/users', { // ✅ 直接传对象，axios 默认会设置为 application/json
    name: 'John',
    age: 25
});

// 场景B：发送表单数据 (不使用 @RequestBody)
// 方式1: URLSearchParams (application/x-www-form-urlencoded)
const params = new URLSearchParams();
params.append('name', 'John');
params.append('age', '25');

fetch('/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // ✅ 关键标识
    },
    body: params
});

// 方式2: FormData (multipart/form-data, 常用于文件上传)
const formData = new FormData();
formData.append('name', 'John');
formData.append('age', '25');
formData.append('avatar', fileInput.files[0]); // 文件

fetch('/api/users', {
    method: 'POST',
    body: formData // ✅ 注意：使用 FormData 时通常不需要设置 Content-Type，浏览器会自动设置
});

// 方式3: 简单的查询字符串 (即使是 POST，数据也可以在 URL 上)
fetch('/api/users?name=John&age=25', { // ✅ 数据在 URL 中
    method: 'POST'
});
```

**关键识别点：**
-   **`Content-Type: application/json` + `JSON.stringify()`** → **必须使用 `@RequestBody`**
-   **`Content-Type: application/x-www-form-urlencoded` + `URLSearchParams`** → **不能使用 `@RequestBody`**
-   **使用 `FormData`** → **不能使用 `@RequestBody`**
-   **数据直接拼接在 URL 上（`?name=John`）** → **不能使用 `@RequestBody`**

---

### 方法二：查看网络请求（次选，如果无法访问前端代码）

如果拿不到前端代码，你可以在浏览器中实际操作一下功能，然后打开开发者工具查看。

1.  打开浏览器的**开发者工具** (F12)。
2.  切换到 **Network (网络)** 标签页。
3.  勾选 **Preserve log** (保留日志)。
4.  在页面上执行会触发这个 POST 请求的操作。
5.  在网络列表中找到对应的请求，点击查看详情。

**重点关注两个地方：**

-   **Request Headers (请求头)** 中的 `Content-Type`：
    -   `application/json` → 需要 `@RequestBody`
    -   `application/x-www-form-urlencoded` → 不需要 `@RequestBody`
    -   `multipart/form-data` → 不需要 `@RequestBody`

-   **Request Payload (请求负载)** 或 **Form Data** 标签页：
    -   如果 `Payload` 显示的是 `{"name": "John", ...}` (JSON 格式) → 需要 `@RequestBody`
    -   如果 `Form Data` 显示的是 `name: John` (键值对格式) → 不需要 `@RequestBody`

![[浏览器网络工具查看请求类型示意图]]

---

### 方法三：分析旧版 CXF 后端代码（辅助判断）

查看你正在替换的旧 CXF 接口的实现，这能给你重要线索。

**1. 查看 CXF 注解：**
```java
// JAX-RS 注解提供了明确线索
@POST
@Path("/users")
@Consumes(MediaType.APPLICATION_JSON) // ✅ 消费 JSON 数据，对应 @RequestBody
public Response createUser(User user) { ... }

@POST
@Path("/users")
@Consumes(MediaType.APPLICATION_FORM_URLENCODED) // ✅ 消费表单数据，对应 无注解
public Response createUser(@FormParam("name") String name) { ... }
```
-   `@Consumes(MediaType.APPLICATION_JSON)` → 需要 `@RequestBody`
-   `@Consumes(MediaType.APPLICATION_FORM_URLENCODED)` → 不需要 `@RequestBody`

**2. 查看参数注解：**
```java
// 如果参数有 @FormParam，说明是表单数据
public Response createUser(@FormParam("name") String name, 
                          @FormParam("age") Integer age) { ... }
// 对应 Spring MVC：createUser(String name, Integer age) 【无 @RequestBody】

// 如果参数是复杂对象且没有注解，很可能是 JSON
public Response createUser(User user) { ... }
// 对应 Spring MVC：createUser(@RequestBody User user) 【有 @RequestBody】
```

---

### 方法四：编写灵活的 Spring MVC 接口进行测试（终极手段）

如果以上方法都无法确定，你可以先编写一个“宽容”的接口进行测试，根据实际收到的数据再确定最终方案。

```java
@PostMapping("/users")
// 使用 HttpServletRequest 手动解析，看看请求里到底有什么
public ResponseEntity<?> createUser(HttpServletRequest request) {
    System.out.println("Content-Type: " + request.getContentType());
    
    // 尝试读取请求体
    try {
        String body = request.getReader().lines().collect(Collectors.joining());
        System.out.println("Request Body: " + body);
    } catch (IOException e) {
        e.printStackTrace();
    }
    
    // 尝试获取表单参数
    System.out.println("Name parameter: " + request.getParameter("name"));
    System.out.println("Age parameter: " + request.getParameter("age"));
    
    return ResponseEntity.ok().build();
}
```

部署这个接口，让前端调用一次，观察控制台输出，就能一目了然地看到前端发送的数据格式。

---

### 总结与决策流程

**如果你的场景是：CXF 迁移到 Spring MVC**

1.  **首选**：查看旧 CXF 接口的 `@Consumes` 注解和参数注解。
2.  **次选**：联系前端开发人员，或直接查看前端代码中如何调用这个接口。
3.  **备选**：通过浏览器网络工具捕获实际请求。

**快速决策指南：**

| 如果你发现... | 那么 Spring MVC 应该... |
| :--- | :--- |
| `@Consumes(MediaType.APPLICATION_JSON)` | 使用 `@RequestBody` |
| `@Consumes(MediaType.APPLICATION_FORM_URLENCODED)` | 不使用 `@RequestBody` |
| 前端代码使用 `axios.post(url, object)` 或 `fetch` 带 `application/json` | 使用 `@RequestBody` |
| 前端代码使用 `FormData` 或 `URLSearchParams` | 不使用 `@RequestBody` |
| 数据在 URL 查询参数中 (`?name=John`) | 不使用 `@RequestBody` |

