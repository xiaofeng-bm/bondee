#!/bin/bash

# 回滚脚本
# 用于回滚到之前的版本

set -e

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"

echo "=========================================="
echo "开始回滚 Bondee 应用"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

# 1. 查看可用的镜像版本
echo ""
echo "📋 可用的镜像版本："
docker images bondee --format "table {{.Tag}}\t{{.CreatedAt}}\t{{.Size}}" | head -10

# 2. 提示用户选择版本（如果是手动运行）
if [ -z "$ROLLBACK_TAG" ]; then
    echo ""
    read -p "请输入要回滚到的版本标签（默认：previous）: " ROLLBACK_TAG
    ROLLBACK_TAG=${ROLLBACK_TAG:-previous}
fi

echo ""
echo "🔄 回滚到版本: ${ROLLBACK_TAG}"

# 3. 设置镜像版本
export DOCKER_IMAGE="bondee:${ROLLBACK_TAG}"

# 4. 停止当前容器
echo ""
echo "🛑 停止当前容器..."
docker compose -f ${COMPOSE_FILE} down --timeout 30

# 5. 启动指定版本
echo ""
echo "🚀 启动版本 ${ROLLBACK_TAG}..."
docker compose -f ${COMPOSE_FILE} up -d

# 6. 等待服务就绪
echo ""
echo "⏳ 等待服务就绪..."
sleep 5

# 7. 健康检查
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
        echo "❌ 回滚后健康检查失败"
        echo "查看日志："
        docker compose -f ${COMPOSE_FILE} logs --tail=50
        exit 1
    fi
done

# 8. 显示运行状态
echo ""
echo "=========================================="
echo "📊 回滚后状态"
echo "=========================================="
docker compose -f ${COMPOSE_FILE} ps

echo ""
echo "=========================================="
echo "🎉 回滚完成！"
echo "当前版本: ${ROLLBACK_TAG}"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
