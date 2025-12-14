# 全站 CDN 部署说明

本项目已配置为**全站 CDN** 模式，所有静态资源（HTML、CSS、JS、图片、视频）都通过阿里云 CDN 加速。

## 🌐 访问方式

- **CDN 地址**: https://cdn.slyai.top/
- **首页**: https://cdn.slyai.top/index.html

## 📦 部署流程

每次推送代码到 `main` 分支时，GitHub Actions 会自动：

1. ✅ 安装依赖
2. ✅ 代码质量检查
3. ✅ 构建项目（注入 `VITE_CDN_URL`）
4. ✅ 上传全站资源到阿里云 OSS
5. ✅ 通过 CDN 加速访问

## 🔧 配置要求

### GitHub Secrets

需要在仓库 Settings → Secrets and variables → Actions 中配置：

| Secret 名称                | 说明                    | 示例值           |
| -------------------------- | ----------------------- | ---------------- |
| `ALIYUN_ACCESS_KEY_ID`     | 阿里云 AccessKey ID     | `LTAI5t...`      |
| `ALIYUN_ACCESS_KEY_SECRET` | 阿里云 AccessKey Secret | `xxx...`         |
| `ALIYUN_OSS_BUCKET`        | OSS Bucket 名称         | `slyai-assets`   |
| `ALIYUN_OSS_REGION`        | OSS 地域                | `oss-cn-beijing` |
| `CDN_DOMAIN`               | CDN 加速域名            | `cdn.slyai.top`  |

### 阿里云配置

1. **OSS Bucket**: 已创建并设置为公共读
2. **CDN 域名**: `cdn.slyai.top` 已配置并指向 OSS
3. **CNAME 记录**: DNS 中已添加 `cdn.slyai.top` 的 CNAME 记录

## 🚀 本地开发

### 开发模式

```bash
# 使用本地资源
pnpm dev
```

访问 `http://localhost:5173`，所有资源从本地加载。

### 生产预览（模拟 CDN）

```bash
# 使用 CDN URL 构建
VITE_CDN_URL=https://cdn.slyai.top/ pnpm build

# 预览构建结果
pnpm preview
```

**注意**: 本地预览时，资源路径会指向 CDN，因此需要先上传资源到 OSS。

## 📤 手动上传到 CDN

如果需要手动部署：

```bash
# 1. 构建项目
VITE_CDN_URL=https://cdn.slyai.top/ pnpm build

# 2. 上传到 OSS（确保已配置 ossutil）
./scripts/upload-to-cdn.sh
```

## 🔄 刷新 CDN 缓存

更新资源后，如需立即生效：

1. 访问 [阿里云 CDN 控制台](https://cdn.console.aliyun.com/)
2. 点击**刷新预热** → **刷新**
3. 选择**目录**，输入: `https://cdn.slyai.top/`
4. 点击**提交**

通常 5-10 分钟内缓存刷新完成。

## 📊 性能监控

### 查看 CDN 流量

- 访问阿里云 CDN 控制台
- 查看**数据分析** → **流量带宽**

### 查看 OSS 存储

- 访问阿里云 OSS 控制台
- 查看 Bucket 使用情况

## ⚠️ 注意事项

### 1. 环境变量

- ✅ **生产环境**: `VITE_CDN_URL=https://cdn.slyai.top/`（结尾必须有 `/`）
- ✅ **本地开发**: `VITE_CDN_URL=/` 或不设置

### 2. 资源路径

全站 CDN 模式下，**直接使用相对路径即可**：

```tsx
// ✅ 正确 - Vite 会自动处理
<img src="/assets/images/logo.png" />

// ❌ 错误 - 不需要手动拼接 CDN 地址
<img src="https://cdn.slyai.top/assets/images/logo.png" />
```

### 3. 服务器状态

- 全站 CDN 模式下，**不再需要服务器提供静态资源**
- 如需保留服务器作为备用，可取消注释 GitHub Actions 中相关步骤

### 4. 成本控制

- OSS 存储费用：约 ￥ 0.12/GB/月
- CDN 流量费用：约 ￥ 0.24/GB（中国内地）
- 建议在阿里云控制台设置费用预警

## 🔙 回滚方案

### 回滚到服务器部署

如需回退到传统的服务器部署模式：

1. 修改 `vite.config.ts`，移除或注释 `base` 配置
2. 修改 `.github/workflows/deploy.yml`，恢复服务器上传步骤
3. 推送代码重新部署

### 回滚到旧版本资源

在阿里云 OSS 控制台可以查看文件历史版本（如已开启版本控制）。

## 📚 相关文档

- [CDN_SETUP.md](../docs/CDN_SETUP.md) - 阿里云 OSS 和 CDN 配置指南
- [CDN_DEPLOYMENT.md](../docs/CDN_DEPLOYMENT.md) - CDN 部署详细说明
- [CDN_INDEX.md](../docs/CDN_INDEX.md) - CDN 文档导航

## 🆘 常见问题

### Q1: 部署后页面无法访问？

1. 检查 CDN CNAME 是否配置正确
2. 验证 DNS 解析是否生效：`dig cdn.slyai.top`
3. 检查 OSS Bucket 权限是否设置为公共读

### Q2: 资源 404 错误？

1. 确认资源已上传到 OSS
2. 检查资源路径是否正确（区分大小写）
3. 刷新 CDN 缓存

### Q3: 更新后看到的还是旧版本？

1. 浏览器缓存：按 Ctrl+F5 强制刷新
2. CDN 缓存：在控制台手动刷新缓存
3. 等待 5-10 分钟让缓存自然过期

### Q4: GitHub Actions 部署失败？

1. 检查 GitHub Secrets 是否正确配置
2. 查看 Actions 日志，找到具体错误信息
3. 验证 ossutil 是否正确安装和配置

---

**最后更新**: 2025-12-13  
**部署模式**: 全站 CDN  
**CDN 域名**: cdn.slyai.top
