**CXF WebClient → RestTemplate / WebClient 映射表**


## **1. 基本 GET 请求**

**CXF 写法**

```java
WebClient client = WebClient.create("http://example.com/api/data");
Response response = client.get();
String result = response.readEntity(String.class);
```

**RestTemplate 写法（同步阻塞）**

```java
String result = restTemplate.getForObject("http://example.com/api/data", String.class);
```

**WebClient 写法（异步非阻塞）**

```java
WebClient webClient = WebClient.create();
String result = webClient.get()
    .uri("http://example.com/api/data")
    .retrieve()
    .bodyToMono(String.class)
    .block(); // block() 转同步
```

---

## **2. 带参数 GET 请求**

**CXF**

```java
WebClient client = WebClient.create("http://example.com/api/data");
Response response = client.query("id", 123).get();
String result = response.readEntity(String.class);
```

**RestTemplate**

```java
String url = "http://example.com/api/data?id={id}";
String result = restTemplate.getForObject(url, String.class, 123);
```

**WebClient**

```java
String result = webClient.get()
    .uri(uriBuilder -> uriBuilder
        .scheme("http")
        .host("example.com")
        .path("/api/data")
        .queryParam("id", 123)
        .build())
    .retrieve()
    .bodyToMono(String.class)
    .block();
```

---

## **3. POST 请求（发送 JSON）**

**CXF**

```java
WebClient client = WebClient.create("http://example.com/api/save");
Response response = client.post(new MyDto("abc", 123));
String result = response.readEntity(String.class);
```

**RestTemplate**

```java
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_JSON);
HttpEntity<MyDto> request = new HttpEntity<>(new MyDto("abc", 123), headers);

String result = restTemplate.postForObject("http://example.com/api/save", request, String.class);
```

**WebClient**

```java
String result = webClient.post()
    .uri("http://example.com/api/save")
    .contentType(MediaType.APPLICATION_JSON)
    .bodyValue(new MyDto("abc", 123))
    .retrieve()
    .bodyToMono(String.class)
    .block();
```

---

## **4. POST 请求（表单数据）**

**CXF**（表单模式）

```java
WebClient client = WebClient.create("http://example.com/api/form");
Form form = new Form();
form.param("username", "john");
form.param("age", "20");
Response response = client.post(form);
```

**RestTemplate**

```java
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
form.add("username", "john");
form.add("age", "20");

HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);
String result = restTemplate.postForObject("http://example.com/api/form", request, String.class);
```

**WebClient**

```java
String result = webClient.post()
    .uri("http://example.com/api/form")
    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
    .body(BodyInserters.fromFormData("username", "john").with("age", "20"))
    .retrieve()
    .bodyToMono(String.class)
    .block();
```

---

## **5. 添加请求头**

**CXF**

```java
WebClient client = WebClient.create("http://example.com/api/data");
client.header("Authorization", "Bearer token123");
Response response = client.get();
```

**RestTemplate**

```java
HttpHeaders headers = new HttpHeaders();
headers.set("Authorization", "Bearer token123");

HttpEntity<Void> entity = new HttpEntity<>(headers);
ResponseEntity<String> response = restTemplate.exchange(
    "http://example.com/api/data",
    HttpMethod.GET,
    entity,
    String.class
);
```

**WebClient**

```java
String result = webClient.get()
    .uri("http://example.com/api/data")
    .header("Authorization", "Bearer token123")
    .retrieve()
    .bodyToMono(String.class)
    .block();
```

---

## **6. 总结映射关系**

|CXF WebClient 方法|RestTemplate 对应|WebClient 对应|
|---|---|---|
|`client.get()`|`restTemplate.getForObject()` / `exchange()`|`.get().retrieve().bodyToMono()`|
|`client.post(obj)`|`restTemplate.postForObject()`|`.post().bodyValue(obj).retrieve()`|
|`client.query(k,v)`|URL 占位符 或 `UriComponentsBuilder`|`.uri(uriBuilder -> ...)`|
|`client.header(k,v)`|`HttpHeaders` + `HttpEntity`|`.header(k,v)`|
|`client.put(obj)`|`restTemplate.put()`|`.put().bodyValue(obj)`|
|`client.delete()`|`restTemplate.delete()`|`.delete()`|

---

如果你要把整个 `HttpClientUtil` 从 CXF 切过来，你可以：

1. 把它内部的 `WebClient` 全部换成 `RestTemplate`
    
2. 对应的方法改成我上面给的形式
    
3. Spring Boot 启动类里加：
    

```java
@Bean
public RestTemplate restTemplate(RestTemplateBuilder builder) {
    return builder.build();
}
```

这样工具类就完全无 CXF 依赖了，而且和 Spring MVC 直接兼容。
