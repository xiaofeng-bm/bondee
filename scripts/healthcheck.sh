#!/bin/bash

# 健康检查脚本

HEALTH_ENDPOINT="${HEALTH_ENDPOINT:-http://localhost/health}"
TIMEOUT="${TIMEOUT:-5}"

echo "执行健康检查: ${HEALTH_ENDPOINT}"

# 检查 HTTP 状态
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time ${TIMEOUT} ${HEALTH_ENDPOINT})

if [ $HTTP_CODE -eq 200 ]; then
    echo "✅ 健康检查通过 (HTTP ${HTTP_CODE})"
    exit 0
else
    echo "❌ 健康检查失败 (HTTP ${HTTP_CODE})"
    exit 1
fi
