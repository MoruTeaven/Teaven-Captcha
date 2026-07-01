# Teaven Captcha 开发文档

版本：v0.1  
目标：基于 Cloudflare 搭建一个多用户、可统一接入多家上游验证码服务的聚合人机验证平台。

## 1. 项目定位

Teaven Captcha 是一个验证码聚合平台，平台管理员在后台统一配置上游验证码渠道，注册用户只需要在自己的站点中接入本平台提供的统一前端脚本和服务端验证接口，即可使用极验、Google reCAPTCHA、Cloudflare Turnstile、hCaptcha 等验证码能力。

产品形态参考“易支付”模式：

- 平台管理员维护上游渠道、全局策略、套餐、风控和系统配置。
- 注册用户创建应用，获取 `app_id`、`site_key`、`secret_key`。
- 用户站点前端加载统一 JS 组件生成验证码 token。
- 用户站点后端调用统一验证 API 校验 token。
- 平台按应用、渠道、调用量、成功率、错误码记录日志和统计。

## 2. MVP 范围

首版只做可上线闭环，不做过度复杂的商业化能力。

必须包含：

- 用户注册、登录、退出。
- 用户后台：应用管理、密钥管理、接入文档、调用统计。
- 管理后台：用户管理、应用管理、上游渠道配置、渠道启停、默认路由策略。
- 统一验证码初始化接口。
- 统一验证码校验接口。
- 至少接入 2 个上游：Cloudflare Turnstile、Google reCAPTCHA 或极验二选一。
- 调用日志、错误日志、基础限流。

暂不包含：

- 在线充值和扣费。
- 复杂套餐计费。
- 多级代理商。
- 私有化部署面板。
- 高级风控规则引擎。

## 3. 角色与权限

### 3.1 平台管理员

权限：

- 登录管理后台。
- 查看和禁用用户。
- 查看和禁用应用。
- 配置上游验证码渠道。
- 设置渠道权重、优先级、可用状态。
- 查看全局调用统计和失败明细。

### 3.2 注册用户

权限：

- 注册、登录用户后台。
- 创建、编辑、删除自己的应用。
- 查看应用的 `site_key`。
- 重置应用的 `secret_key`。
- 配置应用允许域名。
- 查看自己的调用统计和最近错误。

### 3.3 终端访客

权限：

- 在用户站点中完成验证码挑战。
- 不能直接访问后台和敏感 API。

## 4. Cloudflare 架构

推荐使用 Cloudflare 全家桶部署，减少服务器维护成本。

### 4.1 服务选型

| 模块 | Cloudflare 服务 | 用途 |
| --- | --- | --- |
| 前台官网 / 用户后台 / 管理后台 | Cloudflare Pages | 托管静态前端应用 |
| API 服务 | Cloudflare Workers | 用户、应用、验证码、管理接口 |
| 数据库 | Cloudflare D1 | 用户、应用、渠道、日志、统计数据 |
| 会话 / 短期验证码状态 | Workers KV | 存储短生命周期 challenge session |
| 大日志归档 | R2，可选 | 后期保存长期调用日志或导出文件 |
| 异步任务 | Queues，可选 | 后期做日志落库、统计聚合、告警 |
| 访问控制 | Turnstile / WAF / Rate Limiting | 保护后台和 API |

### 4.2 推荐拓扑

```text
用户浏览器
  -> 用户网站
  -> 加载 https://captcha.example.com/client.js
  -> Workers API 创建 challenge
  -> 上游验证码组件完成挑战
  -> 用户网站后端
  -> Workers API 校验 token
  -> 上游 verify API
  -> 返回统一校验结果

管理员 / 注册用户
  -> Cloudflare Pages 后台
  -> Workers API
  -> D1 / KV / R2
```

### 4.3 域名规划

建议：

- `captcha.example.com`：统一验证码前端脚本、公开初始化 API。
- `api.example.com`：平台 API。
- `dashboard.example.com`：用户后台。
- `admin.example.com`：管理后台。

MVP 可以先合并为：

- `captcha.example.com`：前端脚本和 API。
- `dashboard.example.com`：用户后台和管理后台。

## 5. 核心业务流程

### 5.1 用户接入流程

1. 用户注册并登录平台。
2. 创建应用，填写应用名称和允许域名。
3. 平台生成 `app_id`、`site_key`、`secret_key`。
4. 用户在前端页面加载统一脚本。
5. 用户服务端保存 `secret_key`，用于调用验证接口。

前端示例：

```html
<script src="https://captcha.example.com/client.js" async defer></script>

<div id="captcha-box"></div>

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

服务端验证示例：

```http
POST https://api.example.com/v1/verify
Content-Type: application/json

{
  "secret_key": "tc_secret_xxx",
  "captcha_token": "tc_token_xxx",
  "remote_ip": "203.0.113.10",
  "action": "login"
}
```

成功响应：

```json
{
  "success": true,
  "challenge_id": "ch_01HX...",
  "provider": "turnstile",
  "score": null,
  "action": "login",
  "hostname": "www.user-site.com"
}
```

失败响应：

```json
{
  "success": false,
  "error_code": "invalid_token",
  "message": "Captcha verification failed."
}
```

### 5.2 验证码初始化流程

1. 访客打开用户网站页面。
2. 用户网站加载平台统一 `client.js`。
3. `client.js` 调用 `POST /v1/challenges`。
4. Workers 根据 `site_key` 找到应用。
5. 检查应用状态、允许域名、限流和配额。
6. 根据路由策略选择上游渠道。
7. 返回前端渲染所需参数，如 provider、上游 site key、challenge id。
8. 前端动态加载对应上游验证码组件。

### 5.3 验证码校验流程

1. 访客完成上游验证码挑战，前端拿到上游 token。
2. 平台 `client.js` 将上游 token 和 challenge id 包装成业务方使用的 `captcha_token`。
3. 用户网站后端收到表单提交。
4. 用户网站后端调用平台 `POST /v1/verify`。
5. Workers 校验 `secret_key`、`captcha_token`、challenge 状态、过期时间。
6. Workers 调用对应上游 verify API。
7. Workers 将 challenge 标记为终态，防止重复使用。
8. Workers 写入调用日志和统计。
9. 返回统一验证结果。

## 6. 上游渠道设计

### 6.1 首批渠道

| 渠道 | 接入优先级 | 说明 |
| --- | --- | --- |
| Cloudflare Turnstile | P0 | 与 Cloudflare 生态匹配，免费额度友好 |
| Google reCAPTCHA v2/v3 | P0/P1 | 国际通用，但国内网络可用性一般 |
| 极验 Geetest v4 | P1 | 国内可用性较好，企业用户常见 |
| hCaptcha | P2 | 可作为国际备用渠道 |

### 6.2 统一适配器接口

每个上游实现同一套 Provider Adapter。

```ts
export interface CaptchaProviderAdapter {
  name: string;

  getClientConfig(input: GetClientConfigInput): Promise<CaptchaClientConfig>;

  verify(input: VerifyInput): Promise<CaptchaVerifyResult>;
}

export interface GetClientConfigInput {
  appId: string;
  siteKey: string;
  action?: string;
  hostname?: string;
}

export interface CaptchaClientConfig {
  provider: 'turnstile' | 'recaptcha' | 'geetest' | 'hcaptcha';
  challengeId: string;
  publicKey: string;
  scriptUrl: string;
  options: Record<string, unknown>;
  expiresIn: number;
}

export interface VerifyInput {
  challengeId: string;
  providerToken: string;
  remoteIp?: string;
  action?: string;
}

export interface CaptchaVerifyResult {
  success: boolean;
  provider: string;
  score?: number | null;
  action?: string | null;
  hostname?: string | null;
  errorCodes?: string[];
  raw?: unknown;
}
```

### 6.3 渠道配置字段

通用字段：

- `id`：渠道 ID。
- `provider`：渠道类型，如 `turnstile`、`recaptcha`、`geetest`。
- `name`：后台显示名称。
- `public_key`：上游公开 key。
- `secret_config`：加密后的上游密钥配置。
- `status`：`active` / `disabled`。
- `weight`：权重。
- `priority`：优先级。
- `timeout_ms`：上游请求超时。
- `created_at` / `updated_at`。

不同渠道的密钥结构：

```json
{
  "turnstile": {
    "site_key": "0x4AAAA...",
    "secret_key": "0x4AAAA..."
  },
  "recaptcha": {
    "site_key": "6Lc...",
    "secret_key": "6Lc...",
    "version": "v2"
  },
  "geetest": {
    "captcha_id": "...",
    "captcha_key": "..."
  }
}
```

## 7. 路由策略

MVP 支持 3 种策略。

### 7.1 固定渠道

应用或全局配置指定一个上游渠道，所有请求都走该渠道。

适合首版上线和问题排查。

### 7.2 权重随机

多个可用渠道按权重选择。

示例：

- Turnstile 权重 70。
- 极验权重 20。
- reCAPTCHA 权重 10。

### 7.3 故障降级

当某个渠道在短时间内连续失败或超时，临时切换到备用渠道。

MVP 可以先通过人工禁用渠道实现；后续再做自动熔断。

## 8. 数据库设计

数据库使用 Cloudflare D1，SQL 以 SQLite 兼容语法为准。

### 8.1 users

注册用户表。

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### 8.2 apps

用户应用表。

```sql
CREATE TABLE apps (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  site_key TEXT NOT NULL UNIQUE,
  secret_key_hash TEXT NOT NULL,
  secret_key_hint TEXT NOT NULL,
  allowed_domains TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active',
  route_strategy TEXT NOT NULL DEFAULT 'global',
  provider_channel_id TEXT,
  daily_quota INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

说明：

- `secret_key` 只在创建或重置时展示一次。
- 数据库只保存 `secret_key_hash`，不保存明文。
- `allowed_domains` 存 JSON 数组，MVP 可接受；后续可拆成应用域名表。

### 8.3 provider_channels

上游渠道配置表。

```sql
CREATE TABLE provider_channels (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  name TEXT NOT NULL,
  public_key TEXT NOT NULL,
  secret_config TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  weight INTEGER NOT NULL DEFAULT 100,
  priority INTEGER NOT NULL DEFAULT 100,
  timeout_ms INTEGER NOT NULL DEFAULT 5000,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

说明：

- `secret_config` 必须加密存储。
- 加密主密钥放在 Workers Secret，不写入代码和数据库。

### 8.4 challenges

验证码挑战记录表。MVP 可将热数据放 KV，校验完成后再写 D1。

```sql
CREATE TABLE challenges (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL,
  provider_channel_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  action TEXT,
  hostname TEXT,
  remote_ip_hash TEXT,
  status TEXT NOT NULL DEFAULT 'created',
  expires_at TEXT NOT NULL,
  verified_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (app_id) REFERENCES apps(id),
  FOREIGN KEY (provider_channel_id) REFERENCES provider_channels(id)
);
```

状态：

- `created`：已创建，等待校验。
- `verified`：校验成功，不能重复使用。
- `failed`：校验失败，不能重复使用。
- `expired`：已过期。

### 8.5 verification_logs

校验调用日志表。

```sql
CREATE TABLE verification_logs (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  challenge_id TEXT,
  provider_channel_id TEXT,
  provider TEXT,
  success INTEGER NOT NULL,
  error_code TEXT,
  action TEXT,
  hostname TEXT,
  remote_ip_hash TEXT,
  latency_ms INTEGER,
  created_at TEXT NOT NULL,
  FOREIGN KEY (app_id) REFERENCES apps(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 8.6 api_keys 或 sessions

后台登录会话表。

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  ip_hash TEXT,
  user_agent TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 9. API 设计

### 9.1 公共验证码 API

#### POST /v1/challenges

创建验证码挑战。

请求：

```json
{
  "site_key": "tc_site_xxx",
  "action": "login",
  "hostname": "www.user-site.com"
}
```

响应：

```json
{
  "challenge_id": "ch_01HX...",
  "provider": "turnstile",
  "public_key": "0x4AAAA...",
  "script_url": "https://challenges.cloudflare.com/turnstile/v0/api.js",
  "options": {
    "theme": "auto",
    "size": "normal"
  },
  "expires_in": 300
}
```

#### POST /v1/verify

统一服务端校验。

请求：

```json
{
  "secret_key": "tc_secret_xxx",
  "captcha_token": "tc_token_xxx",
  "remote_ip": "203.0.113.10",
  "action": "login"
}
```

响应：

```json
{
  "success": true,
  "challenge_id": "ch_01HX...",
  "provider": "turnstile",
  "score": null,
  "action": "login",
  "hostname": "www.user-site.com"
}
```

### 9.2 用户后台 API

#### POST /auth/register

用户注册。

#### POST /auth/login

用户登录。

#### POST /auth/logout

用户退出。

#### GET /me

获取当前用户信息。

#### GET /apps

获取当前用户应用列表。

#### POST /apps

创建应用。

请求：

```json
{
  "name": "My Website",
  "allowed_domains": ["example.com", "www.example.com"]
}
```

#### PATCH /apps/:id

更新应用名称、允许域名、状态或路由策略。

#### POST /apps/:id/reset-secret

重置应用密钥。

#### GET /apps/:id/stats

获取应用统计。

#### GET /apps/:id/logs

获取应用最近调用日志。

### 9.3 管理后台 API

所有管理 API 都要求 `role = admin`。

#### GET /admin/users

用户列表。

#### PATCH /admin/users/:id

更新用户状态。

#### GET /admin/apps

应用列表。

#### GET /admin/provider-channels

上游渠道列表。

#### POST /admin/provider-channels

创建上游渠道。

#### PATCH /admin/provider-channels/:id

更新上游渠道。

#### POST /admin/provider-channels/:id/test

测试上游渠道配置是否可用。

#### GET /admin/stats

全局统计快照（一次性返回）。管理员鉴权。响应字段：

```json
{
  "success": true,
  "stats": {
    "generated_at": "2026-06-29T11:03:00.000Z",
    "today": {
      "total": 128600,
      "success_total": 126950,
      "failed_total": 1650,
      "success_rate": 98.72,
      "avg_latency_ms": 186
    },
    "all_time": {
      "total": 128600,
      "success_total": 126950,
      "failed_total": 1650,
      "success_rate": 98.72,
      "avg_latency_ms": 186
    },
    "by_provider": [
      { "provider": "turnstile", "total": 98000, "success_total": 97200, "success_rate": 99.18 }
    ],
    "top_apps": [
      { "id": "app_xxx", "name": "My Website", "key": "tc_site_xxx", "user": "admin@example.com", "calls": 38240, "success_rate": 99.12, "avg_latency_ms": 180, "route": "geo_country", "status": "active" }
    ],
    "active_apps": 342
  }
}
```

#### GET /admin/stats/stream

SSE（Server-Sent Events）实时统计推送流。管理员鉴权（依赖 session cookie，`EventSource` 无法自定义 header，因此跨域部署需保证同源或使用 cookie 透传）。

- 鉴权失败时返回 401 JSON，连接不会建立。
- 连接建立后，服务端每 15 秒推送一次 `data:` 帧，payload 为上述 `stats` 对象（不带外层 `success` 包装）。
- 每 20 秒发送一个 `: keepalive` 注释帧，防止边缘节点空闲回收。
- 客户端断开（`request.signal` abort）时服务端立即清理定时器。
- 单连接最长存活 5 分钟，到期后服务端主动关闭，客户端 `EventSource` 会自动重连。
- 浏览器内置自动重连，无需前端实现退避。

前端示例（`admin-dashboard.html` 已采用）：

```js
const es = new EventSource('/admin/stats/stream', { withCredentials: true });
es.onmessage = (event) => {
  const snapshot = JSON.parse(event.data);
  renderDashboard(snapshot);
};
// 页面隐藏时 es.close() 节省资源；可见时重新 new EventSource()
```

## 10. 前端脚本设计

`client.js` 对用户暴露全局对象 `window.TeavenCaptcha`。

### 10.1 API

```ts
window.TeavenCaptcha.ready(callback: () => void): void;

window.TeavenCaptcha.render(container: string | HTMLElement, options: {
  siteKey: string;
  action?: string;
  theme?: 'auto' | 'light' | 'dark';
  size?: 'normal' | 'compact';
  callback?: (token: string) => void;
  errorCallback?: (error: CaptchaClientError) => void;
}): Promise<string>;

window.TeavenCaptcha.reset(widgetId?: string): void;
```

### 10.2 客户端 token 结构

`client.js` 回调给业务方的是 `captcha_token`，业务方不需要解析。首版内部 payload 至少包含：

```json
{
  "challenge_id": "ch_01HX...",
  "provider_token": "upstream_token_xxx"
}
```

为了便于表单提交，可以将其 base64url 编码为一个字符串。服务端 `/v1/verify` 再解析出 `challenge_id` 和 `provider_token`。

## 11. 安全设计

### 11.1 应用密钥

- `site_key` 可以公开，用于前端初始化。
- `secret_key` 只能放在用户服务端。
- 数据库只保存 `secret_key_hash`。
- 重置密钥后旧密钥立即失效。

### 11.2 上游密钥

- 上游密钥由管理员配置。
- `secret_config` 加密后存入 D1。
- 加密主密钥使用 Workers Secret 注入。
- 管理后台默认不回显完整上游密钥。

### 11.3 域名校验

- `/v1/challenges` 必须校验 `Origin` 或 `Referer`。
- `hostname` 必须在应用 `allowed_domains` 中。
- 允许域名支持精确匹配，MVP 不建议支持任意通配符。

### 11.4 防重放

- `challenge_id` 有效期默认 5 分钟。
- 一个 challenge 只能验证一次。
- 校验成功或失败后都应标记为终态。

### 11.5 限流

MVP 限流维度：

- 按 IP 限制 `/auth/login`。
- 按 `site_key + IP` 限制 `/v1/challenges`。
- 按 `app_id` 限制 `/v1/verify`。
- 按用户限制后台 API。

### 11.6 日志隐私

- 不直接保存完整 IP，保存哈希或截断后的 IP。
- 不保存上游返回的敏感原始数据，必要时只保存错误码。
- 日志默认保留 30 天。

## 12. 错误码规范

统一错误响应：

```json
{
  "success": false,
  "error_code": "invalid_secret_key",
  "message": "Invalid secret key."
}
```

常用错误码：

| 错误码 | 含义 |
| --- | --- |
| `invalid_request` | 请求参数错误 |
| `invalid_site_key` | 站点公钥不存在 |
| `invalid_secret_key` | 应用密钥错误 |
| `app_disabled` | 应用已禁用 |
| `domain_not_allowed` | 域名不在白名单 |
| `rate_limited` | 请求过于频繁 |
| `quota_exceeded` | 配额耗尽 |
| `provider_unavailable` | 上游渠道不可用 |
| `challenge_expired` | challenge 已过期 |
| `challenge_consumed` | challenge 已被使用或已进入终态 |
| `invalid_token` | 上游 token 无效 |
| `verify_timeout` | 上游校验超时 |
| `internal_error` | 服务内部错误 |

## 13. 统计指标

用户后台展示：

- 今日调用量。
- 今日成功量。
- 今日失败量。
- 成功率。
- 最近 24 小时趋势。
- 最近错误日志。

管理后台展示：

- 全平台调用量。
- 按渠道统计调用量和成功率。
- 按用户、应用排行。
- 上游平均延迟。
- 上游失败率。

## 14. 推荐目录结构

如果使用 TypeScript，建议采用以下结构：

```text
teaven-captcha/
  apps/
    dashboard/              # Cloudflare Pages 前端，用户后台和管理后台
    worker/                 # Cloudflare Workers API
  packages/
    client/                 # 对外 client.js SDK
    shared/                 # 共享类型、错误码、工具函数
  migrations/               # D1 SQL 迁移
  docs/
    api.md
    providers.md
    deployment.md
  wrangler.toml
  package.json
```

MVP 可以先采用更简单结构：

```text
teaven-captcha/
  src/
    worker/
    dashboard/
    client/
    shared/
  migrations/
  docs/
  wrangler.toml
  package.json
```

## 15. 环境变量

Workers 环境变量：

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `APP_ENV` | plain text | `development` / `production` |
| `API_BASE_URL` | plain text | API 基础地址 |
| `DASHBOARD_URL` | plain text | 后台地址 |
| `SECRET_ENCRYPTION_KEY` | secret | 加密上游密钥的主密钥 |
| `SESSION_SECRET` | secret | 登录会话签名密钥 |

D1 / KV 绑定：

```toml
[[d1_databases]]
binding = "DB"
database_name = "teaven-captcha"
database_id = "xxxx"

[[kv_namespaces]]
binding = "CHALLENGE_KV"
id = "xxxx"
```

## 16. 开发里程碑

### Phase 1：基础工程

- 初始化 Workers + Pages 项目。
- 接入 D1 migrations。
- 实现统一响应、错误码、鉴权中间件。
- 实现用户注册、登录、会话。

### Phase 2：应用与密钥

- 实现应用 CRUD。
- 生成 `site_key` 和 `secret_key`。
- 实现允许域名配置。
- 实现用户后台应用列表和接入文档页。

### Phase 3：上游渠道

- 实现 provider adapter 抽象。
- 接入 Cloudflare Turnstile。
- 接入 Google reCAPTCHA 或极验。
- 实现管理后台渠道配置。

### Phase 4：验证码闭环

- 实现 `/v1/challenges`。
- 实现 `/v1/verify`。
- 实现 `client.js` 的 render、reset、callback。
- 完成一个示例网站的完整接入。

### Phase 5：统计与稳定性

- 实现 verification logs。
- 实现应用级统计。
- 实现基础限流。
- 增加上游超时、错误处理和手动故障切换。

### Phase 6：上线准备

- 配置生产域名。
- 配置 Workers Secret。
- 配置 WAF 和 Rate Limiting。
- 压测核心接口。
- 编写正式用户接入文档。

## 17. 测试计划

单元测试：

- 密钥生成与校验。
- 域名匹配。
- 路由策略。
- Provider adapter 响应解析。
- 错误码映射。

集成测试：

- 注册、登录、创建应用。
- 创建 challenge。
- 成功 verify。
- 重复 verify 被拒绝。
- 过期 challenge 被拒绝。
- 应用禁用后请求被拒绝。
- 域名不匹配被拒绝。

手工验收：

- Turnstile 前端渲染和服务端校验。
- reCAPTCHA 或极验前端渲染和服务端校验。
- 用户后台查看统计。
- 管理后台启停渠道。

## 18. 关键实现建议

- 先打通 Turnstile，因为它与 Cloudflare 部署环境最匹配。
- `client.js` 不要绑定具体上游，必须由 `/v1/challenges` 返回 provider 配置后动态加载。
- `/v1/verify` 必须由用户服务端调用，不能允许浏览器直接携带 `secret_key` 调用。
- 上游 verify 超时时间控制在 3 到 5 秒，避免 Worker 长时间等待。
- 日志写入可以先同步写 D1，流量上来后再改为 Queue 异步写入。
- 管理后台改密钥类操作必须记录审计日志，MVP 可以先写入普通日志表。

## 19. 后续商业化扩展

上线稳定后再考虑：

- 套餐和余额。
- 按量扣费。
- 用户 API 调用签名。
- 渠道成本统计。
- 自动熔断和健康检查。
- 代理商和子账号。
- 企业独立渠道配置。
- Webhook 通知。
- SDK：PHP、Node.js、Python、Go。

## 20. 未决策问题

需要在开发前确认：

- 首批除 Turnstile 外，第二个上游优先接 Google reCAPTCHA 还是极验。
- 是否需要手机号注册，还是只支持邮箱注册。
- 后台前端使用 React、Vue 还是其他框架。
- 是否首版就需要充值计费。
- 日志保留时长和隐私策略要求。
