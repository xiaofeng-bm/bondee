#!/bin/bash

# 部署脚本 - 在服务器上执行
# 用途：自动化部署流程，拉取代码、安装依赖、构建项目、重启服务

set -e  # 遇到错误立即退出

echo "🚀 开始部署 Bondee 项目..."

# ==================== 配置变量 ====================
DEPLOY_DIR="/var/www/bondee"
BACKUP_DIR="/var/www/bondee_backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# ==================== 1. 创建备份 ====================
echo ""
echo "📦 创建当前版本备份..."
if [ -d "$DEPLOY_DIR/dist" ]; then
    mkdir -p $BACKUP_DIR
    cp -r $DEPLOY_DIR/dist $BACKUP_DIR/dist_$TIMESTAMP
    echo "✅ 备份完成: $BACKUP_DIR/dist_$TIMESTAMP"
else
    echo "⚠️  没有找到现有的 dist 目录，跳过备份"
fi

# ==================== 2. 进入项目目录 ====================
echo ""
echo "📁 进入项目目录..."
cd $DEPLOY_DIR
echo "当前目录: $(pwd)"

# ==================== 3. 拉取最新代码 ====================
echo ""
echo "📥 拉取最新代码..."
git fetch --all
git reset --hard origin/main  # 强制更新到远程 main 分支
COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_MSG=$(git log -1 --pretty=%B)
echo "✅ 代码更新完成"
echo "   提交哈希: $COMMIT_HASH"
echo "   提交信息: $COMMIT_MSG"

# ==================== 4. 安装依赖 ====================
echo ""
echo "📦 安装项目依赖..."
pnpm install --frozen-lockfile
echo "✅ 依赖安装完成"

# ==================== 5. 构建项目 ====================
echo ""
echo "🔨 开始构建项目..."
NODE_ENV=production pnpm run build
echo "✅ 构建完成"

# 检查构建产物
if [ ! -f "$DEPLOY_DIR/dist/index.html" ]; then
    echo "❌ 错误: 构建失败，未找到 dist/index.html"
    exit 1
fi

# ==================== 6. 清理旧备份 ====================
echo ""
echo "🧹 清理旧备份（保留最近 5 个）..."
if [ -d "$BACKUP_DIR" ]; then
    cd $BACKUP_DIR
    # 列出所有备份，按时间排序，删除第 6 个及之后的
    ls -t | tail -n +6 | xargs -I {} rm -rf {}
    BACKUP_COUNT=$(ls -1 | wc -l)
    echo "✅ 当前保留备份数: $BACKUP_COUNT"
fi

# ==================== 7. 重启 Nginx ====================
echo ""
echo "🔄 重新加载 Nginx..."
sudo systemctl reload nginx
echo "✅ Nginx 重新加载完成"

# ==================== 8. 部署完成 ====================
echo ""
echo "================================================"
echo "✅ 部署成功！"
echo "================================================"
echo "📅 部署时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "📦 提交版本: $COMMIT_HASH"
echo "💬 提交信息: $COMMIT_MSG"
echo "🌐 访问地址: http://$(curl -s ifconfig.me)"
echo "================================================"
