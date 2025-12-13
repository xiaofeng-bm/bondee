#!/bin/bash

# 服务器初始化脚本 - 仅首次部署时执行
# 用途：在服务器上克隆代码仓库，设置权限

set -e

echo "🎬 开始初始化服务器..."

# ==================== 配置变量 ====================
DEPLOY_DIR="/var/www/bondee"
REPO_URL="https://github.com/xiaofeng-bm/bondee.git"  # ⚠️ 需要修改为你的实际仓库地址

# ==================== 1. 检查并克隆代码仓库 ====================
echo ""
echo "📥 检查代码仓库..."
if [ -d "$DEPLOY_DIR/.git" ]; then
    echo "⚠️  项目已存在，跳过克隆"
    cd $DEPLOY_DIR
    git remote -v
else
    echo "📥 克隆代码库..."
    git clone $REPO_URL $DEPLOY_DIR
    echo "✅ 代码克隆完成"
fi

# ==================== 2. 设置目录权限 ====================
echo ""
echo "🔐 设置目录权限..."
sudo chown -R $USER:$USER $DEPLOY_DIR
chmod +x $DEPLOY_DIR/scripts/*.sh
echo "✅ 权限设置完成"

# ==================== 3. 配置 Git ====================
echo ""
echo "⚙️  配置 Git..."
cd $DEPLOY_DIR
git config core.fileMode false
git config pull.rebase false
echo "✅ Git 配置完成"

# ==================== 4. 创建备份目录 ====================
echo ""
echo "📁 创建备份目录..."
mkdir -p /var/www/bondee_backups
echo "✅ 备份目录创建完成"

# ==================== 5. 初始化完成 ====================
echo ""
echo "================================================"
echo "✅ 服务器初始化完成！"
echo "================================================"
echo "📁 项目目录: $DEPLOY_DIR"
echo "📦 备份目录: /var/www/bondee_backups"
echo ""
echo "💡 下一步操作："
echo "   1. 检查 Nginx 配置: sudo nginx -t"
echo "   2. 运行部署脚本: cd $DEPLOY_DIR && bash scripts/deploy.sh"
echo "================================================"
