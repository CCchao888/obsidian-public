

## 1. SQL片段的基本概念

### 什么是SQL片段？
SQL片段是将**重复使用的SQL代码块**抽取出来，通过`<sql>`定义，通过`<include>`引用，实现代码复用。

## 2. 基础SQL片段使用

### 2.1 定义和使用基础片段
```xml
<!-- 定义SQL片段 -->
<sql id="Base_Column_List">
    id, username, email, age, create_time, update_time
</sql>

<!-- 使用SQL片段 -->
<select id="selectAll" resultMap="BaseResultMap">
    SELECT 
    <include refid="Base_Column_List"/>  <!-- 引用片段 -->
    FROM user
</select>

<select id="selectById" parameterType="long" resultMap="BaseResultMap">
    SELECT 
    <include refid="Base_Column_List"/>
    FROM user 
    WHERE id = #{id}
</select>
```

### 2.2 编译后的SQL
```sql
-- 编译后的实际SQL
SELECT id, username, email, age, create_time, update_time FROM user
```

## 3. 带表别名的SQL片段

### 3.1 使用参数传递表别名
```xml
<!-- 定义带别名的列片段 -->
<sql id="Base_Column_List_With_Alias">
    ${alias}.id, 
    ${alias}.username, 
    ${alias}.email, 
    ${alias}.age, 
    ${alias}.create_time, 
    ${alias}.update_time
</sql>

<!-- 使用带参数的片段 -->
<select id="selectUserWithDetail" resultMap="UserDetailMap">
    SELECT 
    <include refid="Base_Column_List_With_Alias">
        <property name="alias" value="u"/>  <!-- 传递参数 -->
    </include>,
    d.department_name,
    r.role_name
    FROM user u
    LEFT JOIN department d ON u.dept_id = d.id
    LEFT JOIN role r ON u.role_id = r.id
</select>
```

### 3.2 编译后的SQL
```sql
SELECT 
    u.id, u.username, u.email, u.age, u.create_time, u.update_time,
    d.department_name, r.role_name
FROM user u
LEFT JOIN department d ON u.dept_id = d.id
LEFT JOIN role r ON u.role_id = r.id
```

## 4. 条件片段共用

### 4.1 抽取通用查询条件
```xml
<!-- 定义通用查询条件 -->
<sql id="Where_Common_Condition">
    <where>
        <if test="username != null and username != ''">
            AND username LIKE CONCAT('%', #{username}, '%')
        </if>
        <if test="email != null and email != ''">
            AND email = #{email}
        </if>
        <if test="status != null">
            AND status = #{status}
        </if>
        <if test="minCreateTime != null">
            AND create_time >= #{minCreateTime}
        </if>
        <if test="maxCreateTime != null">
            AND create_time <= #{maxCreateTime}
        </if>
    </where>
</sql>

<!-- 使用通用条件 -->
<select id="selectByCondition" parameterType="map" resultMap="BaseResultMap">
    SELECT <include refid="Base_Column_List"/>
    FROM user
    <include refid="Where_Common_Condition"/>
    ORDER BY id DESC
</select>

<select id="countByCondition" parameterType="map" resultType="long">
    SELECT COUNT(*)
    FROM user
    <include refid="Where_Common_Condition"/>
</select>
```

## 5. 分页片段共用

### 5.1 定义分页片段
```xml
<!-- 分页片段 -->
<sql id="Page_Limit">
    <if test="pageSize != null and offset != null">
        LIMIT #{pageSize} OFFSET #{offset}
    </if>
    <if test="pageSize != null and offset == null and pageNum != null">
        LIMIT #{pageSize} OFFSET #{pageSize * (pageNum - 1)}
    </if>
</sql>

<!-- 排序片段 -->
<sql id="Order_By_Default">
    ORDER BY 
    <choose>
        <when test="orderBy != null and orderBy != ''">
            ${orderBy} 
            <if test="orderDirection != null and orderDirection != ''">
                ${orderDirection}
            </if>
        </when>
        <otherwise>
            id DESC  <!-- 默认排序 -->
        </otherwise>
    </choose>
</sql>
```

### 5.2 使用分页片段
```xml
<select id="selectByPage" parameterType="map" resultMap="BaseResultMap">
    SELECT <include refid="Base_Column_List"/>
    FROM user
    <include refid="Where_Common_Condition"/>
    <include refid="Order_By_Default"/>
    <include refid="Page_Limit"/>
</select>
```

## 6. 多表查询片段

### 6.1 关联表片段定义
```xml
<!-- 用户表列 -->
<sql id="User_Columns">
    u.id as user_id,
    u.username,
    u.email,
    u.real_name,
    u.phone,
    u.status as user_status,
    u.create_time as user_create_time
</sql>

<!-- 部门表列 -->
<sql id="Department_Columns">
    d.id as dept_id,
    d.dept_name,
    d.dept_code,
    d.manager_id
</sql>

<!-- 角色表列 -->
<sql id="Role_Columns">
    r.id as role_id,
    r.role_name,
    r.role_code
</sql>

<!-- 关联查询条件 -->
<sql id="Join_Condition">
    LEFT JOIN department d ON u.dept_id = d.id
    LEFT JOIN user_role ur ON u.id = ur.user_id
    LEFT JOIN role r ON ur.role_id = r.id
</sql>
```

### 6.2 复杂关联查询使用
```xml
<select id="selectUserDetail" parameterType="long" resultMap="UserDetailMap">
    SELECT 
    <include refid="User_Columns"/>,
    <include refid="Department_Columns"/>,
    <include refid="Role_Columns"/>
    FROM user u
    <include refid="Join_Condition"/>
    WHERE u.id = #{userId}
</select>

<select id="selectUserListWithDetail" parameterType="map" resultMap="UserDetailMap">
    SELECT 
    <include refid="User_Columns"/>,
    <include refid="Department_Columns"/>,
    <include refid="Role_Columns"/>
    FROM user u
    <include refid="Join_Condition"/>
    <where>
        <if test="deptId != null">
            AND u.dept_id = #{deptId}
        </if>
        <if test="roleCode != null">
            AND r.role_code = #{roleCode}
        </if>
        <if test="username != null">
            AND u.username LIKE CONCAT('%', #{username}, '%')
        </if>
    </where>
    ORDER BY u.id DESC
</select>
```

## 7. 动态SQL片段

### 7.1 条件性包含片段
```xml
<!-- 动态条件片段 -->
<sql id="Dynamic_Where_Condition">
    <where>
        <!-- 基础条件 -->
        <include refid="Where_Common_Condition"/>
        
        <!-- 扩展条件 -->
        <if test="extraConditions != null">
            <foreach collection="extraConditions" item="condition" index="key">
                AND ${key} = #{condition}
            </foreach>
        </if>
        
        <!-- 自定义SQL条件 -->
        <if test="customWhereSql != null and customWhereSql != ''">
            AND ${customWhereSql}
        </if>
    </where>
</sql>
```

## 8. 嵌套SQL片段

### 8.1 片段嵌套使用
```xml
<!-- 基础列片段 -->
<sql id="Base_Columns">
    id, name, code, status, create_time
</sql>

<!-- 扩展列片段（包含基础列） -->
<sql id="Extended_Columns">
    <include refid="Base_Columns"/>,
    description, sort_order, update_time, create_by, update_by
</sql>

<!-- 审计列片段 -->
<sql id="Audit_Columns">
    create_by, create_time, update_by, update_time
</sql>

<!-- 完整列片段（多层嵌套） -->
<sql id="Full_Columns">
    <include refid="Base_Columns"/>,
    description, sort_order,
    <include refid="Audit_Columns"/>
</sql>
```

## 9. 实际项目中的完整示例

### 9.1 完整的用户模块SQL片段
```xml
<!-- 用户模块SQL片段定义 -->
<sql id="User_Base_Columns">
    u.id, u.username, u.email, u.phone, u.real_name, 
    u.gender, u.age, u.birthday, u.avatar,
    u.status, u.dept_id, u.position
</sql>

<sql id="User_Audit_Columns">
    u.create_time, u.update_time, u.create_by, u.update_by
</sql>

<sql id="User_All_Columns">
    <include refid="User_Base_Columns"/>,
    <include refid="User_Audit_Columns"/>
</sql>

<sql id="User_Where_Common">
    <where>
        u.status != 'DELETED'
        <if test="username != null and username != ''">
            AND u.username LIKE CONCAT('%', #{username}, '%')
        </if>
        <if test="realName != null and realName != ''">
            AND u.real_name LIKE CONCAT('%', #{realName}, '%')
        </if>
        <if test="phone != null and phone != ''">
            AND u.phone = #{phone}
        </if>
        <if test="email != null and email != ''">
            AND u.email = #{email}
        </if>
        <if test="deptId != null">
            AND u.dept_id = #{deptId}
        </if>
        <if test="status != null and status != ''">
            AND u.status = #{status}
        </if>
        <if test="gender != null">
            AND u.gender = #{gender}
        </if>
        <if test="minAge != null">
            AND u.age >= #{minAge}
        </if>
        <if test="maxAge != null">
            AND u.age <= #{maxAge}
        </if>
        <if test="position != null and position != ''">
            AND u.position = #{position}
        </if>
    </where>
</sql>

<sql id="User_Join_Dept">
    LEFT JOIN department d ON u.dept_id = d.id
</sql>

<sql id="Dept_Columns">
    d.id as dept_id, d.dept_name, d.dept_code, d.parent_id, d.leader_id
</sql>

<sql id="User_Order_By">
    ORDER BY 
    <choose>
        <when test="orderBy == 'createTime'">
            u.create_time ${orderDirection}
        </when>
        <when test="orderBy == 'username'">
            u.username ${orderDirection}
        </when>
        <when test="orderBy == 'age'">
            u.age ${orderDirection}
        </when>
        <otherwise>
            u.id DESC
        </otherwise>
    </choose>
</sql>
```

### 9.2 使用完整片段的查询
```xml
<!-- 简单用户查询 -->
<select id="selectUserList" parameterType="map" resultMap="UserMap">
    SELECT 
    <include refid="User_All_Columns"/>
    FROM user u
    <include refid="User_Where_Common"/>
    <include refid="User_Order_By"/>
    <include refid="Page_Limit"/>
</select>

<!-- 用户详情查询（含部门信息） -->
<select id="selectUserDetail" parameterType="long" resultMap="UserDetailMap">
    SELECT 
    <include refid="User_All_Columns"/>,
    <include refid="Dept_Columns"/>
    FROM user u
    <include refid="User_Join_Dept"/>
    WHERE u.id = #{userId} AND u.status != 'DELETED'
</select>

<!-- 用户统计 -->
<select id="countUserByCondition" parameterType="map" resultType="long">
    SELECT COUNT(*)
    FROM user u
    <include refid="User_Where_Common"/>
</select>
```

## 10. 最佳实践和技巧

### 10.1 命名规范
```xml
<!-- 好的命名规范 -->
<sql id="User_Base_Columns">...</sql>          <!-- 模块_类型_用途 -->
<sql id="Where_Active_Users">...</sql>         <!-- 描述性名称 -->
<sql id="Order_By_Create_Time_Desc">...</sql>  <!-- 明确排序方式 -->
```

### 10.2 片段组织
```xml
<!-- 按功能组织SQL片段 -->
<!-- 基础列定义 -->
<sql id="Base_Columns">...</sql>
<sql id="Extended_Columns">...</sql>

<!-- 条件片段 -->
<sql id="Where_Common">...</sql>
<sql id="Where_Active">...</sql>

<!-- 关联片段 -->
<sql id="Join_Dept">...</sql>
<sql id="Join_Role">...</sql>

<!-- 排序分页 -->
<sql id="Order_Default">...</sql>
<sql id="Page_Limit">...</sql>
```

### 10.3 避免过度抽取
```xml
<!-- 适合抽取的情况 -->
<sql id="Base_Column_List">id, name, create_time</sql>  <!-- 多处使用 -->

<!-- 不适合抽取的情况 -->
<sql id="Single_Use_Condition">AND status = 1</sql>     <!-- 只在一处使用 -->
```

## 11. 高级用法

### 11.1 条件性包含片段
```xml
<!-- 根据条件决定包含哪个片段 -->
<select id="dynamicQuery" parameterType="map" resultMap="BaseResultMap">
    SELECT * FROM user
    <where>
        <choose>
            <when test="queryType == 'simple'">
                <include refid="Where_Simple_Condition"/>
            </when>
            <when test="queryType == 'advanced'">
                <include refid="Where_Advanced_Condition"/>
            </when>
            <otherwise>
                <include refid="Where_Default_Condition"/>
            </otherwise>
        </choose>
    </where>
</select>
```

### 11.2 片段参数化
```xml
<!-- 更灵活的参数传递 -->
<sql id="Column_List_With_Table">
    ${tableName}.id, 
    ${tableName}.name,
    ${tableName}.create_time
</sql>

<select id="selectFromTable" parameterType="map" resultMap="BaseResultMap">
    SELECT 
    <include refid="Column_List_With_Table">
        <property name="tableName" value="t"/>
    </include>
    FROM ${tableName} t
</select>
```

## 12. 总结

### SQL片段抽取的好处：
1. **代码复用**：避免重复编写相同的SQL
2. **维护方便**：修改一处，所有引用处自动更新
3. **结构清晰**：SQL逻辑分层，易于理解
4. **减少错误**：统一的列名和条件，避免拼写错误

### 抽取原则：
- **高频使用**的SQL代码优先抽取
- **逻辑完整**的代码块作为一个片段
- **合理命名**，见名知意
- **适度抽象**，避免过度设计
