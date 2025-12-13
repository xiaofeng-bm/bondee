#!/bin/bash

# 部署脚本
# 用于在服务器上手动部署或 CI/CD 调用

set -e

DOCKER_IMAGE="${DOCKER_IMAGE:-bondee:latest}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"

echo "=========================================="
echo "开始部署 Bondee 应用"
echo "镜像: ${DOCKER_IMAGE}"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

# 1. 拉取最新镜像
echo ""
echo "📦 拉取最新 Docker 镜像..."
docker compose -f ${COMPOSE_FILE} pull

# 2. 停止旧容器（优雅关闭）
echo ""
echo "🛑 停止旧容器..."
docker compose -f ${COMPOSE_FILE} down --timeout 30

# 3. 启动新容器
echo ""
echo "🚀 启动新容器..."
docker compose -f ${COMPOSE_FILE} up -d

# 4. 等待服务就绪
echo ""
echo "⏳ 等待服务就绪..."
sleep 5

# 5. 健康检查
echo ""
echo "🔍 执行健康检查..."
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo "✅ 健康检查通过！"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo "⏳ 等待服务启动... ($RETRY_COUNT/$MAX_RETRIES)"
        sleep 3
    fi
    
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "❌ 健康检查失败，服务未正常启动"
        echo "查看日志："
        docker compose -f ${COMPOSE_FILE} logs --tail=50
        exit 1
    fi
done

# 6. 清理旧镜像
echo ""
echo "🧹 清理未使用的镜像..."
docker image prune -f

# 7. 显示运行状态
echo ""
echo "=========================================="
echo "📊 部署状态"
echo "=========================================="
docker compose -f ${COMPOSE_FILE} ps

echo ""
echo "=========================================="
echo "🎉 部署完成！"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
