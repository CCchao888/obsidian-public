
## LLM原理
https://www.bilibili.com/video/BV1NCgVzoEG9?spm_id_from=333.788.recommend_more_video.0&trackid=web_related_0.router-related-2479604-gjmc5.1773499446371.429&vd_source=691f67d5ccda785d30586a2a906cdd1b

functions describes the world:
- x  ->   f(x)  ->  y
- 现在的各种大模型都是基于理论 transformer，和他的实现 llama
- 各种模型的模型结构都来自鼻祖 llama

LLM 本质就是词语接龙，==不断输出下一个字==：
- f(a, b) = c 然后继续 f(a, b, c) = d  继续 f(a, b, c, d) = e
- **大模型llm/推理服务** 本质就是一个超大文件，放在磁盘里面（装的就是训练时学到的知识参数），加载到内存，对外暴露HTTP接口，接收用户请求后**做推理**返回结果
	- **推理服务本质上是HTTP服务**，不保存任何状态；且为了扛住高并发会部署多个推理服务实例，做负载均衡；
	- 为了实现记忆功能，实际上会把同一个聊天内以前的对话重新拼到当前对话（即上下文），一起发给llm
		- 拼接的完整上下文可能太长，实际上做分类管理：
			- 短期记忆：最近几次对话做完整保存
			- 长期记忆：更久远的对话压缩取摘要
- 大模型的知识来源：大模型的训练数据都是互联网上公开的历史数据，训练完成后知识就固定了；为了获得更多知识，支持联网搜索和外部知识库：
	- 外部知识库/检索增强生成/RAG：用户提问时，先从知识库做匹配，获得相关知识再一起喂给llm；这样子llm就可以基于外部知识回答
		- 普通数据库只能做字面匹配，llm需要字义匹配，所以需要将文本转成向量，使用向量距离衡量语义相似度
		- 因此RAG数据库存的是向量数据，也就向量数据库
![[Pasted image 20260315011324.png]]

![[Pasted image 20260315011211.png]]

![[Pasted image 20260315011021.png]]



transformer的基本原理：
- embedding：文本分词，词进行向量化，转成向量（即一组数字）
- transformer block：通过注意力机制的计算方法，让原来输入的词向量加入其他的词向量，同样输出词向量
- Probabilities: 得到每个词的分数，分数再根据温度和Top-k等控制参数，最终输出每个词的概率，作为下一个词的可能性





## 开源模型

开源的是什么：可调整参数的函数![[Pasted image 20260314223100.png]]
- 模型结构：
- 模型权重：

## AI Agent
### 概览
https://www.bilibili.com/video/BV1ojfDBSEPv/?spm_id_from=333.1007.top_right_bar_window_history.content.click&vd_source=691f67d5ccda785d30586a2a906cdd1b

![[Pasted image 20260315002427.png]]



![[Pasted image 20260314173718.png]]



![[Pasted image 20260314180214.png]]


### skills
https://www.bilibili.com/video/BV162cPzhEGU/?spm_id_from=333.337.search-card.all.click&vd_source=691f67d5ccda785d30586a2a906cdd1b

提示词：系统提示词优先级更高
- 系统提示词：一般客户端可设置比如 claude.md 文件
- 用户提示词：用户输入的

skills：本质上就是系统提示词工程化 / 操作手册、操作经验
- 常用的用户提示词   -->  以文件.md形式存在的系统提示词
- 入口md: 包含metadata 和 入口路由
	- 入口路由：指向各个拆分文件
- agent 先发各个metadata给llm，llm确定需要哪些文件
	- 实现按条件和场景加载数据，减少token消耗
- ![[Pasted image 20260315004637.png]]
- ![[Pasted image 20260315004519.png]]
- ![[Pasted image 20260315004229.png]]


### Claude code



### Openclaw
https://www.bilibili.com/video/BV1sSF6z3Eku?spm_id_from=333.788.videopod.sections&vd_source=691f67d5ccda785d30586a2a906cdd1b


