写一个 **去掉 CXF 依赖、改成 Spring RestTemplate 版本的 HttpClientUtil**，保留原来的两个 `post` 方法：

- **post(url, body)** —— 普通 POST
    
- **post(url, body, token)** —— 带 Token 的 POST（放 HTTP Header 里）
    

额外帮你加上 GET、PUT、DELETE，方便以后扩展。

---

## **RestTemplate 版 HttpClientUtil**

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class HttpClientUtil {

    @Autowired
    private RestTemplate restTemplate;

    /**
     * POST - 发送 JSON 数据
     */
    public String post(String url, Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Object> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        return response.getBody();
    }

    /**
     * POST - 发送 JSON 数据，带 Authorization Token
     */
    public String post(String url, Object body, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<Object> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        return response.getBody();
    }

    /**
     * GET 请求（不带 Token）
     */
    public String get(String url) {
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }

    /**
     * GET 请求（带 Token）
     */
    public String get(String url, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        return response.getBody();
    }

    /**
     * PUT 请求
     */
    public String put(String url, Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Object> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);

        return response.getBody();
    }

    /**
     * DELETE 请求
     */
    public String delete(String url) {
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, null, String.class);
        return response.getBody();
    }
}
```

---

## **Spring Boot 配置 RestTemplate**

在启动类（或任意 `@Configuration` 类）里加：

```java
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
}
```

---

## **调用示例**

```java
@Autowired
private HttpClientUtil httpClientUtil;

public void test() {
    // POST 不带 Token
    String result1 = httpClientUtil.post("http://example.com/api/save", new MyDto("abc", 123));

    // POST 带 Token
    String result2 = httpClientUtil.post("http://example.com/api/save", new MyDto("abc", 123), "myToken123");

    // GET
    String result3 = httpClientUtil.get("http://example.com/api/data");

    // GET 带 Token
    String result4 = httpClientUtil.get("http://example.com/api/data", "myToken123");
}
```

---

## **为什么这样能替代 CXF**

- **CXF WebClient** → **RestTemplate**：都是 HTTP 客户端，只是 API 风格不同
    
- 这个 `HttpClientUtil` 保留了你原有的两个 POST 方法，外部调用不需要改太多代码
    
- 没有 CXF 依赖，不会再和 `/services` 之类的旧框架冲突
    
- 可以在 Spring MVC、Spring Boot 环境里直接用
    

---

如果你愿意，我可以帮你**直接做一个对你原来 CXF HttpClientUtil 方法名和参数完全一致的版本**，这样你替换之后连调用地方都不用改一行代码。  
这样你切换服务的时候，就不会出现你说的那个 **找不到 Feign 类** 的问题了，因为这个版本不再依赖 CXF。

你要我帮你按你原有的方法签名做完全兼容版吗？这样替换会最省事。