# 用户面板重建策划

## 背景

数据事故永久丢失了 5 个未提交文件，本质是一个「用户面板」功能。用户面板**不是 admin 面板的缩水版**，而是一个全新的独立页面，有自己的布局、导航和视觉语言。

## 设计定位

| 维度 | admin 面板 | 用户面板（全新） |
|---|---|---|
| 布局 | 左侧边栏 + 顶栏 + 内容 | **同样顶栏 + 侧边栏 + 内容**（布局一致） |
| 导航 | 7 个页面，分组 | **3 个侧边栏项**（概览 / 应用 / 日志） |
| 应用展示 | 表格行 | **卡片网格**（每个应用一张卡） |
| 品牌色调 | admin 绿 `#0f9f7a` | **用户蓝 `#3777ff`**，区分身份 |
| 视觉密度 | 高密度信息展示 | **留白更多，更轻量** |
| 主题 | 明暗双主题 | 同样支持明暗 |
| 图标库 | Remix Icon | 同用 Remix Icon（品牌一致） |
| 字体栈 | Inter + 系统字体 | 同用（品牌一致） |

## 页面结构（3 个视图）

### 1. 认证视图（登录 / 注册）

双模式切换，单卡片居中布局：
- **登录**：邮箱 + 密码
- **注册**：昵称 + 邮箱 + 密码 + 确认密码
- tab 切换登录/注册，无页面跳转
- 品牌标识居中，区别于 admin 的左上角品牌

### 2. 概览 `#overview`

- **3 张指标卡**：应用总数 / 今日调用量 / 今日成功率
- **应用概览卡片列表**：每个应用一张卡片，显示：
  - 应用名称 + 状态徽章
  - site_key（等宽字体）
  - 今日调用量 / 成功率 / 平均耗时
  - 快捷操作：查看日志、重置密钥
- 空状态引导创建第一个应用
- 刷新按钮（无 SSE，用户无 admin 权限）

### 3. 应用管理 `#apps`

- **卡片网格**布局（非表格），每张应用卡片：
  - 名称 + 状态徽章
  - site_key + secret_key_hint（脱敏）
  - 允许域名列表
  - 路由策略徽章
  - 创建时间
  - 操作按钮：编辑、重置密钥、切换状态
- **新建应用**按钮 → 模态框
- **编辑应用**模态框：名称、允许域名、路由策略、状态
- **重置密钥**：确认 → 调用 API → 新密钥只显示一次 + 复制按钮
- 搜索 + 状态筛选

### 4. 调用日志 `#logs`

- 应用选择下拉框（从 `/apps` 加载）
- 日志表格：渠道、结果、错误码、主机名、耗时、时间
- 刷新按钮
- 空状态提示

## CSS 策略

**不从 admin 复制 CSS。** 用户面板有自己独立的设计系统：

- **自己的 CSS 变量**：用户蓝色调 `--accent: #3777ff`，更大的圆角，更多留白
- **自己的组件样式**：导航栏（非侧边栏）、应用卡片（非表格行）、不同的模态框风格
- **共享的品牌元素**：Remix Icon CDN、Inter 字体栈、明暗主题机制
- 预计 ~400 行 CSS

## JS 架构

| 模块 | 策略 |
|---|---|
| IIFE 模式 | 相同（纯前端 SPA，无框架） |
| API helper | 相同模式（`api(method, path, body)` + Bearer token + 401 处理） |
| TOKEN_KEY | `teaven-user-token`（独立于 admin） |
| 主题 | `teaven-user-theme`，独立管理 |
| Toast | 相同模式 |
| 路由 | hash 路由，pages = `['overview','apps','logs']` |
| 格式化函数 | 相同的 fmtNum/fmtPct/fmtMs/fmtDate |
| 概览数据 | 遍历 `/apps` + 并行 `/apps/:id/stats` 客户端聚合 |
| 应用 CRUD | `POST /apps`、`PATCH /apps/:id`、`POST /apps/:id/reset-secret` |
| 日志 | `GET /apps/:id/logs` |
| 认证 | register + login + logout + checkAuth |
| SSE | 无（用户无权限） |

### 概览聚合逻辑

```javascript
async function loadOverview() {
  const { apps } = await api('GET', '/apps');
  if (!apps.length) return renderEmptyOverview();
  const stats = await Promise.all(
    apps.map(a => api('GET', `/apps/${a.id}/stats`).catch(() => null))
  );
  // 客户端聚合：总调用量、成功率、平均耗时
  const merged = apps.map((a, i) => ({
    ...a,
    stats: stats[i]?.stats || { total: 0, success_total: 0, avg_latency_ms: 0 }
  }));
  renderOverview(merged);
}
```

## 实现步骤

### Step 1: user-dashboard.html（新建）

单文件 SPA：
1. `<head>` — meta + Remix Icon CDN + `<style>` 独立 CSS（用户蓝色调）
2. `<body>` — 认证视图 + 主视图
3. 模态框（新建/编辑应用、重置密钥）
4. Toast
5. `<script>` — IIFE JS

预计 ~1100 行。

### Step 2: scripts/build.js（重命名 + 扩展）

`build-admin.js` → `build.js`，支持双 HTML：
```javascript
const targets = [
  { html: 'admin-dashboard.html', ts: 'src/admin-script.ts', exportName: 'ADMIN_HTML' },
  { html: 'user-dashboard.html', ts: 'src/user-script.ts', exportName: 'USER_HTML' },
];
```

### Step 3: src/index.ts（编辑）

添加 import 和路由（~10 行）：
```typescript
import { USER_HTML } from './user-script';
// ...route:
if (request.method === 'GET' && (pathname === '/dashboard' || pathname === '/dashboard/')) {
  return new Response(USER_HTML, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}
```

### Step 4: package.json（编辑）

build script 路径改为 `scripts/build.js`。

## 文件清单

| 文件 | 操作 | 说明 |
|---|---|---|
| `user-dashboard.html` | 新建 | 全新用户面板 SPA（~1100 行） |
| `src/user-script.ts` | 自动生成 | build 脚本从 HTML 生成 |
| `scripts/build-admin.js` → `scripts/build.js` | 重命名+扩展 | 支持双 HTML |
| `src/index.ts` | 编辑 | 添加 import + 路由 |
| `package.json` | 编辑 | build 路径 |
| `src/helpers.ts` | YAGNI | 不提前创建 |

## 验证

1. `npm run typecheck` — 无错误
2. `npm run build` — 生成 admin-script.ts 和 user-script.ts
3. `npx wrangler deploy --dry-run` — 打包成功
