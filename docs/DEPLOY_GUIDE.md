# 阿里云部署指南

本指南将帮助你完成从零开始的阿里云 ECS 部署。

## 📋 前置要求

- 阿里云 ECS 服务器（2 核 2G 或以上）
- GitHub 账号和仓库
- 域名（可选，用于绑定域名访问）
- 本地已安装 Git

## 🚀 快速开始

### 第一步：服务器初始化

#### 1.1 登录服务器

```bash
# 使用阿里云提供的公网 IP 登录
ssh root@your_server_ip
```

#### 1.2 更新系统包

```bash
# Ubuntu/Debian
apt update && apt upgrade -y

# CentOS/AliyunOS
yum update -y
```

#### 1.3 安装 Docker

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | bash

# 启动 Docker 服务
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
```

#### 1.4 安装 Docker Compose

```bash
# 下载 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker compose --version
```

#### 1.5 配置防火墙和安全组

**阿里云控制台操作**：

1. 登录阿里云控制台
2. 进入 ECS 实例页面
3. 点击「更多」→「网络和安全组」→「安全组配置」
4. 添加以下入方向规则：

| 端口范围 | 授权对象  | 描述               |
| -------- | --------- | ------------------ |
| 22/22    | 0.0.0.0/0 | SSH 登录           |
| 80/80    | 0.0.0.0/0 | HTTP 访问          |
| 443/443  | 0.0.0.0/0 | HTTPS 访问（可选） |

**服务器端防火墙**：

```bash
# Ubuntu/Debian (使用 ufw)
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable

# CentOS (使用 firewalld)
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

#### 1.6 创建部署目录

```bash
# 创建应用目录
mkdir -p /opt/bondee
cd /opt/bondee

# 创建脚本和日志目录
mkdir -p scripts logs
```

---

### 第二步：配置 GitHub Secrets

在 GitHub 仓库中配置 CI/CD 所需的密钥：

1. 打开你的 GitHub 仓库
2. 进入 `Settings` → `Secrets and variables` → `Actions`
3. 点击 `New repository secret`，添加以下密钥：

| Secret Name             | 说明                | 示例值                                       |
| ----------------------- | ------------------- | -------------------------------------------- |
| `ALIYUN_SERVER_HOST`    | 阿里云服务器公网 IP | `123.45.67.89`                               |
| `ALIYUN_SERVER_PORT`    | SSH 端口            | `22`                                         |
| `ALIYUN_SERVER_USER`    | SSH 用户名          | `root`                                       |
| `ALIYUN_SERVER_SSH_KEY` | SSH 私钥            | 见下方说明                                   |
| `DOCKER_REGISTRY`       | Docker 镜像仓库地址 | `registry.cn-hangzhou.aliyuncs.com/your-cd ` |
| `DOCKER_USERNAME`       | Docker 仓库用户名   | 阿里云账号或 RAM 用户                        |
| `DOCKER_PASSWORD`       | Docker 仓库密码     | 阿里云密码或 RAM 密码                        |

#### SSH 密钥配置

**在本地生成 SSH 密钥对**：

```bash
# 生成新的 SSH 密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/aliyun_deploy

# 这会生成两个文件：
# - aliyun_deploy (私钥)
# - aliyun_deploy.pub (公钥)
```

**配置服务器**：

```bash
# 在服务器上，将公钥添加到 authorized_keys
# 先在本地查看公钥内容：cat ~/.ssh/aliyun_deploy.pub
# 然后在服务器执行：

cat >> ~/.ssh/authorized_keys << 'EOF'
# 粘贴 aliyun_deploy.pub 的内容（注意是 .pub 公钥文件，不是私钥！）
EOF

# 设置正确的权限
chmod 600 ~/.ssh/authorized_keys
```

**配置 GitHub Secret**：

```bash
# 在本地，查看私钥内容
cat ~/.ssh/aliyun_deploy

# 将整个私钥内容（包括 BEGIN 和 END 行）复制到 GitHub Secret: ALIYUN_SERVER_SSH_KEY
```

#### 配置阿里云容器镜像服务（可选）

如果使用阿里云容器镜像服务（推荐）：

1. 登录阿里云控制台
2. 搜索「容器镜像服务 ACR」
3. 创建个人实例（免费）
4. 创建命名空间（如：`my-apps`）
5. 获取访问凭证：
   - 仓库地址：`registry.cn-hangzhou.aliyuncs.com`
   - 用户名：阿里云账号全名
   - 密码：在 ACR 控制台设置固定密码

---

### 第三步：首次部署

#### 3.1 推送代码触发 CI/CD

```bash
# 在本地项目目录
git add .
git commit -m "Add CI/CD configuration"
git push origin main
```

#### 3.2 监控部署过程

1. 打开 GitHub 仓库
2. 点击 `Actions` 标签页
3. 查看正在运行的工作流
4. 等待所有步骤完成（通常 3-5 分钟）

#### 3.3 验证部署

部署完成后，访问你的服务器：

```bash
# 通过 IP 访问
http://your_server_ip

# 或通过域名访问（如果已配置）
http://your-domain.com
```

**验证检查清单**：

- [ ] 页面正常加载
- [ ] 路由跳转正常
- [ ] 静态资源加载成功
- [ ] 浏览器控制台无错误

---

## 🌐 域名配置（可选）

### 4.1 DNS 解析配置

在域名服务商（如阿里云、腾讯云）配置：

| 记录类型 | 主机记录 | 记录值        | TTL |
| -------- | -------- | ------------- | --- |
| A        | @        | 服务器公网 IP | 600 |
| A        | www      | 服务器公网 IP | 600 |

### 4.2 配置 SSL 证书（HTTPS）

#### 方案 1：使用 Let's Encrypt（免费，推荐）

```bash
# 在服务器上安装 Certbot
apt install certbot python3-certbot-nginx -y  # Ubuntu/Debian
yum install certbot python3-certbot-nginx -y  # CentOS

# 停止当前容器
cd /opt/bondee
docker-compose down

# 获取证书（将 your-domain.com 替换为你的域名）
certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# 证书会保存在：
# /etc/letsencrypt/live/your-domain.com/fullchain.pem
# /etc/letsencrypt/live/your-domain.com/privkey.pem
```

#### 方案 2：使用阿里云 SSL 证书

1. 登录阿里云控制台
2. 搜索「SSL 证书」
3. 购买免费证书或付费证书
4. 下载 Nginx 格式证书
5. 上传到服务器 `/opt/bondee/ssl/` 目录

#### 更新 Nginx 配置支持 HTTPS

编辑 `nginx.conf`，添加 HTTPS 配置：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... 其他配置保持不变
}
```

更新 `docker-compose.yml`，挂载证书目录：

```yaml
services:
  web:
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    ports:
      - "80:80"
      - "443:443"
```

---

## 🔄 日常部署流程

配置完成后，日常开发和部署非常简单：

```bash
# 1. 本地开发和测试
npm run dev

# 2. 提交代码
git add .
git commit -m "feat: add new feature"
git push origin main

# 3. GitHub Actions 自动执行：
#    - 安装依赖
#    - 类型检查
#    - 代码检查
#    - 构建生产版本
#    - 构建并推送 Docker 镜像
#    - SSH 到服务器并部署
#    - 健康检查

# 4. 3-5 分钟后，访问网站查看更新
```

---

## 🛠️ 常用运维命令

### 服务器管理

```bash
# SSH 登录服务器
ssh root@your_server_ip

# 进入应用目录
cd /opt/bondee

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f --tail=100

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 启动服务
docker-compose up -d
```

### 镜像管理

```bash
# 查看镜像
docker images

# 清理未使用的镜像（释放空间）
docker image prune -a -f

# 手动拉取最新镜像
docker pull your-registry/bondee:latest
```

### 日志管理

```bash
# 查看实时日志
docker-compose logs -f

# 查看最近 100 行日志
docker-compose logs --tail=100

# 查看特定时间的日志
docker-compose logs --since 2024-01-01T10:00:00

# 导出日志
docker-compose logs > /opt/bondee/logs/app-$(date +%Y%m%d).log
```

---

## 🐛 故障排查

### 问题 1：部署后页面无法访问

**检查清单**：

```bash
# 1. 检查容器是否运行
docker-compose ps
# 状态应该是 "Up"

# 2. 检查端口是否监听
netstat -tlnp | grep :80

# 3. 检查防火墙
ufw status  # Ubuntu
firewall-cmd --list-all  # CentOS

# 4. 检查 Nginx 日志
docker-compose logs web
```

**解决方案**：

- 如果容器未运行：`docker-compose up -d`
- 如果端口被占用：修改 `docker-compose.yml` 中的端口映射
- 如果防火墙阻止：开放 80/443 端口

### 问题 2：页面 404 错误

**原因**：通常是 SPA 路由配置问题

**解决方案**：
检查 `nginx.conf` 中的 `try_files` 配置：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 问题 3：GitHub Actions 部署失败

**检查清单**：

1. 查看 Actions 日志，定位失败步骤
2. 验证 GitHub Secrets 配置是否正确
3. 确认 SSH 密钥权限正确

**常见错误**：

- `Permission denied (publickey)`: SSH 密钥配置错误
- `Connection refused`: 服务器防火墙阻止或 IP 错误
- `Docker login failed`: Docker 仓库凭证错误

### 问题 4：部署后老版本仍在运行

**原因**：Docker 缓存未更新

**解决方案**：

```bash
# 在服务器上强制拉取最新镜像
docker-compose pull
docker-compose up -d --force-recreate
```

### 问题 5：服务器磁盘空间不足

**检查磁盘使用**：

```bash
df -h
docker system df
```

**清理空间**：

```bash
# 清理未使用的镜像
docker image prune -a -f

# 清理未使用的容器
docker container prune -f

# 清理未使用的卷
docker volume prune -f

# 一键清理所有未使用资源
docker system prune -a -f
```

---

## 📊 性能优化建议

### 1. 启用 CDN 加速

将静态资源托管到阿里云 OSS + CDN：

```bash
# 修改 vite.config.ts
export default defineConfig({
  base: 'https://cdn.your-domain.com/',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
```

### 2. 配置 Gzip 压缩

已在 `nginx.conf` 中配置，确保开启。

### 3. 优化缓存策略

已在 `nginx.conf` 中配置：

- 静态资源缓存 1 年
- HTML 不缓存（确保及时更新）

### 4. 监控和告警

考虑接入：

- 阿里云云监控
- Prometheus + Grafana
- Sentry（前端错误监控）

---

## 🔐 安全加固建议

### 1. 修改 SSH 默认端口

```bash
# 编辑 SSH 配置
vim /etc/ssh/sshd_config
# Port 22 改为 Port 2222

# 重启 SSH 服务
systemctl restart sshd

# 更新防火墙规则
ufw allow 2222
ufw delete allow 22
```

### 2. 禁用 root 远程登录

```bash
# 创建普通用户
adduser deploy
usermod -aG sudo deploy

# 配置 SSH 密钥后，禁用 root 登录
vim /etc/ssh/sshd_config
# PermitRootLogin no

systemctl restart sshd
```

### 3. 配置自动安全更新

```bash
# Ubuntu/Debian
apt install unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

### 4. 安装防火墙和入侵检测

```bash
# 安装 fail2ban
apt install fail2ban -y

# 配置（编辑 /etc/fail2ban/jail.local）
systemctl enable fail2ban
systemctl start fail2ban
```

---

## 📚 参考资源

- [Docker 官方文档](https://docs.docker.com/)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [阿里云 ECS 文档](https://help.aliyun.com/product/25365.html)
- [Let's Encrypt 文档](https://letsencrypt.org/docs/)

---

## 🆘 获取帮助

如果遇到问题：

1. 查看本文档的故障排查部分
2. 查看 GitHub Actions 日志
3. 查看服务器日志：`docker-compose logs`
4. 搜索相关错误信息
5. 提交 GitHub Issue

---

**最后更新**：2025-12-13
