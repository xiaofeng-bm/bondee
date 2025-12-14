#!/usr/bin/env python3
"""
阿里云 OSS 上传脚本 (Python 版本)
作为 ossutil 的替代方案
"""

import os
import sys
from pathlib import Path

try:
    import oss2
    print("✅ oss2 已安装")
except ImportError:
    print("❌ oss2 未安装")
    print("\n请运行以下命令安装:")
    print("pip3 install oss2")
    sys.exit(1)

# 配置信息（从环境变量读取）
ACCESS_KEY_ID = os.getenv('ALIYUN_ACCESS_KEY_ID')
ACCESS_KEY_SECRET = os.getenv('ALIYUN_ACCESS_KEY_SECRET')
BUCKET_NAME = os.getenv('ALIYUN_OSS_BUCKET', 'slyai-assets')
REGION = os.getenv('ALIYUN_OSS_REGION', 'oss-cn-beijing')
ENDPOINT = f'https://{REGION}.aliyuncs.com'

# 检查必需的环境变量
if not ACCESS_KEY_ID or not ACCESS_KEY_SECRET:
    print("❌ 错误: 缺少必需的环境变量")
    print("\n请设置以下环境变量:")
    print("export ALIYUN_ACCESS_KEY_ID='your_access_key_id'")
    print("export ALIYUN_ACCESS_KEY_SECRET='your_access_key_secret'")
    sys.exit(1)

def upload_directory(local_dir, oss_prefix=''):
    """上传目录到 OSS"""
    
    print(f"📋 配置信息:")
    print(f"  Bucket: {BUCKET_NAME}")
    print(f"  Region: {REGION}")
    print(f"  本地目录: {local_dir}")
    print(f"  OSS 前缀: {oss_prefix or '/'}")
    print()
    
    # 创建 Bucket 对象
    auth = oss2.Auth(ACCESS_KEY_ID, ACCESS_KEY_SECRET)
    bucket = oss2.Bucket(auth, ENDPOINT, BUCKET_NAME)
    
    # 遍历本地目录
    local_path = Path(local_dir)
    if not local_path.exists():
        print(f"❌ 错误: 目录不存在: {local_dir}")
        sys.exit(1)
    
    uploaded_count = 0
    skipped_count = 0
    
    for file_path in local_path.rglob('*'):
        if file_path.is_file():
            # 计算相对路径
            relative_path = file_path.relative_to(local_path)
            oss_key = str(Path(oss_prefix) / relative_path) if oss_prefix else str(relative_path)
            
            # 检查文件是否已存在且内容相同（增量上传）
            try:
                # 获取本地文件的 MD5
                import hashlib
                with open(file_path, 'rb') as f:
                    local_md5 = hashlib.md5(f.read()).hexdigest()
                
                # 尝试获取 OSS 上的文件信息
                try:
                    head = bucket.head_object(oss_key)
                    remote_md5 = head.headers.get('ETag', '').strip('"')
                    
                    if local_md5 == remote_md5:
                        print(f"⏭️  跳过 (已存在): {oss_key}")
                        skipped_count += 1
                        continue
                except oss2.exceptions.NoSuchKey:
                    pass  # 文件不存在，需要上传
                
                # 上传文件
                bucket.put_object_from_file(oss_key, str(file_path))
                print(f"✅ 上传: {oss_key}")
                uploaded_count += 1
                
            except Exception as e:
                print(f"❌ 上传失败: {oss_key} - {e}")
    
    print()
    print(f"✅ 上传完成!")
    print(f"  新上传: {uploaded_count} 个文件")
    print(f"  跳过: {skipped_count} 个文件")
    print()
    print(f"🌐 访问地址:")
    print(f"  OSS: https://{BUCKET_NAME}.{REGION}.aliyuncs.com/")
    print(f"  CDN: https://cdn.slyai.top/")

if __name__ == '__main__':
    # 检查 dist 目录是否存在
    dist_dir = 'dist'
    if not os.path.exists(dist_dir):
        print("❌ 错误: dist 目录不存在")
        print("请先运行: pnpm run build")
        sys.exit(1)
    
    print("========================================")
    print("阿里云 OSS 全站部署 (Python)")
    print("========================================")
    print()
    
    # 上传整个 dist 目录
    upload_directory(dist_dir, '')
    
    print("========================================")
    print("部署完成！🎉")
    print("========================================")
