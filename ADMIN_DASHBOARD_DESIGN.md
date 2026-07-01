# Teaven Captcha 管理后台设计文档

## 一、业务概述

Teaven Captcha 是基于 Cloudflare Workers + D1 的人机验证码聚合平台，管理后台需要为平台管理员提供完整的运营和配置能力。

## 二、模块规划

### 2.1 仪表盘（Dashboard）

**核心指标卡片：**
- 今日调用量（趋势对比）
- 今日成功率（趋势对比）
- 平均验证耗时（趋势对比）
- 活跃应用数（趋势对比）

**可视化图表：**
- 调用趋势图（24小时/7天/30天切换）
- 渠道分布环形图
- 地区调用热力图（可选）

**实时状态：**
- 上游渠道健康状态
- 最近操作时间线
- 异常告警提示

### 2.2 渠道管理（Provider Channels）

**功能列表：**
- 渠道列表展示（Turnstile、Geetest、reCAPTCHA、hCaptcha）
- 新增/编辑/删除渠道
- 渠道状态启用/禁用
- 渠道测试连接
- 权重与优先级配置
- 超时时间设置

**数据字段：**
- 渠道类型（provider）
- 显示名称（name）
- Public Key
- Secret Config（加密存储）
- 权重（weight）
- 优先级（priority）
- 超时时间（timeout_ms）
- 状态（active/inactive/error）
- 创建时间
- 更新时间

### 2.3 应用管理（Applications）

**功能列表：**
- 应用列表展示
- 创建应用
- 编辑应用配置
- 重置密钥（secret_key）
- 查看应用日志
- 查看应用统计
- 禁用/启用应用

**数据字段：**
- 应用名称（name）
- 所属用户（user_id）
- Site Key（公钥）
- Secret Key（私钥，仅展示一次）
- 允许域名（allowed_domains）
- 路由策略（route_strategy）
- 今日调用量
- 成功率
- 状态（active/warning/disabled）
- 创建时间

### 2.4 用户管理（Users）

**功能列表：**
- 用户列表展示
- 用户详情查看
- 用户应用列表
- 用户调用统计
- 禁用/启用用户
- 重置密码
- 设置管理员权限

**数据字段：**
- 用户ID
- 邮箱（email）
- 姓名（name）
- 角色（admin/user）
- 应用数量
- 总调用量
- 注册时间
- 最后登录时间
- 状态（active/disabled）

### 2.5 数据分析（Analytics）

**维度分析：**
- 调用量趋势（按小时/天/周/月）
- 成功率分析
- 响应时间分析
- 渠道对比分析
- 地区分布分析
- 错误码分布

**筛选条件：**
- 时间范围
- 渠道类型
- 应用筛选
- 地区筛选
- 状态筛选

**导出功能：**
- 导出 CSV
- 导出 PDF 报告

### 2.6 调用日志（Request Logs）

**功能列表：**
- 日志列表展示
- 日志详情查看
- 搜索与筛选
- 实时日志流

**数据字段：**
- 请求ID
- 应用ID
- 渠道类型
- 请求时间
- 响应时间
- 验证结果（success/fail）
- 错误码
- 错误信息
- 客户端IP（脱敏）
- 用户代理
- 地区信息

**筛选条件：**
- 时间范围
- 应用
- 渠道
- 结果状态
- 错误码
- IP地址

### 2.7 审计日志（Audit Logs）

**记录操作：**
- 用户登录/退出
- 应用创建/修改/删除
- 渠道配置变更
- 密钥重置
- 系统设置变更
- 权限变更

**数据字段：**
- 操作ID
- 操作类型
- 操作人
- 操作时间
- 操作详情
- IP地址
- 操作结果

### 2.8 系统设置（System Settings）

**配置项：**
- 默认上游渠道
- 全局超时时间
- 默认路由策略
- 日志保留天数
- 默认每日配额
- 安全选项
  - 校验 Origin/Referer
  - IP 哈希存储
  - 自动禁用异常应用
- 故障降级开关
- 通知配置

## 三、页面路由规划

```
/                    → 仪表盘
/channels            → 渠道管理
/channels/:id        → 渠道详情
/apps                → 应用管理
/apps/:id            → 应用详情
/apps/:id/logs       → 应用日志
/apps/:id/stats      → 应用统计
/users               → 用户管理
/users/:id           → 用户详情
/analytics           → 数据分析
/logs                → 调用日志
/logs/:id            → 日志详情
/audit               → 审计日志
/settings            → 系统设置
```

## 四、API 接口对应

### 4.1 认证相关
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `POST /auth/logout` - 用户退出
- `GET /auth/me` - 当前用户信息

### 4.2 应用管理
- `GET /apps` - 应用列表
- `POST /apps` - 创建应用
- `PUT /apps/:id` - 更新应用
- `DELETE /apps/:id` - 删除应用
- `POST /apps/:id/reset-key` - 重置密钥

### 4.3 渠道管理（管理员）
- `GET /admin/provider-channels` - 渠道列表
- `POST /admin/provider-channels` - 创建渠道
- `PUT /admin/provider-channels/:id` - 更新渠道
- `DELETE /admin/provider-channels/:id` - 删除渠道

### 4.4 验证相关
- `POST /v1/challenges` - 创建验证挑战
- `POST /v1/verify` - 服务端校验

## 五、设计规范

### 5.1 主题色
- 主色：青色系 `#0f9f7a`（浅色）/ `#21c69a`（深色）
- 背景：柔和灰色系
- 文字：深灰/浅灰对比

### 5.2 组件风格
- 圆角：16px（卡片）/ 12px（按钮）/ 999px（胶囊）
- 阴影：柔和投影
- 边框：半透明边框
- 动画：平滑过渡

### 5.3 布局结构
- 左侧导航栏（可折叠）
- 顶部导航栏（Sticky）
- 面包屑导航
- 主内容区
- 页脚

### 5.4 响应式断点
- 移动端：< 860px
- 平板：860px - 1180px
- PC：> 1180px

## 六、数据模拟说明

管理后台使用结构化模拟数据，包括：
- 5 个示例应用
- 4 个上游渠道
- 3 个示例用户
- 24 小时调用趋势数据
- 最近操作时间线

所有数据均符合业务逻辑，不使用 test/demo/example 等占位符。

## 七、技术实现

### 7.1 前端技术
- 单文件 HTML
- 内嵌 CSS（CSS Variables）
- 内嵌 JavaScript（原生）
- Remix Icon 图标库

### 7.2 功能特性
- 深色/浅色模式切换（跟随系统 + 手动切换）
- 本地存储持久化
- 响应式布局
- 表格搜索/筛选/排序
- 抽屉/弹窗交互
- Toast 提示

### 7.3 资源依赖
- Remix Icon（BootCDN）
- Inter 字体（系统字体栈）

## 八、后续扩展

### 8.1 短期计划
- 接入真实 API
- 完善用户管理页面
- 添加更多图表类型

### 8.2 中期计划
- 多语言支持
- 更细粒度权限控制
- 实时数据推送

### 8.3 长期计划
- 移动端 App
- 开放 API 文档
- 开发者控制台
