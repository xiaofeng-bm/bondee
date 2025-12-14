# CDN 配置文档索引

本目录包含 CDN 配置和部署的完整指南文档。

## 📚 文档列表

### 1. [CDN_SETUP.md](./CDN_SETUP.md)

**阿里云 OSS 和 CDN 配置指南**

详细说明如何在阿里云控制台配置 OSS 存储和 CDN 加速服务。

**内容包括：**

- 创建 OSS Bucket
- 配置 CDN 加速域名
- 设置子域名 CNAME 记录
- 配置 HTTPS 和缓存策略
- 获取访问密钥
- 安装和配置 ossutil 工具

**适合人群：** 首次配置阿里云 CDN 的用户

---

### 2. [CDN_DEPLOYMENT.md](./CDN_DEPLOYMENT.md)

**CDN 部署实施指南**

说明如何修改项目代码以支持 CDN，包括代码修改、资源上传和 CI/CD 集成。

**内容包括：**

- 创建环境变量配置
- 修改 Vite 配置
- 创建 CDN 工具函数
- 更新组件代码
- 创建资源上传脚本
- 配置 GitHub Actions
- 验证部署

**适合人群：** 已完成阿里云配置，准备修改代码的开发者

---

## 🚀 快速开始

### 步骤概览

1. **阿里云配置**（约 30 分钟）

   - 按照 [CDN_SETUP.md](./CDN_SETUP.md) 配置 OSS 和 CDN
   - 记录 AccessKey 和配置信息

2. **代码实施**（约 1 小时）

   - 按照 [CDN_DEPLOYMENT.md](./CDN_DEPLOYMENT.md) 修改项目
   - 配置 GitHub Secrets
   - 更新 CI/CD 工作流

3. **验证部署**（约 15 分钟）
   - 本地测试
   - 生产环境验证
   - 性能对比

**总计：约 1.5-2 小时**

---

## 📋 前置条件检查清单

开始之前，请确保满足以下条件：

- [ ] 拥有阿里云账号（已实名认证）
- [ ] 域名 `slyai.top` 已完成 ICP 备案
- [ ] 具有域名 DNS 管理权限
- [ ] 已安装 Node.js 和 pnpm
- [ ] 已克隆项目到本地
- [ ] 具有 GitHub 仓库的 Settings 权限

---

## 🎯 实施方案说明

### 当前方案：渐进式 CDN 迁移

**迁移范围：**

- ✅ 图片资源（4 个 SVG/PNG 文件）
- ✅ 视频资源（4 个 MP4/MOV 文件）
- ❌ HTML/CSS/JS（保持在服务器）

**优势：**

- 实施简单，风险低
- 效果明显（媒体文件通常占用 80% 流量）
- 不影响现有部署流程
- 可随时回滚

**后续优化：**
完成初步迁移后，可考虑：

- 将所有静态资源迁移到 CDN（全站 CDN）
- 启用图片处理和视频转码
- 配置 CDN 预热和智能压缩

---

## 🔗 相关资源

### 官方文档

- [阿里云 OSS 文档](https://help.aliyun.com/product/31815.html)
- [阿里云 CDN 文档](https://help.aliyun.com/product/27099.html)
- [Vite 环境变量](https://vitejs.dev/guide/env-and-mode.html)

### 项目文档

- [CICD_GUIDE.md](./CICD_GUIDE.md) - CI/CD 完整指南
- [CICD_QUICKSTART.md](./CICD_QUICKSTART.md) - CI/CD 快速开始

---

## ❓ 需要帮助？

### 常见问题

请参考各文档末尾的"常见问题"部分。

### 问题排查

1. 检查阿里云控制台的配置
2. 验证 DNS CNAME 记录是否生效
3. 查看 GitHub Actions 构建日志
4. 检查浏览器开发者工具的 Network 面板

### 回滚方案

如遇到问题，可快速回滚：

- 临时回滚：移除 `VITE_CDN_URL` 环境变量
- 完整回滚：Git revert 到迁移前版本

详见 [CDN_DEPLOYMENT.md](./CDN_DEPLOYMENT.md) 的"回滚方案"章节。

---

## 📊 预期效果

### 性能提升

- 图片加载时间：减少 50%-70%
- 视频加载时间：减少 60%-80%
- 首次内容绘制（FCP）：提升 30%-50%

### 成本估算

基于 1000 次访问/月：

- OSS 存储：~￥ 0.01/月
- CDN 流量：~￥ 5/月
- **总计：~￥ 5/月**

_实际费用取决于访问量_

---

**最后更新：** 2025-12-13  
**维护者：** Bondee Team
