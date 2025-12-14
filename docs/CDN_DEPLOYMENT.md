# CDN 部署实施指南

本指南说明如何将项目静态资源迁移到阿里云 CDN，包括代码修改、资源上传和 CI/CD 集成。

> **前置条件**  
> 确保已完成 [CDN_SETUP.md](./CDN_SETUP.md) 中的阿里云配置步骤。

## 📋 实施概览

本次迁移采用**渐进式方案**：仅迁移图片和视频到 CDN，HTML/CSS/JS 保持不变。

### 涉及的资源

#### 图片资源（4 个）

- `/assets/images/app-store.svg`
- `/assets/images/google-play.svg`
- `/assets/images/banner.png`
- `/assets/images/virtual-self.png`

#### 视频资源（4 个）

- `/assets/videos/hero-bg.mp4`
- `/assets/videos/dress-up.mov`
- `/assets/videos/interact.mov`
- `/assets/videos/party.mov`

### 涉及的文件

需要修改的组件：

- `src/components/Hero.tsx`
- `src/components/About.tsx`
- `src/components/DownloadCTA.tsx`
- `src/pages/Features.tsx`

---

## 第一步：创建环境变量配置

### 1.1 创建 `.env.example`

在项目根目录创建环境变量示例文件：

```bash
# .env.example

# ========================================
# CDN 配置
# ========================================

# 本地开发时留空，使用本地资源
# 生产环境设置为 CDN 域名
VITE_CDN_URL=

# 生产环境配置示例：
# VITE_CDN_URL=https://cdn.slyai.top
```

### 1.2 创建 `.env`（本地开发）

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

本地开发时保持 `VITE_CDN_URL` 为空即可。

### 1.3 更新 `.gitignore`

确保 `.env` 文件不被提交：

```bash
# 检查 .gitignore 中是否包含
cat .gitignore | grep ".env"

# 如果没有，添加
echo ".env" >> .gitignore
```

---

## 第二步：修改 Vite 配置

编辑 `vite.config.ts`，添加环境变量定义：

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 定义环境变量，使其在客户端代码中可用
  define: {
    "import.meta.env.VITE_CDN_URL": JSON.stringify(process.env.VITE_CDN_URL || ""),
  },
});
```

---

## 第三步：创建 CDN 工具函数

### 3.1 创建工具文件

创建 `src/utils/cdn.ts`：

```typescript
/**
 * 获取静态资源的完整 URL
 *
 * @param path - 资源路径，如 /assets/images/logo.png
 * @returns 完整的资源 URL
 *
 * @example
 * // 本地开发（VITE_CDN_URL 为空）
 * getAssetUrl('/assets/images/logo.png')
 * // => '/assets/images/logo.png'
 *
 * // 生产环境（VITE_CDN_URL = 'https://cdn.slyai.top'）
 * getAssetUrl('/assets/images/logo.png')
 * // => 'https://cdn.slyai.top/assets/images/logo.png'
 */
export function getAssetUrl(path: string): string {
  const cdnUrl = import.meta.env.VITE_CDN_URL as string;

  // 如果配置了 CDN，使用 CDN URL
  if (cdnUrl) {
    // 确保 CDN URL 不以 / 结尾
    const baseUrl = cdnUrl.replace(/\/$/, "");
    // 确保路径以 / 开头
    const assetPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${assetPath}`;
  }

  // 否则使用本地路径
  return path;
}
```

### 3.2 创建类型定义（可选）

如果使用 TypeScript，创建 `src/vite-env.d.ts`（如果还不存在）：

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CDN_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 第四步：更新组件代码

将所有硬编码的资源路径改为使用 `getAssetUrl()` 函数。

### 4.1 更新 `src/components/Hero.tsx`

```typescript
import { getAssetUrl } from '../utils/cdn'

// ...

// 修改前：
<img src="/assets/images/app-store.svg" alt="App Store" className="w-6 h-6" />

// 修改后：
<img src={getAssetUrl('/assets/images/app-store.svg')} alt="App Store" className="w-6 h-6" />

// 视频同理：
<source src={getAssetUrl('/assets/videos/hero-bg.mp4')} type="video/mp4" />
```

### 4.2 更新其他组件

同样的方式更新：

- `src/components/About.tsx`
- `src/components/DownloadCTA.tsx`
- `src/pages/Features.tsx`

**批量替换命令（仅供参考）**：

```bash
# 在 src 目录下查找所有引用
grep -r "/assets/" src/

# 手动修改每个文件，添加 getAssetUrl() 包装
```

---

## 第五步：创建资源上传脚本

### 5.1 创建上传脚本

创建 `scripts/upload-assets.sh`：

```bash
#!/bin/bash

# ========================================
# 阿里云 OSS 资源上传脚本
# ========================================

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量（从环境变量读取）
OSS_BUCKET="${ALIYUN_OSS_BUCKET:-slyai-assets}"
OSS_REGION="${ALIYUN_OSS_REGION:-oss-cn-beijing}"
OSS_ENDPOINT="${OSS_REGION}.aliyuncs.com"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}阿里云 OSS 资源上传${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 ossutil 是否安装
if ! command -v ossutil &> /dev/null; then
    echo -e "${RED}❌ 错误: ossutil 未安装${NC}"
    echo "请先安装 ossutil: https://help.aliyun.com/document_detail/120075.html"
    exit 1
fi

# 检查是否已配置
if [ ! -f ~/.ossutilconfig ]; then
    echo -e "${RED}❌ 错误: ossutil 未配置${NC}"
    echo "请先运行: ossutil config"
    exit 1
fi

# 检查构建产物是否存在
if [ ! -d "dist/assets" ]; then
    echo -e "${RED}❌ 错误: dist/assets 目录不存在${NC}"
    echo "请先运行: pnpm run build"
    exit 1
fi

# 上传资源
echo -e "${YELLOW}📤 开始上传静态资源到 OSS...${NC}"
echo "Bucket: oss://${OSS_BUCKET}"
echo "Region: ${OSS_REGION}"
echo ""

# 上传整个 assets 目录
ossutil cp -r dist/assets/ oss://${OSS_BUCKET}/assets/ \
  --update \
  --config-file ~/.ossutilconfig

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ 上传成功！${NC}"
    echo ""
    echo "资源访问地址："
    echo "  - OSS: https://${OSS_BUCKET}.${OSS_ENDPOINT}/assets/"
    echo "  - CDN: https://cdn.slyai.top/assets/"
else
    echo -e "${RED}❌ 上传失败${NC}"
    exit 1
fi

# 刷新 CDN 缓存（可选）
echo ""
read -p "是否刷新 CDN 缓存？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🔄 刷新 CDN 缓存中...${NC}"
    # 需要安装阿里云 CLI 并配置
    # aliyun cdn RefreshObjectCaches --ObjectPath https://cdn.slyai.top/assets/ --ObjectType Directory
    echo -e "${YELLOW}⚠️  请手动在阿里云 CDN 控制台刷新缓存${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}完成！${NC}"
echo -e "${GREEN}========================================${NC}"
```

### 5.2 添加执行权限

```bash
chmod +x scripts/upload-assets.sh
```

### 5.3 测试上传

本地构建并上传测试：

```bash
# 构建项目
pnpm run build

# 上传资源
./scripts/upload-assets.sh
```

---

## 第六步：配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. 访问仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**，添加以下密钥：

| Secret 名称                | 值               | 说明                    |
| -------------------------- | ---------------- | ----------------------- |
| `ALIYUN_ACCESS_KEY_ID`     | `LTAI5t...`      | 阿里云 AccessKey ID     |
| `ALIYUN_ACCESS_KEY_SECRET` | `xxx...`         | 阿里云 AccessKey Secret |
| `ALIYUN_OSS_BUCKET`        | `slyai-assets`   | OSS Bucket 名称         |
| `ALIYUN_OSS_REGION`        | `oss-cn-beijing` | OSS 地域                |
| `CDN_DOMAIN`               | `cdn.slyai.top`  | CDN 域名                |

---

## 第七步：更新 GitHub Actions 工作流

编辑 `.github/workflows/deploy.yml`，添加 CDN 相关步骤。

### 7.1 修改构建步骤

在构建时注入 CDN URL：

```yaml
# ==================== 步骤 6: 构建项目 ====================
- name: 🔨 构建项目
  run: pnpm run build
  env:
    NODE_ENV: production
    VITE_CDN_URL: https://${{ secrets.CDN_DOMAIN }} # 新增
```

### 7.2 添加 OSS 上传步骤

在构建完成后、上传到服务器之前，添加上传到 OSS 的步骤：

```yaml
# ==================== 步骤 6.5: 上传静态资源到 OSS ====================
- name: 📤 上传静态资源到阿里云 OSS
  env:
    ALIYUN_ACCESS_KEY_ID: ${{ secrets.ALIYUN_ACCESS_KEY_ID }}
    ALIYUN_ACCESS_KEY_SECRET: ${{ secrets.ALIYUN_ACCESS_KEY_SECRET }}
    ALIYUN_OSS_BUCKET: ${{ secrets.ALIYUN_OSS_BUCKET }}
    ALIYUN_OSS_REGION: ${{ secrets.ALIYUN_OSS_REGION }}
  run: |
    # 安装 ossutil
    wget https://gosspublic.alicdn.com/ossutil/1.7.19/ossutil-v1.7.19-linux-amd64
    chmod +x ossutil-v1.7.19-linux-amd64
    sudo mv ossutil-v1.7.19-linux-amd64 /usr/local/bin/ossutil

    # 配置 ossutil
    ossutil config -e ${ALIYUN_OSS_REGION}.aliyuncs.com \
      -i ${ALIYUN_ACCESS_KEY_ID} \
      -k ${ALIYUN_ACCESS_KEY_SECRET}

    # 上传资源
    ossutil cp -r dist/assets/ oss://${ALIYUN_OSS_BUCKET}/assets/ --update

    echo "✅ 静态资源已上传到 OSS"
```

---

## 第八步：验证部署

### 8.1 本地验证

```bash
# 1. 本地开发（使用本地资源）
pnpm run dev
# 访问 http://localhost:5173，检查资源加载

# 2. 本地生产构建（使用 CDN）
VITE_CDN_URL=https://cdn.slyai.top pnpm run build
pnpm run preview
# 访问 http://localhost:4173，检查 CDN 资源加载
```

### 8.2 生产环境验证

1. 提交代码并推送到 `main` 分支
2. 触发 GitHub Actions 自动部署
3. 部署完成后访问 `http://slyai.top`
4. 打开浏览器开发者工具 → **Network**
5. 检查资源是否从 `cdn.slyai.top` 加载

**验证要点：**

- ✅ 图片和视频从 CDN 加载
- ✅ 无 404 或 CORS 错误
- ✅ 资源加载速度明显提升
- ✅ 页面功能正常

### 8.3 性能对比

使用浏览器开发者工具的 **Performance** 面板：

| 指标               | 迁移前 | 迁移后 | 改善 |
| ------------------ | ------ | ------ | ---- |
| 首次内容绘制 (FCP) | ?      | ?      | ?    |
| 视频加载时间       | ?      | ?      | ?    |
| 总资源大小         | ?      | ?      | -    |
| 总加载时间         | ?      | ?      | ?    |

---

## 🔄 回滚方案

如果迁移出现问题，可以快速回滚：

### 方案 1：临时回滚（推荐）

修改 GitHub Actions 工作流，移除 `VITE_CDN_URL` 环境变量：

```yaml
- name: 🔨 构建项目
  run: pnpm run build
  env:
    NODE_ENV: production
    # VITE_CDN_URL: https://${{ secrets.CDN_DOMAIN }}  # 注释掉
```

重新触发部署即可回滚。

### 方案 2：完整回滚

回退到迁移前的 Git 提交：

```bash
git revert <commit-hash>
git push origin main
```

---

## 📊 成本估算

基于项目资源情况的成本估算（仅供参考）：

### 资源统计

- 图片：4 个，约 500KB
- 视频：4 个，约 20MB
- 总计：约 20.5MB

### 月度成本估算

**OSS 存储费用：**

- 存储量：0.02GB
- 单价：￥ 0.12/GB/月
- 费用：￥ 0.0024/月

**CDN 流量费用（假设 1000 次访问/月）：**

- 流量：20.5MB × 1000 = 20.5GB
- 单价：￥ 0.24/GB
- 费用：￥ 4.92/月

**总计：约 ￥ 5/月**

> 实际费用取决于访问量，建议在阿里云控制台设置费用预警。

---

## 🎯 后续优化建议

### 1. 视频格式优化

将 `.mov` 格式转换为更通用的 `.mp4`：

```bash
# 使用 ffmpeg 转换
ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4
```

### 2. 图片处理

使用 OSS 图片处理功能，自动生成不同尺寸：

```typescript
// 示例：生成缩略图
getAssetUrl("/assets/images/banner.png?x-oss-process=image/resize,w_400");
```

### 3. 启用 CDN 预热

对热门资源进行预热：

1. CDN 控制台 → **刷新预热**
2. 选择**预热**
3. 输入资源 URL

### 4. 监控和告警

设置 CDN 监控告警：

- 带宽突增告警
- 错误率告警
- 费用超限告警

### 5. 全站 CDN

考虑将 HTML/CSS/JS 也迁移到 CDN，进一步提升性能。

---

## 📚 相关文档

- [CDN_SETUP.md](./CDN_SETUP.md) - 阿里云配置指南
- [CICD_QUICKSTART.md](./CICD_QUICKSTART.md) - CI/CD 快速开始
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

## ❓ 常见问题

### Q1: 本地开发时如何使用 CDN 资源？

设置环境变量：

```bash
VITE_CDN_URL=https://cdn.slyai.top pnpm run dev
```

### Q2: 如何只上传新增或修改的文件？

脚本中使用了 `--update` 参数，自动增量上传。

### Q3: 构建失败，提示找不到环境变量？

检查 GitHub Secrets 是否正确配置，变量名大小写是否一致。

### Q4: CDN 缓存未更新？

手动刷新 CDN 缓存：CDN 控制台 → 刷新预热 → 输入 URL。

### Q5: 如何查看 OSS 存储和 CDN 流量使用情况？

阿里云控制台 → 费用中心 → 消费明细。
