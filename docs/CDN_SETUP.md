# 阿里云 CDN 配置指南

本指南帮助你一步步配置阿里云 OSS 存储和 CDN 加速服务，使用子域名 `cdn.slyai.top` 加速静态资源访问。

## 📋 前置准备

- ✅ 阿里云账号（已注册并完成实名认证）
- ✅ 域名 `slyai.top`（需完成 ICP 备案）
- ✅ 确保有 DNS 管理权限

## 🎯 配置目标

将项目中的图片和视频资源：

- **从**：服务器直接提供（`http://123.57.219.76/assets/xxx`）
- **到**：CDN 加速访问（`https://cdn.slyai.top/assets/xxx`）

**预期效果**：资源加载速度提升 50%-80%

---

## 第一步：创建 OSS Bucket

### 1.1 登录阿里云控制台

访问 [阿里云 OSS 控制台](https://oss.console.aliyun.com/)

### 1.2 创建 Bucket

点击**创建 Bucket**，配置如下：

| 配置项      | 推荐值          | 说明                       |
| ----------- | --------------- | -------------------------- |
| Bucket 名称 | `slyai-assets`  | 全局唯一，可加后缀         |
| 地域        | `华北2（北京）` | 选择离服务器最近的         |
| 存储类型    | `标准存储`      | 适合频繁访问的资源         |
| 读写权限    | `公共读`        | ⚠️ 必须选择，允许 CDN 访问 |
| 服务端加密  | `无`            | 根据需要选择               |

### 1.3 配置跨域访问（CORS）

1. 进入 Bucket → **权限管理** → **跨域设置**
2. 点击**创建规则**：

```
来源：*
允许 Methods：GET, HEAD
允许 Headers：*
暴露 Headers：（留空）
缓存时间：600
```

---

## 第二步：配置 CDN 加速域名

### 2.1 添加 CDN 加速域名

访问 [阿里云 CDN 控制台](https://cdn.console.aliyun.com/)，点击**添加域名**：

| 配置项   | 值                                         | 说明                |
| -------- | ------------------------------------------ | ------------------- |
| 加速域名 | `cdn.slyai.top`                            | 使用子域名          |
| 业务类型 | `图片小文件`                               | 适合本项目          |
| 源站类型 | `OSS域名`                                  | 选择刚创建的 Bucket |
| 源站域名 | `slyai-assets.oss-cn-beijing.aliyuncs.com` | 自动识别            |
| 端口     | `80`                                       | 默认值              |
| 加速区域 | `仅中国内地`                               | 需要域名已备案      |

> **⚠️ 重要提示**  
> 选择**仅中国内地**加速时，域名 `slyai.top` 必须完成 ICP 备案。  
> 如未备案，请选择**全球（不包含中国内地）**。

### 2.2 配置 CNAME 记录

添加域名后，阿里云会分配 CNAME 地址，例如：

```
cdn.slyai.top.w.kunlunsl.com
```

#### 如果域名在阿里云：

1. 访问 [域名控制台](https://dc.console.aliyun.com/)
2. 找到 `slyai.top`，点击**解析**
3. **添加记录**：
   - 记录类型：`CNAME`
   - 主机记录：`cdn`
   - 记录值：`cdn.slyai.top.w.kunlunsl.com`（粘贴阿里云分配的）
   - TTL：`10 分钟`

#### 如果域名在其他服务商：

在 DNS 管理后台添加：

```
类型：CNAME
名称：cdn
值：cdn.slyai.top.w.kunlunsl.com
TTL：600
```

#### 验证 CNAME 配置

等待 5-10 分钟后：

```bash
# 查询 CNAME 记录
dig cdn.slyai.top CNAME

# 或使用 nslookup
nslookup -type=cname cdn.slyai.top
```

返回结果包含阿里云 CNAME 地址即配置成功。

---

## 第三步：配置 HTTPS

### 3.1 申请免费 SSL 证书

1. CDN 控制台 → 域名详情 → **HTTPS 配置**
2. 选择**免费证书**（阿里云提供免费 DV SSL）
3. 等待自动签发（通常几分钟）

### 3.2 启用强制 HTTPS

1. HTTPS 配置中，开启**强制跳转**
2. 选择 `HTTP → HTTPS`
3. 点击**确定**

---

## 第四步：配置缓存策略

优化缓存可提升性能并降低费用。

### 4.1 设置缓存规则

CDN 域名详情 → **缓存配置** → **缓存过期时间** → **添加**

**规则 1：图片长期缓存**

```
类型：文件后缀名
内容：jpg,jpeg,png,gif,svg,webp
过期时间：30 天
权重：90
```

**规则 2：视频长期缓存**

```
类型：文件后缀名
内容：mp4,mov,webm,avi
过期时间：30 天
权重：90
```

**规则 3：默认缓存**

```
类型：目录
内容：/
过期时间：1 天
权重：1
```

---

## 第五步：获取访问密钥

### 5.1 创建 AccessKey

1. 访问 [RAM 控制台](https://ram.console.aliyun.com/)
2. **用户** → 选择用户 → **认证管理**
3. **创建 AccessKey**
4. ⚠️ **立即保存**：`AccessKey ID` 和 `AccessKey Secret`

### 5.2 配置权限

确保用户有 OSS 权限：

1. 用户详情 → **权限管理** → **添加权限**
2. 选择系统策略：`AliyunOSSFullAccess`

> **🔒 安全提示**
>
> - AccessKey Secret 仅显示一次，妥善保管
> - 不要提交到代码仓库
> - 使用 GitHub Secrets 存储

---

## 第六步：安装 ossutil 工具

ossutil 是阿里云官方 OSS 命令行工具。

### Mac 安装

```bash
# 下载（M系列芯片）
curl -o ossutil https://gosspublic.alicdn.com/ossutil/1.7.19/ossutil-v1.7.19-darwin-arm64

# 添加执行权限
chmod +x ossutil

# 移动到系统路径
sudo mv ossutil /usr/local/bin/
```

### Linux 安装

```bash
# 下载
wget https://gosspublic.alicdn.com/ossutil/1.7.19/ossutil-v1.7.19-linux-amd64

# 添加执行权限
chmod +x ossutil-v1.7.19-linux-amd64

# 移动到系统路径
sudo mv ossutil-v1.7.19-linux-amd64 /usr/local/bin/ossutil
```

### 配置 ossutil

```bash
ossutil config
```

按提示输入：

- endpoint：`oss-cn-beijing.aliyuncs.com`
- accessKeyID：你的 AccessKey ID
- accessKeySecret：你的 AccessKey Secret

---

## ✅ 验证配置

### 测试上传和访问

```bash
# 创建测试文件
echo "Hello CDN!" > test.txt

# 上传到 OSS
ossutil cp test.txt oss://slyai-assets/test.txt

# 通过 OSS 直接访问
curl https://slyai-assets.oss-cn-beijing.aliyuncs.com/test.txt

# 通过 CDN 访问
curl https://cdn.slyai.top/test.txt
```

两个 URL 都返回 "Hello CDN!" 即配置成功！

---

## 📝 配置信息汇总

完成以上步骤后，你应该得到以下信息（后续需要添加到 GitHub Secrets）：

| 配置项           | 示例值           | 用途       |
| ---------------- | ---------------- | ---------- |
| OSS Bucket       | `slyai-assets`   | 存储资源   |
| OSS 地域         | `oss-cn-beijing` | 上传时使用 |
| AccessKey ID     | `LTAI5t...`      | 身份认证   |
| AccessKey Secret | `xxx...`         | 身份认证   |
| CDN 域名         | `cdn.slyai.top`  | 前端访问   |

---

## 🚀 下一步

配置完成后，继续执行以下步骤：

1. **上传静态资源** - 参考 [CDN_DEPLOYMENT.md](./CDN_DEPLOYMENT.md)
2. **修改项目代码** - 使用 CDN URL 加载资源
3. **更新 CI/CD** - 自动上传资源到 OSS

---

## 📚 相关文档

- [阿里云 OSS 官方文档](https://help.aliyun.com/product/31815.html)
- [阿里云 CDN 官方文档](https://help.aliyun.com/product/27099.html)
- [ossutil 工具文档](https://help.aliyun.com/document_detail/120075.html)

---

## ❓ 常见问题

### Q1: CNAME 配置后访问不通？

等待 DNS 解析生效（5-30 分钟），使用 `dig` 或 `nslookup` 验证。

### Q2: 403 Forbidden 错误？

检查 Bucket 权限是否设置为**公共读**。

### Q3: 域名未备案怎么办？

选择加速区域为**全球（不包含中国内地）**，或前往[阿里云备案系统](https://beian.aliyun.com/)完成备案。

### Q4: 如何刷新 CDN 缓存？

CDN 控制台 → 刷新预热 → 输入 URL 或目录 → 提交刷新。

### Q5: 成本预估？

- OSS 存储：约 ￥ 0.12/GB/月
- CDN 流量：约 ￥ 0.24/GB（中国内地）
- 建议开启费用预警
