# Bondee - React 项目

基于 Vite + React + TypeScript + TailwindCSS 构建的现代化 Web 应用。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm build

# 代码检查
pnpm lint
```

### 生产构建

```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 📦 技术栈

- **框架**: React 19
- **构建工具**: Vite 7
- **语言**: TypeScript 5.9
- **路由**: React Router DOM 7
- **样式**: TailwindCSS 4
- **代码规范**: ESLint

## 🌐 部署

本项目支持完整的 CI/CD 自动化部署流程，可快速部署到阿里云或其他云平台。

### 部署文档

- **[CI/CD 方案](./docs/CI_CD_PLAN.md)** - 完整的 CI/CD 实施方案和技术架构
- **[部署指南](./docs/DEPLOY_GUIDE.md)** - 详细的部署步骤和环境配置
- **[运维手册](./docs/OPERATIONS.md)** - 日常运维、监控和故障处理

### 快速部署（阿里云）

1. 配置服务器环境（Docker + Nginx）
2. 设置 GitHub Secrets（服务器凭证）
3. 推送代码到 main 分支
4. GitHub Actions 自动构建和部署

详细步骤请查看 [部署指南](./docs/DEPLOY_GUIDE.md)。

## 📂 项目结构

```
bondee/
├── src/
│   ├── components/     # 可复用组件
│   ├── pages/          # 页面组件
│   ├── assets/         # 静态资源
│   ├── App.tsx         # 应用主组件
│   ├── main.tsx        # 应用入口
│   └── index.css       # 全局样式
├── public/             # 公共资源
├── docs/               # 项目文档
│   ├── CI_CD_PLAN.md   # CI/CD 方案
│   ├── DEPLOY_GUIDE.md # 部署指南
│   └── OPERATIONS.md   # 运维手册
├── Dockerfile          # Docker 构建文件
├── docker-compose.yml  # Docker Compose 配置
├── nginx.conf          # Nginx 配置
└── vite.config.ts      # Vite 配置
```

## 🛠️ 开发指南

### 代码规范

项目使用 ESLint 进行代码检查：

```bash
# 运行 lint
pnpm lint

# 自动修复（如果支持）
pnpm lint --fix
```

### 环境变量

创建 `.env.local` 文件配置本地环境变量：

```env
# API 地址等配置
VITE_API_URL=http://localhost:3000
```

## 📄 License

[MIT](./LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**最后更新**: 2025-12-13
