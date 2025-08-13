遇到的是 **CXF 切 Spring MVC** 过程中两个不同层面的问题：

1. **/services 404 或 No service 问题**（路由、框架冲突）
    
2. **`Feign/RequestInterceptor.class cannot be opened`**（依赖冲突导致类缺失）
    
3. **`HttpClientUtil` 依赖 CXF，去掉 CXF 后报错**（工具类实现依赖旧框架）
    

我给你拆开分析一下，免得乱成一锅。

---

## 1. `/services` 报错的根本原因

在之前那个服务里能解决，是因为：

- 你保留了 CXF 核心依赖，但排除了它的大部分传递依赖（减少和 Spring MVC 的冲突）
    
- 再加上启动类扫描排除了 CXF 注册的 Bean（避免它启动 REST 服务）
    
- 最终效果：`/services` 路径不再被 CXF 接管
    

**为什么现在不行？**

- 新服务的 `/services` 可能在 **其他地方仍然被 CXF 或 Web.xml / spring-cxf.xml 绑定**
    
- CXF 的注册不止一种方式，可能它是通过 `@ImportResource("classpath:web.services.xml")` 或类似 bean 配置注册的
    
- 如果你没完全排除掉 CXF 的 Servlet / JAX-RS Server bean，它依旧会拦截 `/services`
    

✅ 解决思路：

- 确认 `web.services.xml` 或其他 `jaxrs:server address="/services"` 之类配置是否还存在
    
- 启动类排除扫描 `@ComponentScan(excludeFilters = …)` 之外，还要检查 XML 里是否注册了 Servlet
    
- 如果只是要保留工具类依赖 CXF，但不要让它启动 REST Server，可以在 `pom.xml` 中引入精简依赖（只保留 `cxf-core` / `cxf-rt-frontend-jaxrs` 需要的 class，排除 servlet 部分）
    

---

## 2. `feign/RequestInterceptor.class cannot be opened` 错误

这个错误是因为：

- 你在 `pom.xml` 里 **排除了太多传递依赖**，结果连 Feign 的核心类 `RequestInterceptor` 都被排除了
    
- Spring Cloud OpenFeign 需要这个类来加载拦截器，否则直接 `FileNotFoundException`
    

✅ 解决思路：

- 在排除传递依赖时，不要用 `<groupId>*</groupId>` 这种“一刀切”方式
    
- 用精确的排除，只排掉 CXF servlet / jaxrs runtime 相关的，不要排到 Feign / Spring Boot 的核心依赖  
    例如：
    
    ```xml
    <exclusions>
        <exclusion>
            <groupId>org.apache.cxf</groupId>
            <artifactId>cxf-rt-transports-http</artifactId>
        </exclusion>
        <exclusion>
            <groupId>org.apache.cxf</groupId>
            <artifactId>cxf-rt-frontend-jaxrs</artifactId>
        </exclusion>
    </exclusions>
    ```
    
- 然后单独在 `dependencyManagement` 或 `<dependencies>` 再补齐 Feign 依赖：
    
    ```xml
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-openfeign</artifactId>
    </dependency>
    ```
    

---

## 3. `HttpClientUtil` 依赖 CXF

你提到这个工具类依赖 CXF，如果你去掉 CXF 就编译报错，这说明：

- 它可能用的是 CXF 的 `WebClient` / `JAXRSClientFactory` / `HTTPConduit` 等类去发 HTTP 请求
    
- 这类工具类在 Spring MVC 里完全可以用 **`RestTemplate` 或 `WebClient`（Spring WebFlux）** 替代
    

✅ 改造示例：  
假设原来 `HttpClientUtil` 用 CXF 发请求：

```java
WebClient client = WebClient.create("http://xxx");
Response response = client.get();
String body = response.readEntity(String.class);
```

改成 Spring MVC：

```java
@Autowired
private RestTemplate restTemplate;

public String get(String url) {
    return restTemplate.getForObject(url, String.class);
}
```

或者 Spring 5 推荐的：

```java
WebClient webClient = WebClient.create();

public String get(String url) {
    return webClient.get()
            .uri(url)
            .retrieve()
            .bodyToMono(String.class)
            .block();
}
```

---

## 4. 建议的改造策略

- **保留工具类的功能**，先临时用 CXF 的 minimal 依赖保证能跑
    
- 然后逐步用 `RestTemplate` / `WebClient` 替代，彻底摆脱 CXF
    
- 依赖冲突要用 **精确排除法**，不要全 `<groupId>*</groupId>` 排除
    
- `/services` 问题优先解决路径绑定，把 CXF 的 Servlet 注册彻底关掉
    
