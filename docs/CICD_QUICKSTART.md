# CI/CD 快速开始指南

这是 [CI/CD 完整指南](./CICD_GUIDE.md) 的快速版本，30 分钟快速上手。

## 📋 前置要求

- ✅ 阿里云服务器（已购买）
- ✅ GitHub 仓库（当前项目）
- ✅ 本地可以 SSH 连接到服务器

## 🚀 三步完成部署

### 第一步：服务器配置（15 分钟）

SSH 登录服务器后，依次执行：

```bash
# 1. 安装必要软件
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git
npm install -g pnpm

# 2. 配置 Nginx
sudo tee /etc/nginx/sites-available/bondee > /dev/null <<'EOF'
server {
    listen 80;
    server_name 你的服务器IP;  # 修改这里
    root /var/www/bondee/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
EOF

# 3. 启用配置
sudo ln -s /etc/nginx/sites-available/bondee /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 4. 克隆代码（修改为你的仓库地址）
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
git clone https://github.com/你的用户名/bondee.git /var/www/bondee

# 5. 首次构建
cd /var/www/bondee
pnpm install
pnpm run build
```

### 第二步：GitHub 配置（5 分钟）

1. **生成 SSH 密钥**（本地执行）：

   ```bash
   ssh-keygen -t rsa -b 4096 -C "deploy" -f ~/.ssh/deploy_key
   cat ~/.ssh/deploy_key.pub  # 复制这个公钥
   ```

2. **添加公钥到服务器**：

   ```bash
   # 在服务器执行
   echo "粘贴刚才的公钥" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **配置 GitHub Secrets**：

   - 打开 GitHub 仓库 → Settings → Secrets and variables → Actions
   - 添加以下 Secrets：

   | 名称             | 值                                 |
   | ---------------- | ---------------------------------- |
   | `SERVER_HOST`    | 你的服务器 IP                      |
   | `SERVER_USER`    | `root`                             |
   | `SERVER_SSH_KEY` | `cat ~/.ssh/deploy_key` 的完整输出 |
   | `DEPLOY_PATH`    | `/var/www/bondee`                  |

### 第三步：测试部署（5 分钟）

1. **修改配置文件**：

   - 编辑 `scripts/init-server.sh`，修改仓库地址
   - 编辑 `nginx.conf.example`，修改域名/IP

2. **提交代码触发部署**：

   ```bash
   git add .
   git commit -m "feat: 配置 CI/CD"
   git push origin main
   ```

3. **查看部署进度**：

   - 打开 GitHub 仓库 → Actions
   - 查看最新的 workflow 运行状态

4. **验证结果**：
   - 访问 `http://你的服务器IP`
   - 应该能看到你的网站

## 🎯 工作流程

从现在开始，每次你：

```bash
git push origin main
```

将自动触发：

1. ✅ 代码检查（ESLint）
2. ✅ 项目构建
3. ✅ 部署到服务器
4. ✅ 自动备份旧版本
5. ✅ 重启 Nginx

整个过程约 2-3 分钟！

## 📚 完整文档

- [CI/CD 完整指南](./CICD_GUIDE.md) - 详细解释每个步骤
- [运维操作指南](./OPERATIONS.md) - 日常运维操作
- [回滚指南](./ROLLBACK_GUIDE.md) - 版本回滚

## 🐛 常见问题

### 1. 部署失败：Permission denied

**原因**：SSH 密钥配置错误

**解决**：

```bash
# 本地测试 SSH 连接
ssh -i ~/.ssh/deploy_key root@你的服务器IP

# 如果能登录，说明密钥正确
# 确保在 GitHub Secrets 中 SERVER_SSH_KEY 是完整的私钥内容
```

### 2. 访问网站显示 404

**原因**：Nginx 配置或构建路径错误

**解决**：

```bash
# 在服务器检查
ls -la /var/www/bondee/dist/
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### 3. GitHub Actions 一直等待

**原因**：workflow 文件语法错误或分支名不对

**解决**：

- 检查是否推送到 `main` 分支
- 在 Actions 页面查看详细日志

## 💡 小技巧

### 手动触发部署

不想提交代码也可以部署：

1. GitHub 仓库 → Actions
2. 选择 "Deploy to Aliyun"
3. 点击 "Run workflow"

### 查看服务器日志

```bash
# SSH 到服务器
ssh root@你的服务器IP

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/bondee_access.log
sudo tail -f /var/log/nginx/bondee_error.log

# 查看备份列表
ls -lh /var/www/bondee_backups/
```

### 快速回滚

```bash
# 进入备份目录
cd /var/www/bondee_backups

# 查看备份
ls -lh

# 恢复某个备份
cp -r dist_20231213_153000 /var/www/bondee/dist
sudo systemctl reload nginx
```

## 🎉 恭喜！

你已经完成了 CI/CD 的配置！现在你可以：

- 专注于写代码
- 推送代码自动部署
- 快速迭代新功能
- 一键回滚到旧版本

继续学习更多高级特性，请参考 [完整指南](./CICD_GUIDE.md)。
