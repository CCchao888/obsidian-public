
```
SELECT *
FROM warning_cfg
WHERE country = #{country}
  AND product_series = #{series}
  AND product IN (#{product}, 'ALL')
  AND model   IN (#{model},   'ALL')
  AND status = 1
ORDER BY (product = #{product}) DESC, (model = #{model}) DESC
LIMIT 1;

```

性能考虑与更稳定/高效的替代方案：：拆成多个按优先级的查询（`UNION ALL` 或 按顺序尝试），每次都做等值匹配，这样可以利用复合唯一索引直接定位到一行并尽快返回：
```
-- 1. 最具体（product=model=具体）
SELECT * FROM warning_cfg
 WHERE country = #{country}
   AND product_series = #{series}
   AND product = #{product}
   AND model = #{model}
   AND status = 1
LIMIT 1

UNION ALL

-- 2. product=具体, model=ALL
SELECT * FROM warning_cfg
 WHERE country = #{country}
   AND product_series = #{series}
   AND product = #{product}
   AND model = 'ALL'
   AND status = 1
LIMIT 1

UNION ALL

-- 3. product=ALL, model=具体
SELECT * FROM warning_cfg
 WHERE country = #{country}
   AND product_series = #{series}
   AND product = 'ALL'
   AND model = #{model}
   AND status = 1
LIMIT 1

UNION ALL

-- 4. 全通配
SELECT * FROM warning_cfg
 WHERE country = #{country}
   AND product_series = #{series}
   AND product = 'ALL'
   AND model = 'ALL'
   AND status = 1
LIMIT 1

-- 然后外层取 LIMIT 1（或在应用层按顺序执行四个子查询，遇到结果就返回）

```

把优先级映射成一个分数，直观、扩展性强：
```
SELECT *
FROM warning_cfg
WHERE country = #{country}
  AND product_series = #{series}
  AND product IN (#{product}, 'ALL')
  AND model   IN (#{model},   'ALL')
  AND status = 1
ORDER BY CASE
           WHEN product = #{product} AND model = #{model} THEN 3
           WHEN product = #{product} AND model = 'ALL'   THEN 2
           WHEN product = 'ALL'      AND model = #{model} THEN 1
           ELSE 0
         END DESC
LIMIT 1;

```