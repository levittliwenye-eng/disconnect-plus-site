# DISCONNECT+ Cloudflare Access API 配置

当前线上后台已经被代码层锁住。要让管理员可以登录，推荐用 Cloudflare Access，而不是公开后台密码。

## 需要的 API Token 权限

在 Cloudflare 创建一个临时 API token，权限只给：

- Account / Cloudflare Access: Apps and Policies Write
- Account / Cloudflare Access: Organizations, Identity Providers, and Groups Write

用完以后可以删除这个 token。

## 执行方式

先设置环境变量，不要把 token 写进任何文件：

```bash
export CLOUDFLARE_ACCOUNT_ID="你的 Cloudflare Account ID"
export CLOUDFLARE_API_TOKEN="你的临时 Cloudflare API token"
export DISCONNECT_SITE_HOSTNAME="disconnectplus.com"
export DISCONNECT_ADMIN_EMAIL="disconnectaudio@sina.com"
```

然后运行：

```bash
node scripts/setup-cloudflare-access.mjs
```

脚本会：

- 读取当前 Zero Trust 组织的 `auth_domain`
- 复用或创建 One-time PIN 身份源
- 创建 `DISCONNECT+ Admin` Access 应用
- 保护 `disconnectplus.com/admin*`
- 保护 `disconnectplus.com/api/admin/*`
- 只允许 `disconnectaudio@sina.com`

运行成功后，它会输出：

```text
CF_ACCESS_TEAM_DOMAIN=...
CF_ACCESS_AUD=...
```

把这两个值写入 Cloudflare Pages secrets：

```bash
npx wrangler pages secret put CF_ACCESS_TEAM_DOMAIN --project-name disconnect-plus-site
npx wrangler pages secret put CF_ACCESS_AUD --project-name disconnect-plus-site
```

然后重新部署一次 Pages。

## 安全注意

- 不要使用 Include everyone。
- 不要使用 Include login methods = One-time PIN 作为唯一允许条件，因为这会允许任何能收邮件的人。
- 只允许明确邮箱：`disconnectaudio@sina.com`。
- API token 用完后删除。
