---
title: "用Codex、cursor 还是Claude ？程序员不作选择题，我都要用，还一起用"
source: "https://jspang.com/article/54"
author:
published: 2026-07-28
created: 2026-07-29
description: "15 年资深程序员，B站40万+粉丝，知识区优质UP主。产出800多集编程AI相关教程。现深耕 AI 开发赛道，专注 Agent、Skill 工程与 Vibe Coding 实战，拆解 CodeX、Claude 等主流 AI 编程工具，输出可落地实战方案，面向开发者分享高效 AI 编码工作流。"
tags:
  - "clippings"
---
<iframe src="https://player.bilibili.com/player.html?isOutside=true&amp;aid=116996217838997&amp;bvid=BV1Tv3i6LEX1&amp;cid=40369521009&amp;p=1" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

## 开场叙事

### 文章稿（文章整理）

如果能把 Codex、Claude Code、Grok、Cursor 等智能编程工具整合到同一个工作环境中，再让多个 Agent 像团队成员一样分工协作，软件开发的效率将得到显著提升。Orca ADE 正是为此而生：它是一款开源、免费的 Agent 开发环境，专注于代码管理与命令行工作流，不仅能够接入多种编程 Agent，还支持语音操作和手机远程管理。接下来，我们就来认识一下 Orca ADE，看看它如何把原本各自独立的 AI 编程工具，组织成一支可以协同工作的“智能开发团队”。

> Gitub地址：https://github.com/stablyai/orca

![call_s5C5eL6VLW0XwHnysPcjGAwT.png](https://jspang.com/images/8544eb62f8cb49e2839154119c7ea468.webp)

（

## 一、Orca ADE安装方法

直接到Github上找到下载链接。点击下载，再点击安装，在我说完这句话的时候，就已经安装完成了。因为视频可以剪辑，我想多快就多快。

安装的时候会问你些问题，比如用什么作为主智能体、什么颜色模式、配置Github cli, 选择本地项目。这些每个人都不一样，所以就不做展示了。（画外音：你就懒吧，就这样谁给你点赞！！！）

不点赞我可以送东西啊。  
1\. 中国信通院出品的《 2026智能经济新形态：智能体创新实践汇编》共315页  
2\. InfoQ出品的《2026中国AI产业核心要素出海发展白皮书》共40页  
3\. 新战略咨询出品的《2026年50+人形机器人场景应用落地图谱》共55页

我就问你，这三个东西，我能不能站着，把赞要了。

## 二、没有ADE，多智能体协作会发生什么

在没有ADE这个概念时，你使用多个智能体会发生下面的问题。

- **Agent 公用目录** ：并发修改相互覆盖，工作树迅速失控。
- **状态不透明** ：无法可靠判断哪个Agent正在工作、完成或者是挂起
- **依赖顺序靠记忆** ：整个开发顺序已经Agent分配完全靠人工维护。
- **结果难以比较** ：不同实现没有干净的边界，人类机会没办法Review。

![call_nl41YGPDrBQ3rQ7AROKl1MIk.png](https://jspang.com/images/1d53399b2ad543f9af6860b866ba386a.webp)  
这些问题一直在脑袋里旋转时，就会让项目变的越来越乱，没办法维护。或者放弃多Agent开发。

为什么叫ADE，什么是ADE。就是现在程序员为了显得更专业，新造的一个词。意思是智能体开发环境，核心是“帮助程序员管理AI写代码”。  
用一句话说：IDE 是程序员亲自干活的工作台，ADE 是程序员带领一群 AI 干活的指挥部。

它有下面三个明显的优势。

- 为每个 Agent 隔离工作目录
- 查看任务状态和代码差异
- 协调、比较并合并多个 Agent 的成果

![call_IINW2LN3xPKOIcYEZlfnRzxe.png](https://jspang.com/images/f437e561f93744419bbf3a82221bfb8a.webp)

## 三、特点介绍

### 1\. 在Orca 里集成多个智能体

Orca里可以使用31个AI智能体，我给你看一下目前支持的列表。可以看到，这些里边，主流的Agent都包括了。我就以Codex 和Claude Code 为例，给大家做个演示。

直接点击ADE上面的“+”号，工具，就可以调用不同职能体的终端，我这里打开了Codex 和 Claude Code.

你可以点击左下角的“设置”按钮，启动更多的智能体，根据需要，自己开启吧。不墨迹，直接讲一下一个特点。

### 2\. 多智能体合作开发

当集成好了之后，就可以点击上面的“+”号，然后呼出不同的智能体为你工作了。这时候我同时调出了Codex和Claude ，Claude 我用了Deepseek作为底模。

为啥Claude 用DeepSeek的底模？聊起来都是眼泪啊，我既想装的像个AI大神，但是无奈囊中羞涩，所以就出现了这个组合。

我的想法是让DeepSeek来给开发建议，让Codex来执行。比如我和Codex说，你看这个视频页面还有什么可以优化的吗？  
它就会给我一些建议，这时候写代码的重任，我再交给Codex来完成。把写好的修改需求，直接复制过去。就可以完成开发了。

![call_o1qLEEB0RwHPnN9BOoZgPiM5.png](https://jspang.com/images/20b6315461764554969fe940a81cb2c5.webp)

当然你还可以更省钱一些，把代码先让Codex跑一边，如果遇到问题了，没跑成功，再换成Codex跑就可以了。

### 3\. 支持手机控制

也就是说我们可以吃着火锅，唱着歌，就把代码写好了。现在它支持IPhone手机和Android手机端。

我测试了一下，苹果手机连接没有成功，一直显示try again 。而安卓手机按照步骤连接成功。

但安卓手机我一直就是个测试机，基本不带出门，而苹果手机才带出门。所以小伙伴有成功的也可以教教我。你们是如何连接成功的。

![call_VfehKDHBVZFqgCMp6jrRAJ8B.png](https://jspang.com/images/5b4cef69de7f467191390901cf71665a.webp)

## 最后总结

如果你有很多智能体，并想让他们有序工作。这个工具还是可以帮上大忙。有这种需求的小伙伴可以试试。