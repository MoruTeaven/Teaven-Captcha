# Teaven Captcha

Cloudflare Workers + D1 版本的人机验证码聚合平台 MVP。

当前已实现：

- 用户注册、登录、退出、当前用户信息。
- 应用创建、更新、重置密钥、日志和统计。
- 管理员上游渠道配置。
- `client.js` 浏览器 SDK。
- `/v1/challenges` 创建验证码挑战。
- `/v1/verify` 统一服务端校验。
- 按国家路由：`CN -> Geetest`，其他国家优先 `Turnstile`，缺失时自动回退可用渠道。
- Turnstile 校验适配器。
- Geetest v4 校验适配器基础实现。

## 本地开发

安装依赖：

```bash
npm install
```

执行本地 D1 迁移：

```bash
npm run db:migrate:local
```

启动 Worker：

```bash
npm run dev
```

类型检查：

```bash
npm run typecheck
```

打包检查：

```bash
npx wrangler deploy --dry-run
```

## 首次使用

第一个注册用户会自动成为管理员。

注册：

```http
POST http://localhost:8787/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123",
  "name": "Admin"
}
```

响应里的 `token` 用于后续后台 API：

```http
Authorization: Bearer <token>
```

## 配置 Turnstile 上游

```http
POST http://localhost:8787/admin/provider-channels
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "provider": "turnstile",
  "name": "Cloudflare Turnstile",
  "public_key": "0x4AAAA...",
  "secret_config": {
    "secret_key": "0x4AAAA..."
  },
  "status": "active",
  "weight": 100,
  "priority": 100,
  "timeout_ms": 5000
}
```

## 配置 Geetest 上游

```http
POST http://localhost:8787/admin/provider-channels
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "provider": "geetest",
  "name": "Geetest v4",
  "public_key": "<captcha_id>",
  "secret_config": {
    "captcha_key": "<captcha_key>"
  },
  "status": "active",
  "weight": 100,
  "priority": 100,
  "timeout_ms": 5000
}
```

## 创建应用

```http
POST http://localhost:8787/apps
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Website",
  "allowed_domains": ["localhost", "example.com"],
  "route_strategy": "geo_country"
}
```

响应中的 `secret_key` 只返回一次，需要保存在业务方服务端。

## 前端接入

```html
<script src="http://localhost:8787/client.js" async defer></script>

<div id="captcha-box"></div>
<input type="hidden" name="captcha_token" />

<script>
  window.TeavenCaptcha.ready(function () {
    window.TeavenCaptcha.render('#captcha-box', {
      siteKey: 'tc_site_xxx',
      action: 'login',
      callback: function (token) {
        document.querySelector('input[name="captcha_token"]').value = token;
      }
    });
  });
</script>
```

## 服务端校验

```http
POST http://localhost:8787/v1/verify
Content-Type: application/json

{
  "secret_key": "tc_secret_xxx",
  "captcha_token": "tc_token_xxx",
  "remote_ip": "203.0.113.10",
  "action": "login"
}
```

## 生产部署注意

生产环境不要使用 `wrangler.toml` 中的开发密钥。需要改用 Workers Secret：

```bash
wrangler secret put SECRET_ENCRYPTION_KEY
wrangler secret put SESSION_SECRET
```

部署前还需要创建正式 D1 数据库，并把 `wrangler.toml` 里的 `database_id` 替换为真实 ID。
