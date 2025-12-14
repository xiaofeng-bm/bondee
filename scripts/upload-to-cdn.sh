#!/bin/bash

# ========================================
# 阿里云 OSS 全站上传脚本（全站 CDN 方案）
# ========================================

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}阿里云 OSS 全站部署${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 配置变量（从环境变量读取）
OSS_BUCKET="${ALIYUN_OSS_BUCKET:-slyai-assets}"
OSS_REGION="${ALIYUN_OSS_REGION:-oss-cn-beijing}"
OSS_ENDPOINT="${OSS_REGION}.aliyuncs.com"
CDN_DOMAIN="${CDN_DOMAIN:-cdn.slyai.top}"

# 检查 ossutil 是否安装
if ! command -v ossutil &> /dev/null; then
    echo -e "${RED}❌ 错误: ossutil 未安装${NC}"
    echo "请先安装 ossutil"
    exit 1
fi

# 检查是否已配置
if [ ! -f ~/.ossutilconfig ]; then
    echo -e "${RED}❌ 错误: ossutil 未配置${NC}"
    echo "请先运行: ossutil config"
    exit 1
fi

# 检查构建产物是否存在
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ 错误: dist 目录不存在${NC}"
    echo "请先运行: pnpm run build"
    exit 1
fi

# 显示配置信息
echo -e "${BLUE}📋 配置信息${NC}"
echo "  Bucket: ${OSS_BUCKET}"
echo "  Region: ${OSS_REGION}"
echo "  CDN: https://${CDN_DOMAIN}"
echo ""

# 上传整个 dist 目录
echo -e "${YELLOW}📤 开始上传全站资源到 OSS...${NC}"
echo ""

# 使用 --update 参数实现增量上传
ossutil cp -r dist/ oss://${OSS_BUCKET}/ \
  --update \
  --config-file ~/.ossutilconfig

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ 上传成功！${NC}"
    echo ""
    echo -e "${BLUE}📊 部署信息${NC}"
    echo "  OSS 地址: https://${OSS_BUCKET}.${OSS_ENDPOINT}/"
    echo "  CDN 地址: https://${CDN_DOMAIN}/"
    echo "  访问页面: https://${CDN_DOMAIN}/index.html"
    echo ""
else
    echo -e "${RED}❌ 上传失败${NC}"
    exit 1
fi

# 询问是否刷新 CDN 缓存
echo ""
read -p "是否需要刷新 CDN 缓存？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}💡 提示: 请在阿里云 CDN 控制台手动刷新缓存${NC}"
    echo "   1. 访问: https://cdn.console.aliyun.com/"
    echo "   2. 刷新预热 → 刷新"
    echo "   3. 输入目录: https://${CDN_DOMAIN}/"
    echo "   4. 选择类型: 目录"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}部署完成！🎉${NC}"
echo -e "${GREEN}========================================${NC}"
