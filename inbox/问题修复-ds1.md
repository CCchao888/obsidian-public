

### 一、问题根源：注解的默认行为不同

| 注解/场景 | 框架 | 默认是否必需 | 前端不传参时的行为 |
| :--- | :--- | :--- | :--- |
| **`@QueryParam`** (JAX-RS/CXF) | **非必需** | 参数值为 `null` |  |
| **无注解的对象属性** | **非必需** | 属性值为 `null` |  |
| **`@RequestParam`** (Spring MVC) | **必需** (`required = true`) | 抛出 `400 Bad Request` 异常 |  |
| **`@RequestBody`** (Spring MVC) | **必需** (`required = true`) | 抛出 `400 Bad Request` 异常（请求体为空） |  |

**这就是你测试环境报错的直接原因**：Spring MVC 的注解默认要求参数必须存在，而CXF的注解则更加宽松。

---

### 二、解决方案：调整Spring MVC注解

针对你的具体情况，有以下几种解决方案：

#### 方案一：将 `@RequestParam` 的 `required` 属性设为 `false`（最直接）

这是解决查询参数问题的最佳方式。

**修改前（会报错）：**
```java
@GetMapping("/users")
public List<User> getUsers(@RequestParam String name, 
                          @RequestParam String department) {
    // 如果前端没传name或department，这里会直接报400错误，根本进不到方法体
    return userService.findUsers(name, department);
}
```

**修改后（兼容旧接口）：**
```java
@GetMapping("/users")
public List<User> getUsers(@RequestParam(required = false) String name, 
                          @RequestParam(required = false) String department) {
    // 现在，如果前端没传参数，name和department的值会是null
    // 你可以在方法内部处理null的情况
    return userService.findUsers(name, department);
}
```

#### 方案二：使用 `defaultValue` 提供默认值

如果业务逻辑允许，可以为参数提供默认值。

```java
@GetMapping("/users")
public List<User> getUsers(@RequestParam(defaultValue = "") String name, 
                          @RequestParam(defaultValue = "IT") String department) {
    // 如果前端没传name，name会是空字符串""
    // 如果前端没传department，department会是"IT"
    return userService.findUsers(name, department);
}
```

#### 方案三：使用 `@RequestMapping` 而非 `@RequestParam` 接收复杂对象

如果参数较多，且允许为null，可以定义一个DTO对象来接收。

**1. 创建查询参数DTO：**
```java
public class UserQueryDTO {
    private String name;
    private String department;
    private Integer age;
    // 必须有getter和setter
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    // ... 其他getter/setter
}
```

**2. 修改Controller方法（注意：这里不需要任何注解！）：**
```java
@GetMapping("/users")
public List<User> getUsers(UserQueryDTO query) { // 没有@RequestBody！
    // Spring MVC会自动将查询参数绑定到query对象的属性上
    // 如果某个参数没传，对应的属性值就是null
    return userService.findUsers(query.getName(), query.getDepartment());
}
```

**前端请求示例：** `GET /users?name=张三&department=工程部`

这种方式的优势是参数可扩展性强，非常适合复杂的多条件查询。

---

### 三、关于 `@RequestBody` 的特殊处理

`@RequestBody` 用于接收请求体（通常是JSON），它的必需性逻辑不同：

**修改前：**
```java
@PostMapping("/users")
public User createUser(@RequestBody User user) { // 要求请求体不能为空
    return userService.save(user);
}
```

**如果希望请求体可选（虽然不常见），可以设置：**
```java
@PostMapping("/users")
public User createUser(@RequestBody(required = false) User user) {
    if (user == null) {
        user = new User(); // 创建一个默认用户
        user.setName("默认用户");
    }
    return userService.save(user);
}
```

但更常见的做法是**保持`@RequestBody`为必需**，因为创建资源通常需要完整数据。

---

### 四、Feign Client 端的对应修改

Feign Client 的注解与Spring MVC Controller 的注解是**独立**的，但为了正确调用，也需要相应调整。

#### 场景一：调用使用 `@RequestParam(required = false)` 的接口

**Feign Client 接口：**
```java
@FeignClient(name = "user-service")
public interface UserServiceClient {
    
    // 服务端：@RequestParam(required = false) String name
    @GetMapping("/users")
    List<User> getUsers(@RequestParam(value = "name", required = false) String name,
                       @RequestParam(value = "department", required = false) String department);
    
    // 调用时，可以传null
    // userServiceClient.getUsers(null, "工程部"); 
    // 生成的URL: http://user-service/users?department=工程部
}
```

**关键点：** Feign Client 中的 `required = false` 表示"这个参数可以传null"。当参数为null时，Feign 不会将它拼接到URL中。

#### 场景二：调用使用DTO对象接收参数的接口

**Feign Client 接口：**
```java
@FeignClient(name = "user-service")
public interface UserServiceClient {
    
    // 服务端：UserQueryDTO query (无注解)
    @GetMapping("/users")
    List<User> getUsers(@SpringQueryMap UserQueryDTO query);
    // 使用 @SpringQueryMap 注解，Feign会将对象属性转换为URL查询参数
}
```

**调用示例：**
```java
UserQueryDTO query = new UserQueryDTO();
query.setDepartment("工程部");
// name不设置，保持为null

List<User> users = userServiceClient.getUsers(query);
// 生成的URL: http://user-service/users?department=工程部
// name参数因为为null，不会被拼接
```

---

### 五、总结与行动指南

1.  **立即修复**：将测试环境报错的方法中的 `@RequestParam` 加上 `required = false`。
2.  **全面检查**：检查所有从CXF迁移过来的接口，特别是查询接口，确保：
    -   所有可选的查询参数都使用了 `@RequestParam(required = false)`
    -   或者改用DTO对象方式接收参数（无注解）
3.  **更新Feign Client**：对应修改调用这些接口的Feign Client，确保参数注解的一致性。
4.  **业务逻辑处理**：在Service层代码中，要妥善处理参数为 `null` 的情况，保持与原有CXF接口相同的行为（比如，参数为null时查询所有数据）。

**示例修复代码：**
```java
@GetMapping("/users")
public List<User> getUsers(@RequestParam(required = false) String name, 
                          @RequestParam(required = false) String department) {
    // 模拟原来CXF接口的行为：参数为null时查询所有
    if (name == null && department == null) {
        return userService.findAllUsers();
    } else {
        return userService.findUsersByNameAndDepartment(name, department);
    }
}
```

