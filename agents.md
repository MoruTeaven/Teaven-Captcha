# Agents Guide

本文件给代码代理使用，用于快速理解并安全修改 Teaven Captcha 项目。

## 项目概览

Teaven Captcha 是一个基于 Cloudflare Workers + D1 的验证码聚合平台 MVP。

核心能力：

- 用户注册、登录、退出和当前用户信息。
- 用户应用管理、密钥重置、调用日志和统计。
- 管理员配置上游验证码渠道。
- 统一浏览器 SDK：`GET /client.js`。
- 统一挑战创建接口：`POST /v1/challenges`。
- 统一服务端校验接口：`POST /v1/verify`。
- 当前已实现 Turnstile 校验和 Geetest v4 基础校验。

## 技术栈

- Runtime：Cloudflare Workers。
- 数据库：Cloudflare D1，SQL 以 SQLite 兼容语法为准。
- 语言：TypeScript，ES Modules。
- 本地开发与部署：Wrangler。

## 目录结构

- `src/index.ts`：Worker 入口、路由、业务处理函数。
- `src/http.ts`：JSON 响应、错误响应、CORS、请求体校验工具。
- `src/crypto.ts`：ID、密钥、哈希、加密封装相关工具。
- `src/providers.ts`：上游验证码客户端配置和校验适配器。
- `src/client-script.ts`：浏览器端 `window.TeavenCaptcha` SDK。
- `src/types.ts`：D1 行类型、环境变量和公开类型。
- `migrations/`：D1 数据库迁移。
- `wrangler.toml`：本地开发配置和 D1 binding。
- `README.md`：当前已实现功能、本地开发和接入示例。
- `DEVELOPMENT.md`：产品、架构、接口和里程碑设计文档。
- `ADMIN_DASHBOARD_DESIGN.md`：管理后台设计稿说明。

## 常用命令

安装依赖：

```bash
npm install
```

执行本地 D1 迁移：

```bash
npm run db:migrate:local
```

启动本地 Worker：

```bash
npm run dev
```

类型检查：

```bash
npm run typecheck
```

打包/部署检查：

```bash
npx wrangler deploy --dry-run
```

远程 D1 迁移：

```bash
npm run db:migrate:remote
```

## 修改原则

- 优先做最小正确修改，避免引入不必要的框架、抽象或兼容层。
- 保持 Workers Runtime 兼容，不要使用 Node.js 专属 API。
- API 响应应保持统一格式：成功响应包含 `success: true`，错误响应包含 `success: false`、`error_code`、`message`。
- 对外接口、错误码、数据库字段变更时，同步更新 `README.md` 或 `DEVELOPMENT.md` 中对应说明。
- 不要把密钥、token、真实上游凭证写入仓库。
- 不要直接修改 `node_modules/`、`.wrangler/` 或本地生成状态文件。
- 如果新增数据库字段或表，必须新增迁移文件，不要只改 TypeScript 类型。

## 数据库约定

- 数据表由 `migrations/0001_initial.sql` 初始化。
- `users`：平台用户，首个注册用户会成为管理员。
- `sessions`：登录会话，保存 token hash。
- `apps`：用户应用，保存 `site_key` 和 `secret_key_hash`。
- `provider_channels`：上游验证码渠道配置，`secret_config` 为加密后的 JSON。
- `challenges`：验证码挑战状态，终态包括 `verified`、`failed`、`expired`。
- `verification_logs`：校验调用日志和统计来源。

## 安全注意事项

- `wrangler.toml` 中的 `SECRET_ENCRYPTION_KEY` 和 `SESSION_SECRET` 仅可用于本地开发。
- 生产环境必须使用 Workers Secret：`wrangler secret put SECRET_ENCRYPTION_KEY`、`wrangler secret put SESSION_SECRET`。
- `secret_key` 只在创建或重置应用时返回一次，服务端只保存 hash 和 hint。
- 处理 IP 时使用 hash，不要在日志中保存明文 IP。
- 校验 challenge 时要保持一次性使用语义，避免重复验证同一个 token。

## 上游验证码适配

- 公开支持的 provider 类型定义在 `src/types.ts` 的 `CaptchaProvider`。
- 新增 provider 时需要同时更新：`getClientConfig`、`verifyProvider`、类型定义、README 接入说明。
- 目前 `isSupportedPublicProvider` 允许 `turnstile`、`geetest`、`recaptcha`、`hcaptcha`，但实际校验仅实现 `turnstile` 和 `geetest`。
- 上游请求应使用超时控制，失败时转换为统一 `ApiError`。

## 验证要求

代码修改后至少运行：

```bash
npm run typecheck
```

涉及 Worker 打包、依赖、运行时 API 或 `wrangler.toml` 时，额外运行：

```bash
npx wrangler deploy --dry-run
```

涉及 D1 schema 时，先本地迁移并确认：

```bash
npm run db:migrate:local
```

## 协作提示

- 工作区可能存在用户或其他代理的未提交改动，不要回滚不属于当前任务的修改。
- 修改前先阅读相关文件和现有文档，不要凭空重构。
- 变更公共 API 或数据结构时，保持文档、类型、迁移和示例一致。
- 如果需求与现有产品文档冲突，先指出冲突并询问确认。
