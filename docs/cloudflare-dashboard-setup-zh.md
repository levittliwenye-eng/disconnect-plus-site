# DISCONNECT+ Cloudflare 控制台上线操作单

这份文件用于在 Cloudflare 控制台里手动上线当前网站。不要把真实密钥、Turnstile secret、Access secret、Cloudflare API token 写进仓库。

## 1. 连接 GitHub 仓库

Cloudflare Pages 新建项目时选择：

- GitHub 仓库：`levittliwenye-eng/disconnect-plus-site`
- 生产分支：`main`
- 构建命令：`npm run build`
- 构建输出目录：`out`
- 框架预设：None / Static HTML，或 Cloudflare 自动识别的 Next.js 静态导出

第一次部署成功后，Cloudflare 会给一个临时 Pages 地址。确认页面能打开后，再绑定正式域名。

## 2. 创建 D1 数据库

创建一个 D1 数据库，建议命名：

```text
disconnect_site
```

然后把下面文件里的 SQL 执行到这个 D1 数据库：

```text
cloudflare/d1/schema.sql
```

Pages 项目里添加 D1 绑定：

```text
Binding name: DB
Database: disconnect_site
```

`DB` 这个名字必须保持一致，网站后台和订单接口会读取这个绑定。

如果以后用 Wrangler 命令行管理配置，可以把 `wrangler.example.jsonc` 复制成 `wrangler.jsonc`，再填入真实 D1 `database_id`。`wrangler.jsonc` 已被 `.gitignore` 忽略，避免误提交账号资源 ID。

## 3. 设置环境变量

在 Cloudflare Pages 的 Production 环境变量里填写：

```text
NEXT_PUBLIC_SITE_URL=https://你的正式域名
NEXT_PUBLIC_TURNSTILE_SITE_KEY=你的 Turnstile site key
TURNSTILE_SECRET_KEY=你的 Turnstile secret key
CF_ACCESS_TEAM_DOMAIN=你的 Cloudflare Access team domain
CF_ACCESS_AUD=你的 Access application audience
ADMIN_EMAILS=disconnectaudio@sina.com
```

本地测试用的 `NEXT_PUBLIC_DEMO_ADMIN_PASSWORD` 不要放进生产环境。

## 4. 开启 Turnstile

创建 Turnstile widget 时绑定正式域名。上线前必须把：

- site key 填到 `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- secret key 填到 `TURNSTILE_SECRET_KEY`

这样公开的预约/购买表单才有基础反机器人保护。

## 5. 保护后台

用 Cloudflare Access 保护：

```text
/admin*
/api/admin/*
```

只允许 `disconnectaudio@sina.com` 登录后台。公开访问保留：

```text
/
/api/content
/api/orders
```

`/api/orders` 是预约/购买提交入口，要公开，但必须配合 Turnstile。

代码里也有一层兜底保护：如果没有 Cloudflare Access JWT，`/admin*` 和 `/api/admin/*` 会直接返回 401。也就是说，Access 没配好之前后台不会公开展示，但管理员也暂时进不去。

如果要用 API 自动创建 Access 应用，看：

```text
docs/cloudflare-access-api-setup-zh.md
```

## 6. 绑定域名

域名在 Cloudflare 购买或迁入后，把它绑定到 Pages 项目。

推荐顺序：

1. 先部署 Pages 临时地址。
2. 确认首页、商店预约、后台登录保护正常。
3. 再绑定正式域名。
4. 把 `NEXT_PUBLIC_SITE_URL` 改成正式 `https://` 域名。
5. 重新部署一次。

## 7. 上线前最后确认

- 首页能打开。
- 音乐可以播放。
- 插件区能打开 GitHub 项目。
- 商店/插件预约提交后，D1 的 `order_intents` 表有记录。
- 未登录时不能打开 `/admin`。
- 管理员登录后可以修改内容。
- 浏览器地址栏显示 HTTPS。
- Cloudflare Pages 自定义域名状态为 Active。
