

## 1. 动态SQL核心标签概览

| 标签 | 作用 | 相当于Java代码 |
|------|------|---------------|
| `<if>` | 条件判断 | `if` |
| `<choose>` `<when>` `<otherwise>` | 多条件选择 | `switch-case` |
| `<where>` | 智能WHERE子句 | 自动处理AND |
| `<set>` | 智能SET子句 | 自动处理逗号 |
| `<foreach>` | 循环遍历 | `for`循环 |
| `<trim>` | 自定义字符串修剪 | 更灵活的where/set |
| `<bind>` | 变量绑定 | 创建变量 |

## 2. if 标签 - 基础条件判断

### 2.1 基本语法
```xml
<if test="条件表达式">
    SQL片段
</if>
```

### 2.2 实际示例
```xml
<!-- 简单的if判断 -->
<select id="findUsers" parameterType="map" resultMap="userMap">
    SELECT * FROM users
    WHERE 1=1
    <if test="username != null and username != ''">
        AND username = #{username}
    </if>
    <if test="age != null">
        AND age = #{age}
    </if>
    <if test="email != null">
        AND email LIKE CONCAT('%', #{email}, '%')
    </if>
</select>
```

### 2.3 复杂条件表达式
```xml
<select id="findUsers" resultMap="userMap">
    SELECT * FROM users
    WHERE 1=1
    <!-- 字符串判断 -->
    <if test="name != null and name != ''">
        AND name = #{name}
    </if>
    <!-- 数值判断 -->
    <if test="minAge != null and minAge > 0">
        AND age >= #{minAge}
    </if>
    <if test="maxAge != null and maxAge &lt; 150">
        AND age <= #{maxAge}
    </if>
    <!-- 布尔值判断 -->
    <if test="active != null and active == true">
        AND is_active = 1
    </if>
    <!-- 集合判断 -->
    <if test="ids != null and ids.size() > 0">
        AND id IN 
        <foreach collection="ids" item="id" open="(" separator="," close=")">
            #{id}
        </foreach>
    </if>
</select>
```

## 3. choose, when, otherwise - 多路选择

### 3.1 基本语法（类似switch-case）
```xml
<choose>
    <when test="条件1">SQL片段1</when>
    <when test="条件2">SQL片段2</when>
    <otherwise>默认SQL片段</otherwise>
</choose>
```

### 3.2 实际示例
```xml
<!-- 根据不同类型进行不同的排序 -->
<select id="findUsers" parameterType="map" resultMap="userMap">
    SELECT * FROM users
    WHERE 1=1
    <if test="name != null">
        AND name LIKE CONCAT('%', #{name}, '%')
    </if>
    ORDER BY 
    <choose>
        <when test="sortType == 'name'">
            username ASC
        </when>
        <when test="sortType == 'age'">
            age DESC
        </when>
        <when test="sortType == 'createTime'">
            create_time DESC
        </when>
        <otherwise>
            id DESC  <!-- 默认排序 -->
        </otherwise>
    </choose>
</select>

<!-- 状态查询 -->
<select id="findByStatus" parameterType="string" resultMap="userMap">
    SELECT * FROM users
    WHERE 
    <choose>
        <when test="status == 'active'">
            is_active = 1 AND deleted = 0
        </when>
        <when test="status == 'inactive'">
            is_active = 0 AND deleted = 0
        </when>
        <when test="status == 'deleted'">
            deleted = 1
        </when>
        <otherwise>
            deleted = 0  <!-- 默认查询未删除的 -->
        </otherwise>
    </choose>
</select>
```

## 4. where 标签 - 智能WHERE子句

### 4.1 解决的问题
**没有where标签的问题：**
```xml
<!-- 问题：如果所有条件都为空，SQL会变成：SELECT * FROM users WHERE -->
<!-- 问题：如果第一个条件为空，SQL会变成：SELECT * FROM users WHERE AND age = 18 -->
SELECT * FROM users
WHERE
<if test="name != null">name = #{name}</if>
<if test="age != null">AND age = #{age}</if>
```

### 4.2 where标签的智能处理
```xml
<select id="findUsers" parameterType="map" resultMap="userMap">
    SELECT * FROM users
    <where>
        <if test="name != null and name != ''">
            AND name = #{name}
        </if>
        <if test="age != null">
            AND age = #{age}
        </if>
        <if test="email != null">
            AND email LIKE CONCAT('%', #{email}, '%')
        </if>
        <!-- where标签会自动：
             1. 删除第一个AND/OR
             2. 如果所有条件都为空，不生成WHERE关键字 -->
    </where>
</select>
```

### 4.3 生成的SQL示例
```java
// 情况1：所有条件都为空
// 生成的SQL: SELECT * FROM users

// 情况2：只有age有值
// 生成的SQL: SELECT * FROM users WHERE age = 18

// 情况3：name和age都有值  
// 生成的SQL: SELECT * FROM users WHERE name = 'John' AND age = 18
```

## 5. set 标签 - 智能UPDATE

### 5.1 基本用法
```xml
<update id="updateUser" parameterType="User">
    UPDATE users
    <set>
        <if test="username != null">
            username = #{username},
        </if>
        <if test="email != null">
            email = #{email},
        </if>
        <if test="age != null">
            age = #{age},
        </if>
        <if test="updateTime != null">
            update_time = NOW(),
        </if>
        <!-- set标签会自动删除最后一个逗号 -->
    </set>
    WHERE id = #{id}
</update>
```

### 5.2 生成的SQL示例
```java
// 只更新username和email
// 生成的SQL: UPDATE users SET username = 'newName', email = 'new@email.com' WHERE id = 1

// 注意：set标签会自动处理末尾多余的逗号
```

## 6. foreach 标签 - 循环遍历

### 6.1 基本语法
```xml
<foreach collection="集合参数" 
         item="每个元素的变量名"
         index="索引变量名（可选）"
         open="开始符号" 
         separator="分隔符" 
         close="结束符号">
    #{item}
</foreach>
```

### 6.2 常用场景示例

#### IN 查询
```xml
<!-- 根据ID列表查询 -->
<select id="findUsersByIds" parameterType="list" resultMap="userMap">
    SELECT * FROM users
    WHERE id IN
    <foreach collection="list" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>

<!-- 使用Map参数 -->
<select id="findUsersByIds" parameterType="map" resultMap="userMap">
    SELECT * FROM users
    WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
    AND status = #{status}
</select>
```

#### 批量插入
```xml
<!-- 批量插入用户 -->
<insert id="batchInsert" parameterType="list">
    INSERT INTO users (username, email, age, create_time)
    VALUES 
    <foreach collection="list" item="user" separator=",">
        (#{user.username}, #{user.email}, #{user.age}, NOW())
    </foreach>
</insert>
```

#### 批量更新（MySQL）
```xml
<!-- 批量更新多个字段 -->
<update id="batchUpdate" parameterType="list">
    <foreach collection="list" item="user" separator=";">
        UPDATE users 
        SET 
            username = #{user.username},
            email = #{user.email},
            age = #{user.age},
            update_time = NOW()
        WHERE id = #{user.id}
    </foreach>
</update>

<!-- 或者使用CASE WHEN方式 -->
<update id="batchUpdateByCase" parameterType="list">
    UPDATE users 
    SET 
        username = CASE id
            <foreach collection="list" item="user">
                WHEN #{user.id} THEN #{user.username}
            </foreach>
            ELSE username
        END,
        email = CASE id
            <foreach collection="list" item="user">
                WHEN #{user.id} THEN #{user.email}
            </foreach>
            ELSE email
        END
    WHERE id IN
    <foreach collection="list" item="user" open="(" separator="," close=")">
        #{user.id}
    </foreach>
</update>
```

### 6.3 不同集合类型的处理
```java
// Mapper接口方法定义
public interface UserMapper {
    // 1. List参数
    List<User> findByIds(List<Long> ids);
    
    // 2. Array参数  
    List<User> findByIds(Long[] ids);
    
    // 3. Map参数
    List<User> findByCondition(Map<String, Object> params);
}
```

```xml
<!-- List类型 -->
<foreach collection="list" item="id">...</foreach>

<!-- Array类型 -->
<foreach collection="array" item="id">...</foreach>

<!-- Map中的List -->
<foreach collection="params.ids" item="id">...</foreach>
```

## 7. trim 标签 - 自定义修剪

### 7.1 trim 替代 where
```xml
<!-- 用trim实现where标签的功能 -->
<select id="findUsers" resultMap="userMap">
    SELECT * FROM users
    <trim prefix="WHERE" prefixOverrides="AND |OR ">
        <if test="name != null">
            AND name = #{name}
        </if>
        <if test="age != null">
            AND age = #{age}
        </if>
    </trim>
</select>
```

### 7.2 trim 替代 set
```xml
<update id="updateUser">
    UPDATE users
    <trim prefix="SET" suffixOverrides=",">
        <if test="username != null">
            username = #{username},
        </if>
        <if test="email != null">
            email = #{email},
        </if>
    </trim>
    WHERE id = #{id}
</update>
```

### 7.3 trim 属性详解
- `prefix`：在内容前添加前缀
- `suffix`：在内容后添加后缀
- `prefixOverrides`：去掉内容首部的指定字符串
- `suffixOverrides`：去掉内容尾部的指定字符串

## 8. bind 标签 - 变量绑定

### 8.1 创建变量
```xml
<!-- 模糊查询绑定变量 -->
<select id="findUsers" parameterType="map" resultMap="userMap">
    <!-- 创建模糊查询变量 -->
    <bind name="namePattern" value="'%' + name + '%'" />
    <bind name="emailPattern" value="'%' + email + '%'" />
    
    SELECT * FROM users
    <where>
        <if test="name != null">
            AND username LIKE #{namePattern}
        </if>
        <if test="email != null">
            AND email LIKE #{emailPattern}
        </if>
    </where>
</select>
```

### 8.2 复杂表达式计算
```xml
<!-- 计算复杂表达式 -->
<select id="findUsers" parameterType="map" resultMap="userMap">
    <bind name="minBirthYear" value="currentYear - maxAge" />
    <bind name="maxBirthYear" value="currentYear - minAge" />
    
    SELECT * FROM users
    WHERE YEAR(birth_date) BETWEEN #{minBirthYear} AND #{maxBirthYear}
</select>
```

## 9. 综合实战案例

### 9.1 复杂查询示例
```xml
<!-- 用户高级查询 -->
<select id="findUsersByComplexCondition" parameterType="map" resultMap="userMap">
    SELECT * FROM users
    <where>
        <!-- 基础信息 -->
        <if test="username != null and username != ''">
            AND username LIKE CONCAT('%', #{username}, '%')
        </if>
        <if test="email != null and email != ''">
            AND email = #{email}
        </if>
        
        <!-- 年龄范围 -->
        <if test="minAge != null and maxAge != null">
            AND age BETWEEN #{minAge} AND #{maxAge}
        </if>
        <if test="minAge != null and maxAge == null">
            AND age >= #{minAge}
        </if>
        <if test="maxAge != null and minAge == null">
            AND age <= #{maxAge}
        </if>
        
        <!-- 状态多选 -->
        <if test="statusList != null and statusList.size() > 0">
            AND status IN
            <foreach collection="statusList" item="status" open="(" separator="," close=")">
                #{status}
            </foreach>
        </if>
        
        <!-- 角色筛选 -->
        <choose>
            <when test="role == 'admin'">
                AND role_id = 1
            </when>
            <when test="role == 'user'">
                AND role_id = 2
            </when>
            <when test="role == 'vip'">
                AND role_id = 3 AND vip_expire_date > NOW()
            </when>
        </choose>
        
        <!-- 时间范围 -->
        <if test="startTime != null and endTime != null">
            AND create_time BETWEEN #{startTime} AND #{endTime}
        </if>
    </where>
    
    <!-- 排序 -->
    <choose>
        <when test="sortField == 'createTime'">
            ORDER BY create_time ${sortOrder}
        </when>
        <when test="sortField == 'age'">
            ORDER BY age ${sortOrder}
        </when>
        <otherwise>
            ORDER BY id DESC
        </otherwise>
    </choose>
    
    <!-- 分页 -->
    <if test="pageSize != null and offset != null">
        LIMIT #{pageSize} OFFSET #{offset}
    </if>
</select>
```

### 9.2 复杂更新示例
```xml
<!-- 智能更新用户信息 -->
<update id="updateUserSelective" parameterType="User">
    UPDATE users
    <set>
        <if test="username != null and username != ''">
            username = #{username},
        </if>
        <if test="email != null and email != ''">
            email = #{email},
        </if>
        <if test="password != null and password != ''">
            password = #{password},
        </if>
        <if test="age != null">
            age = #{age},
        </if>
        <if test="phone != null">
            phone = #{phone},
        </if>
        <!-- 确保至少更新一个字段 -->
        <if test="username == null and email == null and password == null and age == null and phone == null">
            update_time = NOW()
        </if>
        <if test="username != null or email != null or password != null or age != null or phone != null">
            update_time = NOW()
        </if>
    </set>
    WHERE id = #{id}
</update>
```

## 10. SQL片段抽取
[[SQL片段抽取]]


## 10. 最佳实践和注意事项

### 10.1 性能优化
```xml
<!-- 使用索引提示 -->
<select id="findUsers" resultMap="userMap">
    SELECT /*+ INDEX(users idx_username) */ * 
    FROM users
    <where>
        <if test="username != null">
            AND username = #{username}
        </if>
    </where>
</select>
```

### 10.2 避免SQL注入
```xml
<!-- 不要这样写！ -->
<if test="orderBy != null">
    ORDER BY ${orderBy}  <!-- 直接拼接，有SQL注入风险 -->
</if>

<!-- 应该这样写 -->
<choose>
    <when test="orderBy == 'name'">
        ORDER BY username
    </when>
    <when test="orderBy == 'age'">
        ORDER BY age
    </when>
    <otherwise>
        ORDER BY id
    </otherwise>
</choose>
```

### 10.3 调试技巧
```xml
<!-- 在开发环境可以添加调试SQL -->
<select id="findUsers" resultMap="userMap">
    <!-- 调试信息 -->
    <!-- 参数: username=${username}, age=${age} -->
    
    SELECT * FROM users
    <where>
        <if test="username != null">
            AND username = #{username}
        </if>
        <if test="age != null">
            AND age = #{age}
        </if>
    </where>
</select>
```

## 11. 常见问题解决

### 11.1 特殊符号转义
```xml
<!-- 在test表达式中，> 和 < 需要转义 -->
<if test="age &gt; 18">  <!-- 使用 &gt; 代替 > -->
    AND age > 18
</if>

<if test="age &lt; 65">  <!-- 使用 &lt; 代替 < -->
    AND age < 65
</if>
```

### 11.2 空字符串判断
```xml
<!-- 正确的空字符串判断 -->
<if test="name != null and name != ''">
    AND name = #{name}
</if>

<!-- 或者使用工具方法 -->
<if test="@org.apache.commons.lang3.StringUtils@isNotBlank(name)">
    AND name = #{name}
</if>
```

## 12. 学习路径建议

**第一阶段**：掌握 `<if>` 和 `<where>`
**第二阶段**：学习 `<foreach>` 和 `<choose>`
**第三阶段**：掌握 `<set>` 和 `<trim>`
**第四阶段**：学习 `<bind>` 和复杂组合

记住：**动态SQL的核心思想是"按需生成SQL"**，通过条件判断来构建最合适的查询语句。

