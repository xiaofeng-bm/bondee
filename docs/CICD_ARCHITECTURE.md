# CI/CD 架构和流程图

本文档提供可视化的架构图，帮助你理解整个 CI/CD 流程。

## 🏗️ 整体架构图

```mermaid
graph TB
    subgraph "开发环境"
        A[开发者本地电脑] -->|git push| B[GitHub 仓库]
    end

    subgraph "GitHub"
        B -->|触发| C[GitHub Actions]
        C -->|1. 检出代码| D[Runner 虚拟机]
        D -->|2. 安装依赖| D
        D -->|3. 代码检查| D
        D -->|4. 构建项目| D
    end

    subgraph "阿里云服务器"
        E[Nginx Web 服务器]
        F[项目目录<br/>/var/www/bondee]
        G[备份目录<br/>/var/www/bondee_backups]

        E -->|托管| F
        F -->|备份| G
    end

    D -->|5. SSH 部署| F
    F -->|6. 重启| E
    E -->|7. 提供服务| H[用户浏览器]

    style B fill:#f9f,stroke:#333
    style C fill:#bbf,stroke:#333
    style E fill:#bfb,stroke:#333
    style H fill:#fbb,stroke:#333
```

## 🔄 完整部署流程

```mermaid
sequenceDiagram
    participant Dev as 开发者
    participant Git as GitHub
    participant Actions as GitHub Actions
    participant Server as 阿里云服务器
    participant Nginx as Nginx
    participant User as 用户

    Dev->>Git: 1. git push origin main
    Git->>Actions: 2. 触发 Workflow

    Note over Actions: CI 阶段
    Actions->>Actions: 3. 检出代码
    Actions->>Actions: 4. 安装 pnpm
    Actions->>Actions: 5. pnpm install
    Actions->>Actions: 6. pnpm lint (代码检查)
    Actions->>Actions: 7. pnpm build (构建)

    Note over Actions,Server: CD 阶段
    Actions->>Server: 8. SSH 连接
    Actions->>Server: 9. 拉取最新代码
    Actions->>Server: 10. 安装依赖
    Actions->>Server: 11. 构建项目
    Server->>Server: 12. 备份旧版本
    Server->>Nginx: 13. 重新加载配置

    Note over Server,User: 服务阶段
    User->>Nginx: 14. 访问网站
    Nginx->>User: 15. 返回页面

    Actions-->>Git: 16. 报告部署状态
    Git-->>Dev: 17. 通知结果
```

## 📦 文件流转过程

```mermaid
graph LR
    A[源代码<br/>src/] -->|pnpm build| B[构建产物<br/>dist/]
    B -->|GitHub Actions| C[服务器<br/>/var/www/bondee/dist/]
    C -->|Nginx 托管| D[用户访问<br/>http://IP]

    B -.->|备份| E[历史版本<br/>/var/www/bondee_backups/]

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#e8f5e9
    style D fill:#fce4ec
    style E fill:#f3e5f5
```

## 🔐 SSH 密钥认证流程

```mermaid
graph TB
    A[生成密钥对] --> B{公钥 + 私钥}
    B -->|公钥| C[服务器<br/>~/.ssh/authorized_keys]
    B -->|私钥| D[GitHub Secrets<br/>SERVER_SSH_KEY]

    E[GitHub Actions] -->|使用私钥| F[SSH 连接]
    C -->|验证| F
    F -->|认证成功| G[执行部署命令]

    style A fill:#e1f5ff
    style C fill:#e8f5e9
    style D fill:#fff4e1
    style G fill:#c8e6c9
```

## 🚦 GitHub Actions Workflow 流程

```mermaid
graph TD
    A[代码推送到 main] --> B{触发 Workflow}

    B --> C[步骤1: 检出代码]
    C --> D[步骤2: 设置 Node.js]
    D --> E[步骤3: 安装 pnpm]
    E --> F[步骤4: 安装依赖]
    F --> G[步骤5: 代码检查]

    G -->|Lint 通过| H[步骤6: 构建项目]
    G -->|Lint 失败| Z[停止部署]

    H -->|构建成功| I[步骤7: SSH 到服务器]
    H -->|构建失败| Z

    I --> J[步骤8: 执行部署脚本]
    J --> K{部署结果}

    K -->|成功| L[✅ 部署完成]
    K -->|失败| M[❌ 报告错误]

    L --> N[通知开发者]
    M --> N

    style G fill:#fff9c4
    style H fill:#fff9c4
    style L fill:#c8e6c9
    style M fill:#ffcdd2
    style Z fill:#ffcdd2
```

## 🗂️ 服务器目录结构

```mermaid
graph TB
    A[服务器根目录]
    A --> B[/var/www/]

    B --> C[bondee/]
    C --> C1[.git/]
    C --> C2[src/ - 源代码]
    C --> C3[dist/ - 构建产物]
    C --> C4[scripts/]
    C4 --> C4A[deploy.sh]
    C4 --> C4B[init-server.sh]
    C --> C5[node_modules/]

    B --> D[bondee_backups/]
    D --> D1[dist_20231213_100000/]
    D --> D2[dist_20231213_110000/]
    D --> D3[dist_20231213_120000/]

    A --> E[/etc/nginx/]
    E --> E1[sites-available/]
    E1 --> E1A[bondee - 配置文件]
    E --> E2[sites-enabled/]
    E2 --> E2A[bondee - 软链接]

    A --> F[/var/log/nginx/]
    F --> F1[bondee_access.log]
    F --> F2[bondee_error.log]

    style C3 fill:#c8e6c9
    style D fill:#fff9c4
    style E1A fill:#bbdefb
    style E2A fill:#bbdefb
```

## 🔄 自动备份和回滚机制

```mermaid
graph LR
    A[新版本部署] -->|1. 备份当前版本| B[backup_TIMESTAMP/]
    B -->|2. 更新代码| C[git pull]
    C -->|3. 构建新版本| D[pnpm build]
    D -->|4. 替换 dist/| E[新版本上线]

    E -.->|如果出问题| F[回滚操作]
    F -->|恢复备份| B
    B -->|重新部署| G[旧版本恢复]

    style A fill:#e1f5ff
    style B fill:#fff9c4
    style E fill:#c8e6c9
    style F fill:#ffcdd2
    style G fill:#c8e6c9
```

## 🌐 用户访问流程

```mermaid
graph LR
    A[用户浏览器] -->|HTTP 请求| B[端口 80]
    B --> C{Nginx}

    C -->|静态文件请求| D[/var/www/bondee/dist/]
    D -->|返回文件| C

    C -->|单页应用路由| E[index.html]
    E --> C

    C -->|Gzip 压缩| F[压缩后的内容]
    F -->|添加缓存头| G[返回给用户]
    G --> A

    style A fill:#fce4ec
    style C fill:#c8e6c9
    style D fill:#e1f5ff
    style E fill:#fff9c4
```

## ⚙️ Nginx 工作原理

```mermaid
graph TD
    A[用户请求<br/>http://IP/about] --> B{Nginx}

    B -->|1. 检查文件| C[/dist/about]
    C -->|不存在| D[/dist/about/]
    D -->|不存在| E[/dist/index.html]

    E -->|找到| F[返回 index.html]
    F --> G[React Router 接管]
    G --> H[渲染 /about 页面]

    B -->|静态资源| I[/dist/assets/main.js]
    I -->|命中| J[检查缓存]
    J -->|1年缓存| K[返回文件]

    style B fill:#c8e6c9
    style E fill:#fff9c4
    style F fill:#c8e6c9
    style K fill:#c8e6c9
```

## 📊 完整的数据流

```mermaid
graph TB
    subgraph "1. 开发阶段"
        A[编写代码] --> B[本地测试]
        B --> C[git commit]
    end

    subgraph "2. 提交阶段"
        C --> D[git push]
    end

    subgraph "3. CI 阶段 - GitHub Actions"
        D --> E[检出代码]
        E --> F[安装依赖]
        F --> G[代码检查]
        G --> H[构建项目]
    end

    subgraph "4. CD 阶段 - 服务器"
        H --> I[SSH 连接]
        I --> J[备份旧版本]
        J --> K[拉取代码]
        K --> L[构建项目]
        L --> M[重启服务]
    end

    subgraph "5. 运行阶段"
        M --> N[Nginx 托管]
        N --> O[用户访问]
    end

    style E fill:#bbdefb
    style F fill:#bbdefb
    style G fill:#bbdefb
    style H fill:#bbdefb
    style I fill:#c8e6c9
    style J fill:#c8e6c9
    style K fill:#c8e6c9
    style L fill:#c8e6c9
    style M fill:#c8e6c9
    style N fill:#fff9c4
    style O fill:#fce4ec
```

## 🎯 关键概念对照

### CI (持续集成)

```mermaid
graph LR
    A[代码提交] --> B[自动构建]
    B --> C[自动测试]
    C --> D{通过?}
    D -->|是| E[✅ 集成成功]
    D -->|否| F[❌ 通知开发者]

    style E fill:#c8e6c9
    style F fill:#ffcdd2
```

### CD (持续部署)

```mermaid
graph LR
    A[CI 通过] --> B[自动部署]
    B --> C[健康检查]
    C --> D{正常?}
    D -->|是| E[✅ 部署完成]
    D -->|否| F[❌ 自动回滚]

    style E fill:#c8e6c9
    style F fill:#ffcdd2
```

## 📝 总结

通过以上流程图，你可以清晰地看到：

1. **代码如何从本地到服务器**：开发者 → GitHub → Actions → 服务器
2. **每个环节的职责**：开发、集成、部署、托管
3. **自动化的价值**：减少手动操作，提高效率，降低出错率
4. **备份和回滚机制**：确保可以快速恢复到旧版本

---

**相关文档**：

- [CI/CD 完整指南](./CICD_GUIDE.md)
- [快速开始](./CICD_QUICKSTART.md)
- [配置检查清单](./CICD_CHECKLIST.md)
