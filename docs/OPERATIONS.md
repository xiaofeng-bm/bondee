# 运维手册

本手册提供日常运维、监控和维护的实用指南。

## 📊 健康检查

### 自动健康检查

应用已配置自动健康检查：

```bash
# 查看健康检查状态
docker-compose ps

# 手动执行健康检查
curl http://localhost/health
# 正常应返回: healthy
```

### 完整系统检查脚本

```bash
#!/bin/bash
# /opt/bondee/scripts/system-check.sh

echo "=== 系统健康检查 ==="
echo

# 1. 检查容器状态
echo "1. Docker 容器状态:"
docker-compose ps
echo

# 2. 检查系统资源
echo "2. 系统资源使用:"
echo "CPU 和内存:"
top -bn1 | head -5
echo
echo "磁盘使用:"
df -h /
echo

# 3. 检查应用响应
echo "3. 应用响应检查:"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
if [ $response -eq 200 ]; then
    echo "✓ 应用响应正常 (HTTP $response)"
else
    echo "✗ 应用响应异常 (HTTP $response)"
fi
echo

# 4. 检查日志错误
echo "4. 最近的错误日志:"
docker-compose logs --tail=50 | grep -i error | tail -5
echo

echo "=== 检查完成 ==="
```

## 🔍 日志管理

### 查看日志

```bash
# 实时查看日志
docker-compose logs -f

# 查看最近 100 行
docker-compose logs --tail=100

# 查看特定服务日志
docker-compose logs web

# 查看特定时间段日志
docker-compose logs --since 2025-01-01T10:00:00 --until 2025-01-01T11:00:00

# 只看错误日志
docker-compose logs | grep -i error
```

### 日志归档

```bash
#!/bin/bash
# /opt/bondee/scripts/archive-logs.sh

# 设置日志保留天数
RETENTION_DAYS=30
LOG_DIR="/opt/bondee/logs"
ARCHIVE_DIR="${LOG_DIR}/archive"

# 创建归档目录
mkdir -p ${ARCHIVE_DIR}

# 导出当前日志
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose logs > ${LOG_DIR}/app_${DATE}.log

# 压缩日志
gzip ${LOG_DIR}/app_${DATE}.log
mv ${LOG_DIR}/app_${DATE}.log.gz ${ARCHIVE_DIR}/

# 删除旧日志
find ${ARCHIVE_DIR} -name "*.log.gz" -mtime +${RETENTION_DAYS} -delete

echo "日志归档完成: app_${DATE}.log.gz"
```

### 定时任务配置

```bash
# 编辑 crontab
crontab -e

# 每天凌晨 2 点归档日志
0 2 * * * /opt/bondee/scripts/archive-logs.sh >> /opt/bondee/logs/cron.log 2>&1

# 每周一凌晨 3 点清理 Docker 资源
0 3 * * 1 docker system prune -f >> /opt/bondee/logs/docker-cleanup.log 2>&1
```

## 📈 性能监控

### 资源使用监控

```bash
# CPU 和内存使用
docker stats --no-stream

# 更详细的资源统计
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

# 磁盘使用
df -h
docker system df -v
```

### 访问日志分析

```bash
# 查看访问频率最高的 IP
docker-compose exec web cat /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 查看访问最多的页面
docker-compose exec web cat /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -10

# 查看响应时间统计
docker-compose exec web cat /var/log/nginx/access.log | awk '{print $NF}' | grep -E '^[0-9.]+$' | awk '{sum+=$1; count++} END {print "平均响应时间:", sum/count, "秒"}'
```

### 性能监控脚本

```bash
#!/bin/bash
# /opt/bondee/scripts/performance-monitor.sh

THRESHOLD_CPU=80
THRESHOLD_MEM=80
THRESHOLD_DISK=85

# 获取资源使用情况
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
MEM_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100)}')
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')

echo "=== 性能监控报告 ==="
echo "时间: $(date)"
echo "CPU 使用率: ${CPU_USAGE}%"
echo "内存使用率: ${MEM_USAGE}%"
echo "磁盘使用率: ${DISK_USAGE}%"
echo

# 告警判断
ALERT=0

if (( $(echo "$CPU_USAGE > $THRESHOLD_CPU" | bc -l) )); then
    echo "⚠️  警告: CPU 使用率超过阈值 (${THRESHOLD_CPU}%)"
    ALERT=1
fi

if [ $MEM_USAGE -gt $THRESHOLD_MEM ]; then
    echo "⚠️  警告: 内存使用率超过阈值 (${THRESHOLD_MEM}%)"
    ALERT=1
fi

if [ $DISK_USAGE -gt $THRESHOLD_DISK ]; then
    echo "⚠️  警告: 磁盘使用率超过阈值 (${THRESHOLD_DISK}%)"
    ALERT=1
fi

if [ $ALERT -eq 0 ]; then
    echo "✓ 所有指标正常"
fi

# 如果有告警，可以发送通知（钉钉、企业微信等）
# if [ $ALERT -eq 1 ]; then
#     # 发送告警通知
#     curl -X POST "钉钉 Webhook URL" -d "content=性能告警..."
# fi
```

## 🔄 备份与恢复

### 镜像备份

```bash
# 备份当前运行的镜像
docker save bondee:latest | gzip > /opt/backups/bondee_$(date +%Y%m%d).tar.gz

# 恢复镜像
gunzip -c /opt/backups/bondee_20250113.tar.gz | docker load
```

### 配置文件备份

```bash
#!/bin/bash
# /opt/bondee/scripts/backup-config.sh

BACKUP_DIR="/opt/backups"
CONFIG_DIR="/opt/bondee"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p ${BACKUP_DIR}

# 备份配置文件
tar -czf ${BACKUP_DIR}/config_${DATE}.tar.gz \
    ${CONFIG_DIR}/docker-compose.yml \
    ${CONFIG_DIR}/nginx.conf \
    ${CONFIG_DIR}/.env

echo "配置备份完成: ${BACKUP_DIR}/config_${DATE}.tar.gz"

# 保留最近 10 个备份
ls -t ${BACKUP_DIR}/config_*.tar.gz | tail -n +11 | xargs rm -f
```

### 自动备份定时任务

```bash
# 编辑 crontab
crontab -e

# 每天凌晨 1 点备份配置文件
0 1 * * * /opt/bondee/scripts/backup-config.sh >> /opt/bondee/logs/backup.log 2>&1
```

## 🚀 部署与回滚

### 手动部署

```bash
# 拉取最新镜像
docker-compose pull

# 重新创建并启动容器
docker-compose up -d --force-recreate

# 验证部署
curl http://localhost/health
```

### 蓝绿部署（零停机）

```bash
#!/bin/bash
# /opt/bondee/scripts/blue-green-deploy.sh

# 拉取新镜像
docker pull ${NEW_IMAGE}

# 启动新容器（使用不同端口）
docker run -d -p 8080:80 --name bondee-green ${NEW_IMAGE}

# 健康检查
for i in {1..10}; do
    if curl -f http://localhost:8080/health; then
        echo "新容器健康检查通过"

        # 更新 Nginx 上游或切换流量
        docker-compose up -d

        # 停止旧容器
        docker stop bondee-blue
        docker rm bondee-blue

        # 重命名容器
        docker rename bondee-green bondee-blue

        echo "部署完成"
        exit 0
    fi
    echo "等待新容器就绪... ($i/10)"
    sleep 3
done

echo "部署失败，新容器健康检查未通过"
docker stop bondee-green
docker rm bondee-green
exit 1
```

### 回滚操作

```bash
#!/bin/bash
# /opt/bondee/scripts/rollback.sh

# 查看最近的镜像版本
echo "可用的镜像版本:"
docker images bondee --format "table {{.Tag}}\t{{.CreatedAt}}"

# 指定要回滚的版本
read -p "请输入要回滚到的版本标签 (默认: previous): " VERSION
VERSION=${VERSION:-previous}

# 更新 docker-compose.yml 或直接指定镜像
export DOCKER_IMAGE="bondee:${VERSION}"

# 停止当前容器
docker-compose down

# 启动指定版本
docker-compose up -d

# 健康检查
sleep 5
if curl -f http://localhost/health; then
    echo "✓ 回滚成功，应用已恢复"
else
    echo "✗ 回滚后健康检查失败，请检查日志"
    docker-compose logs --tail=50
fi
```

## 🔧 故障处理流程

### 1. 应用无响应

```bash
# 步骤 1: 检查容器状态
docker-compose ps

# 步骤 2: 查看日志
docker-compose logs --tail=100

# 步骤 3: 重启服务
docker-compose restart

# 步骤 4: 如果仍无响应，重新创建容器
docker-compose down
docker-compose up -d

# 步骤 5: 验证恢复
curl http://localhost/health
```

### 2. 内存不足

```bash
# 检查内存使用
free -h
docker stats --no-stream

# 清理 Docker 资源
docker system prune -a -f

# 如果问题持续，考虑重启容器
docker-compose restart
```

### 3. 磁盘空间不足

```bash
# 检查磁盘使用
df -h
docker system df

# 清理 Docker 资源
docker system prune -a -f --volumes

# 清理日志文件
find /var/log -type f -name "*.log" -mtime +7 -delete

# 清理旧的备份
find /opt/backups -mtime +30 -delete
```

### 4. 部署失败

```bash
# 查看 GitHub Actions 日志
# 1. 打开 GitHub 仓库
# 2. 点击 Actions 标签
# 3. 查看失败的工作流

# 在服务器上检查
docker-compose logs
docker images  # 检查镜像是否拉取成功

# 手动重试部署
cd /opt/bondee
./scripts/deploy.sh
```

## 📊 扩容方案

### 垂直扩容（升级服务器配置）

当 2 核 2G 不够用时，可以升级到 4 核 8G：

1. 在阿里云控制台升级 ECS 配置
2. 重启服务器
3. 无需修改应用配置

### 水平扩容（多实例负载均衡）

如果需要更高性能：

1. **购买负载均衡（SLB）**

   - 阿里云控制台购买 SLB
   - 配置后端服务器池

2. **部署多个实例**

   ```bash
   # 在 docker-compose.yml 中配置多个实例
   docker-compose up -d --scale web=3
   ```

3. **配置负载均衡策略**
   - 轮询（Round Robin）
   - 最少连接（Least Connections）
   - IP Hash

## 🔐 安全运维

### 定期更新系统

```bash
# 每周执行系统更新
apt update && apt upgrade -y  # Ubuntu/Debian
yum update -y  # CentOS
```

### 查看登录日志

```bash
# 查看最近的登录记录
last -n 20

# 查看失败的登录尝试
lastb -n 20

# 实时监控登录
tail -f /var/log/auth.log  # Ubuntu/Debian
tail -f /var/log/secure  # CentOS
```

### 定期检查安全

```bash
# 查看开放的端口
netstat -tlnp

# 查看运行的进程
ps aux | grep -v grep

# 检查可疑的定时任务
crontab -l
cat /etc/crontab
```

## 📱 监控告警配置

### 配置钉钉告警

```bash
#!/bin/bash
# /opt/bondee/scripts/dingtalk-alert.sh

WEBHOOK_URL="https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN"

send_alert() {
    local title=$1
    local content=$2

    curl -X POST ${WEBHOOK_URL} \
        -H 'Content-Type: application/json' \
        -d "{
            \"msgtype\": \"markdown\",
            \"markdown\": {
                \"title\": \"${title}\",
                \"text\": \"### ${title}\n\n${content}\n\n> 时间: $(date)\"
            }
        }"
}

# 使用示例
# send_alert "应用告警" "CPU 使用率过高: 85%"
```

### 集成到监控脚本

修改 `performance-monitor.sh`，在告警时调用 `dingtalk-alert.sh`。

## 📝 运维日志

建议维护运维日志，记录：

- 部署时间和版本
- 配置更改
- 故障和处理过程
- 性能优化措施

```bash
# /opt/bondee/logs/operations.log
2025-01-13 10:00:00 - 部署版本 v1.2.0
2025-01-13 14:30:00 - CPU 使用率过高，清理 Docker 缓存
2025-01-14 09:00:00 - 升级服务器配置至 4核8G
```

---

**最后更新**：2025-12-13
