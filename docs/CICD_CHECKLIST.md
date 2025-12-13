# CI/CD 配置检查清单

使用此清单确保你的 CI/CD 配置完整且正确。

## ✅ 服务器端配置

### 系统环境

- [ ] Ubuntu 系统已更新 (`sudo apt update && sudo apt upgrade`)
- [ ] Node.js 已安装 (`node -v` 应显示 v20.x.x)
- [ ] npm 已安装 (`npm -v`)
- [ ] pnpm 已安装 (`pnpm -v`)
- [ ] Nginx 已安装并运行 (`sudo systemctl status nginx`)
- [ ] Git 已安装 (`git --version`)

### 目录和权限

- [ ] 项目目录已创建 (`/var/www/bondee`)
- [ ] 备份目录已创建 (`/var/www/bondee_backups`)
- [ ] 目录权限正确 (`ls -la /var/www/bondee`)
- [ ] 脚本有执行权限 (`ls -la /var/www/bondee/scripts/`)

### Nginx 配置

- [ ] Nginx 配置文件已创建 (`/etc/nginx/sites-available/bondee`)
- [ ] 配置文件中的域名/IP 已修改
- [ ] 软链接已创建 (`ls -la /etc/nginx/sites-enabled/`)
- [ ] 配置测试通过 (`sudo nginx -t`)
- [ ] Nginx 已重载 (`sudo systemctl reload nginx`)

### 防火墙

- [ ] UFW 已安装
- [ ] 端口 22 (SSH) 已开放 (`sudo ufw status`)
- [ ] 端口 80 (HTTP) 已开放
- [ ] 端口 443 (HTTPS) 已开放（如果使用）

### SSH 配置

- [ ] SSH 密钥对已生成
- [ ] 公钥已添加到服务器 (`~/.ssh/authorized_keys`)
- [ ] authorized_keys 权限正确 (`chmod 600`)
- [ ] 本地可以免密登录服务器

### 项目代码

- [ ] 代码仓库已克隆到服务器
- [ ] 依赖已安装 (`ls -la /var/www/bondee/node_modules`)
- [ ] 项目可以成功构建 (`pnpm run build`)
- [ ] 构建产物存在 (`ls -la /var/www/bondee/dist/index.html`)

---

## ✅ GitHub 配置

### 仓库设置

- [ ] 代码已推送到 GitHub
- [ ] 使用的是 `main` 分支（或修改 workflow 中的分支名）
- [ ] Actions 功能已启用
  - GitHub 仓库 → Settings → Actions → General
  - Allow all actions and reusable workflows

### Secrets 配置

进入 Settings → Secrets and variables → Actions，确认以下 Secrets 已添加：

- [ ] `SERVER_HOST` - 服务器 IP 地址
- [ ] `SERVER_USER` - SSH 用户名（通常是 root）
- [ ] `SERVER_SSH_KEY` - SSH 私钥（完整内容，包括 BEGIN 和 END）
- [ ] `DEPLOY_PATH` - 部署路径（/var/www/bondee）

**验证方法**：在 Secrets 页面应该能看到这 4 个密钥（值会被隐藏）

---

## ✅ 项目文件配置

### GitHub Actions Workflow

- [ ] `.github/workflows/deploy.yml` 文件存在
- [ ] Workflow 中的分支名正确（默认 main）
- [ ] Workflow 语法正确（无红色波浪线）

### 部署脚本

- [ ] `scripts/deploy.sh` 存在
- [ ] 脚本有执行权限 (`ls -la scripts/deploy.sh`)
- [ ] 脚本中的路径正确

### 初始化脚本

- [ ] `scripts/init-server.sh` 存在
- [ ] 脚本中的仓库地址已修改为你的实际地址
- [ ] 脚本有执行权限

### Nginx 配置示例

- [ ] `nginx.conf.example` 存在
- [ ] 配置中的域名/IP 已标记需要修改

---

## ✅ 首次部署测试

### 准备工作

- [ ] 所有配置文件中的占位符已修改（如仓库地址、IP）
- [ ] 本地可以 SSH 连接到服务器
- [ ] 本地 Git 已配置（user.name 和 user.email）

### 部署流程

- [ ] 修改一个文件（如 README.md）
- [ ] 提交并推送代码
  ```bash
  git add .
  git commit -m "test: CI/CD"
  git push origin main
  ```
- [ ] GitHub Actions 页面有新的 workflow 运行
- [ ] Workflow 所有步骤都显示绿色 ✅
- [ ] 访问服务器 IP 可以看到网站

### 验证结果

- [ ] 网站首页正常加载
- [ ] 静态资源（CSS、JS、图片）正常加载
- [ ] 前端路由跳转正常
- [ ] 浏览器控制台无报错

---

## ✅ 功能测试

### 自动部署

- [ ] 修改代码后推送，自动触发部署
- [ ] 部署成功后可以看到更新

### 手动触发

- [ ] 在 GitHub Actions 页面可以手动运行 workflow
- [ ] 手动运行也能成功部署

### 回滚测试

- [ ] 服务器上有备份目录
- [ ] 备份目录中有历史版本
- [ ] 可以手动恢复到某个备份

### 日志查看

- [ ] 可以查看 Nginx 访问日志
- [ ] 可以查看 Nginx 错误日志
- [ ] GitHub Actions 有详细的运行日志

---

## 🔧 常用检查命令

### 在服务器上执行

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 测试 Nginx 配置
sudo nginx -t

# 查看最近的访问日志
sudo tail -20 /var/log/nginx/bondee_access.log

# 查看最近的错误日志
sudo tail -20 /var/log/nginx/bondee_error.log

# 检查项目目录
ls -la /var/www/bondee/

# 查看最近的提交
cd /var/www/bondee && git log -3 --oneline

# 查看 Git 状态
cd /var/www/bondee && git status

# 查看备份
ls -lh /var/www/bondee_backups/

# 手动执行部署
cd /var/www/bondee && bash scripts/deploy.sh
```

### 在本地执行

```bash
# 测试 SSH 连接
ssh -i ~/.ssh/deploy_key 你的用户名@服务器IP

# 查看部署密钥
cat ~/.ssh/deploy_key

# 查看本地分支
git branch

# 查看远程仓库
git remote -v

# 查看最近的提交
git log -5 --oneline
```

---

## 📝 配置文件位置总结

### 服务器上

| 文件         | 路径                                | 说明            |
| ------------ | ----------------------------------- | --------------- |
| Nginx 配置   | `/etc/nginx/sites-available/bondee` | 虚拟主机配置    |
| Nginx 软链接 | `/etc/nginx/sites-enabled/bondee`   | 启用的站点      |
| 访问日志     | `/var/log/nginx/bondee_access.log`  | HTTP 访问记录   |
| 错误日志     | `/var/log/nginx/bondee_error.log`   | 错误信息        |
| 项目目录     | `/var/www/bondee/`                  | 代码和构建产物  |
| 备份目录     | `/var/www/bondee_backups/`          | 历史版本备份    |
| SSH 公钥     | `~/.ssh/authorized_keys`            | 允许的 SSH 公钥 |

### 项目中

| 文件           | 路径                           | 说明             |
| -------------- | ------------------------------ | ---------------- |
| GitHub Actions | `.github/workflows/deploy.yml` | 自动化部署流程   |
| 部署脚本       | `scripts/deploy.sh`            | 服务器端部署逻辑 |
| 初始化脚本     | `scripts/init-server.sh`       | 首次初始化服务器 |
| Nginx 示例     | `nginx.conf.example`           | Nginx 配置模板   |
| 快速指南       | `docs/CICD_QUICKSTART.md`      | 快速开始         |
| 完整指南       | `docs/CICD_GUIDE.md`           | 详细说明         |

---

## ❌ 如果某项检查失败

1. **停下来，不要继续**
2. **查看对应的详细指南**：
   - [CI/CD 完整指南](./CICD_GUIDE.md) - 详细步骤
   - [快速入门](./CICD_QUICKSTART.md) - 简化流程
3. **查看常见问题排查**
4. **如果仍未解决，查看日志**

---

## ✅ 全部完成后

恭喜！你的 CI/CD 配置已经完成，现在可以：

- 📝 专注于写代码
- 🚀 `git push` 自动部署
- 🔄 快速迭代新功能
- 📊 查看部署历史
- ⏮️ 一键回滚版本

**下一步建议**：

- 阅读 [运维操作指南](./OPERATIONS.md)
- 了解 [回滚流程](./ROLLBACK_GUIDE.md)
- 尝试配置 HTTPS
- 探索 CDN 加速
