# CI/CD 文档导航

欢迎！这里是 Bondee 项目的 CI/CD 完整文档集合。

## 🚀 快速导航

### 👉 我想快速上手

→ **[快速开始指南](./CICD_QUICKSTART.md)** - 30 分钟完成配置

### 👉 我想深入理解 CI/CD

→ **[CI/CD 完整指南](./CICD_GUIDE.md)** - 详细解释每个步骤和原理

### 👉 我想看架构图

→ **[架构和流程图](./CICD_ARCHITECTURE.md)** - 可视化流程

### 👉 我在配置过程中遇到问题

→ **[配置检查清单](./CICD_CHECKLIST.md)** - 逐项验证配置

### 👉 我需要日常运维操作指南

→ **[运维手册](./OPERATIONS.md)** - 监控、日志、维护

### 👉 我需要回滚到旧版本

→ **[回滚指南](./ROLLBACK_GUIDE.md)** - 版本回滚流程

## 📚 文档列表

| 文档                                 | 内容概要                                                   | 预计阅读时间 |
| ------------------------------------ | ---------------------------------------------------------- | ------------ |
| **[快速开始](./CICD_QUICKSTART.md)** | 三步完成部署：服务器配置、GitHub 配置、测试部署            | 5 分钟       |
| **[完整指南](./CICD_GUIDE.md)**      | CI/CD 概念、服务器配置、GitHub Actions、脚本编写、问题排查 | 30 分钟      |
| **[架构图](./CICD_ARCHITECTURE.md)** | 架构图、流程图、数据流、工作原理可视化                     | 10 分钟      |
| **[检查清单](./CICD_CHECKLIST.md)**  | 服务器配置清单、GitHub 配置清单、测试清单                  | 15 分钟      |
| **[运维手册](./OPERATIONS.md)**      | 日常运维、监控、日志查看、故障处理                         | 按需查阅     |
| **[回滚指南](./ROLLBACK_GUIDE.md)**  | 版本回滚、备份恢复、紧急处理                               | 按需查阅     |

## 🎯 学习路径

### 路径 1: 快速实践（推荐新手）

1. **[快速开始](./CICD_QUICKSTART.md)** - 先跑起来
2. **[检查清单](./CICD_CHECKLIST.md)** - 验证配置
3. **[完整指南](./CICD_GUIDE.md)** - 理解原理
4. **[架构图](./CICD_ARCHITECTURE.md)** - 加深理解

### 路径 2: 系统学习（希望深入理解）

1. **[完整指南](./CICD_GUIDE.md)** - 学习概念和原理
2. **[架构图](./CICD_ARCHITECTURE.md)** - 可视化理解
3. **[快速开始](./CICD_QUICKSTART.md)** - 动手实践
4. **[检查清单](./CICD_CHECKLIST.md)** - 查漏补缺

### 路径 3: 问题排查

1. **[检查清单](./CICD_CHECKLIST.md)** - 系统性检查
2. **[完整指南](./CICD_GUIDE.md)** - 查看"常见问题"章节
3. **[运维手册](./OPERATIONS.md)** - 查看日志和监控

## 🔧 配置文件说明

| 文件路径                        | 作用                      | 参考文档                                                |
| ------------------------------- | ------------------------- | ------------------------------------------------------- |
| `/.github/workflows/deploy.yml` | GitHub Actions 工作流配置 | [完整指南](./CICD_GUIDE.md#第四阶段配置-github-actions) |
| `/scripts/deploy.sh`            | 服务器端部署脚本          | [完整指南](./CICD_GUIDE.md#第三阶段编写部署脚本)        |
| `/scripts/init-server.sh`       | 服务器初始化脚本          | [快速开始](./CICD_QUICKSTART.md#第一步服务器配置)       |
| `/nginx.conf.example`           | Nginx 配置示例            | [完整指南](./CICD_GUIDE.md#步骤-18配置-nginx-虚拟主机)  |

## 💡 温馨提示

### ⚠️ 注意事项

1. **私钥安全**：SSH 私钥绝对不能提交到代码仓库
2. **分支名称**：确保 workflow 中的分支名与实际分支一致
3. **IP 配置**：记得修改配置文件中的占位符（IP、域名、仓库地址）
4. **防火墙**：阿里云需要在控制台开放端口
5. **备份重要**：每次部署前都会自动备份，保留最近 5 个版本

### 🎓 学习目标

通过这套 CI/CD 流程，你将学会：

- ✅ Linux 服务器基础操作
- ✅ Nginx Web 服务器配置
- ✅ GitHub Actions 自动化
- ✅ Shell 脚本编写
- ✅ SSH 密钥认证
- ✅ Git 工作流
- ✅ 服务器运维基础

### 📈 后续优化方向

完成基础配置后，可以继续学习：

- 环境分离（dev、staging、production）
- HTTPS 配置（Let's Encrypt）
- CDN 加速（阿里云 OSS + CDN）
- 监控告警（服务器监控、网站可用性）
- Docker 容器化部署
- 自动化测试集成

## 🆘 获取帮助

### 常见问题

大部分问题可以在以下章节找到答案：

- [完整指南 - 常见问题排查](./CICD_GUIDE.md#常见问题排查)
- [检查清单 - 如果某项检查失败](./CICD_CHECKLIST.md#如果某项检查失败)

### 调试技巧

1. **查看 GitHub Actions 日志**：仓库 → Actions → 点击具体的 workflow run
2. **查看服务器日志**：
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```
3. **手动执行部署**：
   ```bash
   cd /var/www/bondee && bash scripts/deploy.sh
   ```

## 📝 文档维护

- **创建日期**：2025-12-13
- **适用版本**：Node.js 20+, Vite 7, React 19
- **服务器环境**：Ubuntu 20.04+, Nginx, 阿里云
- **最后更新**：2025-12-13

---

**祝你学习愉快！** 🎉

如有任何问题，欢迎提 Issue 或参考文档中的故障排查章节。
