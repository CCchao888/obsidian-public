# 教程
- [官方快速入门](https://github.com/ScoopInstaller/Scoop/wiki/Quick-Start)
- [Scoop 上手教程_推荐](https://blog.bling.moe/post/11/)
- [CS自学指南-Scoop](https://csdiy.wiki/%E5%BF%85%E5%AD%A6%E5%B7%A5%E5%85%B7/Scoop/)

# 安装
Scoop 需要 [Windows PowerShell 5.1](https://aka.ms/wmf5download) 或者 [PowerShell](https://aka.ms/powershell) 作为运行环境
- 如果使用的是 Windows 10 及以上版本，Windows PowerShell 是内置在系统中的。
- 而 Windows 7 内置的 Windows PowerShell 版本过于陈旧，需要手动安装新版本的 PowerShell。

 进行安装：
1. **放开权限**：先让系统允许你运行脚本。
2. **下载安装包**：把安装程序从网上拖到你的电脑里。
3. **运行安装**：运行这个安装程序，并**自定义安装位置**。
	1. 自定义安装路径，之后从scoop安装的软件也在这个目录
	2. 建议 D 盘，如果在 C 盘重装系统后会被删除。
```
# 设置 PowerShell 执行策略 
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser 

# 下载安装脚本 
irm get.scoop.sh -outfile 'install.ps1' 

# 执行安装, --ScoopDir 参数指定 Scoop 安装路径 
.\install.ps1 -ScoopDir 'D:\Scoop'
```

# 基础
Scoop: window系统的包管理器，可以帮忙统一安装和管理开发软件，省去手动下载安装、环境变量配置等等。

