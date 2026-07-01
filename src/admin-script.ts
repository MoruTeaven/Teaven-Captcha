// Auto-generated from admin-dashboard.html. Do not edit manually.
export const ADMIN_HTML = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>Teaven Captcha 管理后台</title>
  <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/remixicon/4.2.0/remixicon.min.css">
  <style>
    :root {
      --bg: #f7f8fa;
      --surface: rgba(255, 255, 255, 0.84);
      --surface-solid: #ffffff;
      --surface-muted: #f1f3f5;
      --surface-hover: #f8fafc;
      --border: rgba(15, 23, 42, 0.09);
      --border-strong: rgba(15, 23, 42, 0.14);
      --text: #111827;
      --text-muted: #6b7280;
      --text-soft: #9ca3af;
      --accent: #0f9f7a;
      --accent-weak: rgba(15, 159, 122, 0.1);
      --accent-soft: rgba(15, 159, 122, 0.16);
      --success: #12a150;
      --success-bg: rgba(18, 161, 80, 0.1);
      --warning: #b7791f;
      --warning-bg: rgba(183, 121, 31, 0.12);
      --error: #d92d20;
      --error-bg: rgba(217, 45, 32, 0.1);
      --info: #2563eb;
      --info-bg: rgba(37, 99, 235, 0.1);
      --shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
      --shadow-soft: 0 10px 28px rgba(15, 23, 42, 0.06);
      --radius-lg: 22px;
      --radius-md: 16px;
      --radius-sm: 11px;
      --sidebar-width: 280px;
      --sidebar-collapsed: 86px;
      --topbar-height: 72px;
      --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
    }

    [data-theme="dark"] {
      --bg: #090d12;
      --surface: rgba(17, 24, 39, 0.78);
      --surface-solid: #101720;
      --surface-muted: #151d29;
      --surface-hover: #172131;
      --border: rgba(226, 232, 240, 0.1);
      --border-strong: rgba(226, 232, 240, 0.16);
      --text: #f8fafc;
      --text-muted: #a1aab8;
      --text-soft: #6b7280;
      --accent: #21c69a;
      --accent-weak: rgba(33, 198, 154, 0.12);
      --accent-soft: rgba(33, 198, 154, 0.18);
      --success: #3ddc84;
      --success-bg: rgba(61, 220, 132, 0.13);
      --warning: #f5b84b;
      --warning-bg: rgba(245, 184, 75, 0.14);
      --error: #ff6b61;
      --error-bg: rgba(255, 107, 97, 0.13);
      --info: #75a7ff;
      --info-bg: rgba(117, 167, 255, 0.14);
      --shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
      --shadow-soft: 0 14px 38px rgba(0, 0, 0, 0.24);
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      min-height: 100vh;
      color: var(--text);
      background:
        radial-gradient(circle at 16% 8%, var(--accent-weak), transparent 28rem),
        radial-gradient(circle at 86% 12%, rgba(15, 23, 42, 0.05), transparent 22rem),
        var(--bg);
      font-family: var(--font-sans);
      font-size: 14px;
      transition: background 0.28s ease, color 0.28s ease;
    }
    button, input, select, textarea { font: inherit; }
    button { cursor: pointer; }
    a { color: inherit; text-decoration: none; }

    /* === Login View === */
    .login-view {
      display: none;
      place-items: center;
      min-height: 100vh;
      padding: 24px;
    }
    .login-view.is-active { display: grid; }
    .login-card {
      width: min(420px, 100%);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--surface);
      backdrop-filter: blur(18px);
      box-shadow: var(--shadow);
      padding: 36px 28px;
    }
    .login-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 28px;
      justify-content: center;
    }
    .login-brand .brand-mark {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      color: #fff;
      font-size: 20px;
      background: linear-gradient(135deg, #111827, #0f9f7a);
      box-shadow: 0 14px 28px rgba(15, 159, 122, 0.24);
    }
    [data-theme="dark"] .login-brand .brand-mark { background: linear-gradient(135deg, #182230, #21c69a); }
    .login-brand-text { font-size: 20px; font-weight: 900; letter-spacing: -0.03em; }
    .login-subtitle { text-align: center; color: var(--text-muted); margin: 0 0 24px; font-size: 13px; }
    .login-form { display: flex; flex-direction: column; gap: 14px; }
    .login-form .form-field label { font-weight: 800; font-size: 13px; }
    .login-form .control { width: 100%; }
    .login-error { color: var(--error); font-size: 12px; min-height: 18px; }
    .login-button { width: 100%; min-height: 44px; font-size: 15px; }

    /* === App Shell === */
    .app-view { display: none; }
    .app-view.is-active { display: block; }

    .app-shell {
      display: grid;
      grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
      min-height: 100vh;
      transition: grid-template-columns 0.24s ease;
    }
    .app-shell.is-collapsed { grid-template-columns: var(--sidebar-collapsed) minmax(0, 1fr); }

    .sidebar {
      position: sticky;
      top: 0;
      z-index: 30;
      height: 100vh;
      border-right: 1px solid var(--border);
      background: var(--surface);
      backdrop-filter: blur(18px);
      padding: 18px 14px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      transition: width 0.24s ease, transform 0.24s ease, background 0.28s ease;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 42px;
      padding: 0 8px;
      min-width: 0;
    }
    .brand-mark {
      width: 38px;
      height: 38px;
      border-radius: 13px;
      display: grid;
      place-items: center;
      color: #ffffff;
      background: linear-gradient(135deg, #111827, #0f9f7a);
      box-shadow: 0 14px 28px rgba(15, 159, 122, 0.24);
      flex: 0 0 auto;
    }
    [data-theme="dark"] .brand-mark { background: linear-gradient(135deg, #182230, #21c69a); }
    .brand-title { font-size: 17px; line-height: 1.1; font-weight: 800; letter-spacing: -0.03em; white-space: nowrap; }
    .brand-subtitle { margin-top: 3px; color: var(--text-muted); font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap; }
    .sidebar-section-label { padding: 10px 10px 2px; color: var(--text-soft); font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .nav-list { display: flex; flex-direction: column; gap: 4px; margin: 0; padding: 0; list-style: none; }
    .nav-link {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 42px;
      padding: 0 10px;
      border: 0;
      border-radius: 13px;
      color: var(--text-muted);
      background: transparent;
      text-align: left;
      transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
    }
    .nav-link i { font-size: 18px; flex: 0 0 20px; text-align: center; }
    .nav-link span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .nav-link:hover { background: var(--surface-hover); color: var(--text); }
    .nav-link.is-active { background: var(--accent-weak); color: var(--accent); font-weight: 700; }

    .sidebar-footer {
      margin-top: auto;
      padding-top: 14px;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .sidebar-user { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
    .sidebar-user-avatar {
      width: 36px; height: 36px; border-radius: 999px; display: grid; place-items: center;
      color: #fff; font-size: 12px; font-weight: 800; background: var(--accent); flex: 0 0 auto;
    }
    .sidebar-user-info { min-width: 0; }
    .sidebar-user-name { font-weight: 700; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sidebar-user-role { color: var(--text-muted); font-size: 11px; }
    .sidebar-logout {
      width: 32px; height: 32px; border: 0; border-radius: 10px; display: grid; place-items: center;
      color: var(--text-muted); background: transparent; transition: background 0.18s ease, color 0.18s ease;
    }
    .sidebar-logout:hover { background: var(--error-bg); color: var(--error); }

    .app-shell.is-collapsed .brand-copy,
    .app-shell.is-collapsed .nav-link span,
    .app-shell.is-collapsed .sidebar-section-label { display: none; }
    .app-shell.is-collapsed .sidebar { padding-inline: 14px; }
    .app-shell.is-collapsed .nav-link { justify-content: center; padding-inline: 0; }
    .app-shell.is-collapsed .sidebar-footer { justify-content: center; }

    .content-shell { min-width: 0; }
    .topbar {
      position: sticky; top: 0; z-index: 20; height: var(--topbar-height);
      display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 28px;
      border-bottom: 1px solid var(--border);
      background: color-mix(in srgb, var(--bg) 84%, transparent);
      backdrop-filter: blur(18px); transition: background 0.28s ease;
    }
    .topbar-left, .topbar-actions { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .icon-button {
      width: 38px; height: 38px; border: 1px solid var(--border); border-radius: 12px;
      display: grid; place-items: center; color: var(--text-muted); background: var(--surface-solid);
      transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
    }
    .icon-button:hover { color: var(--text); border-color: var(--border-strong); transform: translateY(-1px); }
    .mobile-menu-button { display: none; }

    .avatar {
      width: 38px; height: 38px; border-radius: 999px; display: grid; place-items: center;
      color: #fff; font-size: 13px; font-weight: 800; background: #111827;
    }
    [data-theme="dark"] .avatar { background: #253244; }

    main { width: min(1480px, 100%); margin: 0 auto; padding: 24px 28px 36px; }

    .page-section { display: none; }
    .page-section.is-active { display: block; }

    .breadcrumb { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 12px; margin-bottom: 16px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; margin-bottom: 20px; }
    .page-title { margin: 0; font-size: clamp(24px, 2.2vw, 34px); line-height: 1.12; letter-spacing: -0.04em; font-weight: 900; }
    .page-subtitle { max-width: 760px; margin: 8px 0 0; color: var(--text-muted); line-height: 1.7; }
    .header-actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; }

    .button {
      min-height: 38px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      border: 1px solid var(--border); border-radius: 12px; padding: 0 14px; color: var(--text);
      background: var(--surface-solid); font-weight: 700;
      transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
    }
    .button:hover { transform: translateY(-1px); border-color: var(--border-strong); }
    .button.primary { color: #fff; background: var(--accent); border-color: transparent; }
    .button.ghost { background: transparent; }
    .button.danger { color: var(--error); border-color: var(--error); background: var(--error-bg); }
    .button.sm { min-height: 30px; padding: 0 10px; font-size: 12px; border-radius: 10px; }

    .dashboard-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 16px; }

    .card {
      border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface);
      box-shadow: var(--shadow-soft); backdrop-filter: blur(14px); overflow: hidden;
      transition: background 0.28s ease, border-color 0.28s ease, transform 0.18s ease;
    }
    .card:hover { border-color: var(--border-strong); }
    .card-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 18px 0; }
    .card-title { margin: 0; font-size: 16px; font-weight: 850; letter-spacing: -0.02em; }
    .card-kicker { margin-top: 3px; color: var(--text-muted); font-size: 12px; }
    .card-body { padding: 18px; }

    .span-3 { grid-column: span 3; }
    .span-4 { grid-column: span 4; }
    .span-5 { grid-column: span 5; }
    .span-6 { grid-column: span 6; }
    .span-7 { grid-column: span 7; }
    .span-8 { grid-column: span 8; }
    .span-12 { grid-column: span 12; }

    .metric-card { min-height: 156px; }
    .metric-top { display: flex; justify-content: space-between; gap: 12px; }
    .metric-icon {
      width: 40px; height: 40px; display: grid; place-items: center; border-radius: 14px;
      color: var(--accent); background: var(--accent-weak); flex: 0 0 auto;
    }
    .metric-label { color: var(--text-muted); font-size: 13px; }
    .metric-value {
      margin-top: 10px; font-size: clamp(26px, 2.5vw, 35px); line-height: 1; font-weight: 900;
      letter-spacing: -0.05em; font-variant-numeric: tabular-nums;
    }
    .metric-footer {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      margin-top: 18px; color: var(--text-muted); font-size: 12px;
    }
    .trend { display: inline-flex; align-items: center; gap: 4px; font-weight: 800; color: var(--success); }
    .trend.down { color: var(--error); }

    .badge {
      display: inline-flex; align-items: center; gap: 6px; min-height: 24px; padding: 0 9px;
      border-radius: 999px; font-size: 12px; font-weight: 700; white-space: nowrap; border: 1px solid transparent;
    }
    .badge.success { color: var(--success); background: var(--success-bg); }
    .badge.warning { color: var(--warning); background: var(--warning-bg); }
    .badge.error { color: var(--error); background: var(--error-bg); }
    .badge.info { color: var(--info); background: var(--info-bg); }
    .badge.neutral { color: var(--text-muted); background: var(--surface-muted); }

    .chart-wrap { height: 292px; display: flex; flex-direction: column; gap: 14px; }
    .chart-legend { display: flex; flex-wrap: wrap; gap: 12px; color: var(--text-muted); font-size: 12px; }
    .legend-item { display: inline-flex; align-items: center; gap: 6px; }
    .legend-swatch { width: 10px; height: 10px; border-radius: 999px; background: var(--accent); }
    .legend-swatch.muted { background: var(--text-soft); }

    .line-chart { width: 100%; flex: 1; min-height: 210px; }
    .chart-grid-line { stroke: var(--border); stroke-width: 1; }
    .chart-axis-text { fill: var(--text-soft); font-size: 11px; }
    .chart-line { fill: none; stroke: var(--accent); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    .chart-area { fill: var(--accent-weak); }
    .chart-line-muted { fill: none; stroke: var(--text-soft); stroke-width: 2; stroke-dasharray: 4 6; }

    .channel-list { display: flex; flex-direction: column; gap: 12px; }
    .channel-item {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 12px; border: 1px solid var(--border); border-radius: 15px;
      background: color-mix(in srgb, var(--surface-solid) 72%, transparent);
    }
    .item-main { display: flex; align-items: center; gap: 11px; min-width: 0; }
    .item-icon {
      width: 36px; height: 36px; display: grid; place-items: center; border-radius: 12px;
      background: var(--surface-muted); color: var(--text-muted); flex: 0 0 auto;
    }
    .item-title { font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .item-meta { margin-top: 3px; color: var(--text-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .progress-line { width: 100%; height: 7px; border-radius: 999px; background: var(--surface-muted); overflow: hidden; }
    .progress-line span { display: block; height: 100%; border-radius: inherit; background: var(--accent); }

    .tabs { display: flex; gap: 6px; padding: 4px; border: 1px solid var(--border); border-radius: 13px; background: var(--surface-muted); }
    .tab-button {
      border: 0; border-radius: 10px; padding: 8px 11px; color: var(--text-muted);
      background: transparent; font-size: 12px; font-weight: 800;
    }
    .tab-button.is-active { color: var(--text); background: var(--surface-solid); box-shadow: var(--shadow-soft); }

    .toolbar {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 16px 18px; border-bottom: 1px solid var(--border); flex-wrap: wrap;
    }
    .toolbar-left, .toolbar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

    .field-shell {
      display: inline-flex; align-items: center; gap: 9px; min-height: 38px; padding: 0 12px;
      border: 1px solid var(--border); border-radius: 12px; background: var(--surface-solid); color: var(--text-muted);
    }
    .field-shell input, .field-shell select { border: 0; outline: 0; background: transparent; color: var(--text); min-width: 130px; }

    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 720px; }
    th, td { padding: 14px 18px; text-align: left; border-bottom: 1px solid var(--border); vertical-align: middle; }
    th {
      color: var(--text-muted); font-size: 12px; font-weight: 800;
      background: color-mix(in srgb, var(--surface-muted) 72%, transparent); user-select: none;
    }
    th.sortable { cursor: pointer; }
    td { color: var(--text); }
    tbody tr:hover { background: color-mix(in srgb, var(--accent-weak) 32%, transparent); }
    .mono { font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 12px; color: var(--text-muted); }
    .checkbox { width: 16px; height: 16px; accent-color: var(--accent); }

    .pagination {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 14px 18px; color: var(--text-muted); font-size: 12px; flex-wrap: wrap;
    }
    .page-buttons { display: flex; align-items: center; gap: 6px; }

    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
    .form-field { display: flex; flex-direction: column; gap: 7px; }
    .form-field.full { grid-column: 1 / -1; }
    .form-field label { font-weight: 800; font-size: 13px; }
    .required { color: var(--error); }
    .help { color: var(--text-muted); font-size: 12px; line-height: 1.5; }
    .control {
      width: 100%; min-height: 40px; border: 1px solid var(--border); border-radius: 12px;
      padding: 0 12px; outline: none; color: var(--text); background: var(--surface-solid);
      transition: border-color 0.18s ease, box-shadow 0.18s ease;
    }
    textarea.control { min-height: 84px; padding-block: 10px; resize: vertical; }
    .control:focus { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-weak); }

    .switch { position: relative; width: 42px; height: 24px; display: inline-block; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .switch span {
      position: absolute; inset: 0; border-radius: 999px; background: var(--surface-muted);
      border: 1px solid var(--border); transition: background 0.18s ease;
    }
    .switch span::before {
      content: ""; position: absolute; width: 18px; height: 18px; left: 2px; top: 2px;
      border-radius: 999px; background: #fff; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.16);
      transition: transform 0.18s ease;
    }
    .switch input:checked + span { background: var(--accent); }
    .switch input:checked + span::before { transform: translateX(18px); }

    .drawer-backdrop, .modal-backdrop {
      position: fixed; inset: 0; z-index: 70; display: none;
      background: rgba(2, 6, 23, 0.44); backdrop-filter: blur(6px);
    }
    .drawer-backdrop.is-open, .modal-backdrop.is-open { display: block; }

    .modal {
      position: fixed; left: 50%; top: 50%; z-index: 85;
      width: min(560px, calc(100vw - 32px)); max-height: calc(100vh - 48px);
      display: none; transform: translate(-50%, -50%);
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      background: var(--surface-solid); box-shadow: var(--shadow); overflow: hidden;
    }
    .modal.is-open { display: block; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px; border-bottom: 1px solid var(--border); }
    .modal-title { margin: 0; font-size: 18px; font-weight: 900; letter-spacing: -0.03em; }
    .modal-body { padding: 18px; overflow: auto; max-height: calc(100vh - 200px); }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 18px; border-top: 1px solid var(--border); }

    .toast {
      position: fixed; right: 22px; bottom: 22px; z-index: 100;
      display: flex; align-items: center; gap: 10px; min-width: 280px; max-width: calc(100vw - 44px);
      padding: 13px 14px; border: 1px solid var(--border); border-radius: 15px;
      background: var(--surface-solid); box-shadow: var(--shadow);
      transform: translateY(18px); opacity: 0; pointer-events: none;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }
    .toast.is-visible { transform: translateY(0); opacity: 1; }
    .toast i { font-size: 18px; }
    .toast.toast-success i { color: var(--success); }
    .toast.toast-warning i { color: var(--warning); }
    .toast.toast-error i { color: var(--error); }
    .toast.toast-info i { color: var(--info); }
    .toast strong { display: block; font-size: 13px; }
    .toast span { display: block; margin-top: 2px; color: var(--text-muted); font-size: 12px; }

    .live-status {
      display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px;
      border: 1px solid var(--border); border-radius: 999px; background: var(--surface-solid);
      font-size: 12px; font-weight: 600; color: var(--text-muted); transition: all 0.2s ease;
    }
    .live-status.is-live { border-color: rgba(34, 197, 94, 0.5); color: #16a34a; }
    [data-theme="dark"] .live-status.is-live { color: #4ade80; }
    .live-status.is-stale { border-color: var(--accent); color: var(--accent); }
    .live-status.is-error { border-color: rgba(239, 68, 68, 0.5); color: #dc2626; }
    [data-theme="dark"] .live-status.is-error { color: #f87171; }
    .live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-muted); flex-shrink: 0; }
    .live-status.is-live .live-dot { background: #22c55e; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); animation: live-pulse 2s infinite; }
    .live-status.is-stale .live-dot { background: var(--accent); }
    .live-status.is-error .live-dot { background: #ef4444; }
    @keyframes live-pulse {
      0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); }
      70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
      100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
    }

    .empty-state {
      display: grid; place-items: center; text-align: center; padding: 24px 16px;
      border: 1px dashed var(--border-strong); border-radius: var(--radius-md);
      background: color-mix(in srgb, var(--surface-muted) 54%, transparent);
    }
    .empty-state strong { display: block; font-size: 15px; }
    .empty-state p { margin: 5px 0 0; color: var(--text-muted); font-size: 12px; line-height: 1.6; }

    .loading-spinner {
      display: inline-block; width: 18px; height: 18px;
      border: 2px solid var(--border); border-top-color: var(--accent);
      border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .stat-bar-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; }
    .stat-bar-label { width: 100px; font-weight: 700; font-size: 13px; flex-shrink: 0; }
    .stat-bar-track { flex: 1; height: 8px; border-radius: 999px; background: var(--surface-muted); overflow: hidden; }
    .stat-bar-fill { height: 100%; border-radius: inherit; background: var(--accent); transition: width 0.4s ease; }
    .stat-bar-value { width: 60px; text-align: right; font-size: 13px; font-weight: 700; flex-shrink: 0; }

    .mobile-overlay {
      position: fixed; inset: 0; z-index: 25; display: none;
      background: rgba(2, 6, 23, 0.38); backdrop-filter: blur(4px);
    }
    .mobile-overlay.is-open { display: block; }

    footer { margin-top: 24px; color: var(--text-muted); font-size: 12px; text-align: center; }

    @media (max-width: 1180px) {
      .span-3 { grid-column: span 6; }
      .span-4, .span-5, .span-6, .span-7, .span-8 { grid-column: span 12; }
    }
    @media (max-width: 860px) {
      .app-shell, .app-shell.is-collapsed { grid-template-columns: 1fr; }
      .sidebar {
        position: fixed; left: 0; top: 0; width: min(310px, 86vw);
        transform: translateX(-105%); box-shadow: var(--shadow);
      }
      .sidebar.is-open { transform: translateX(0); }
      .app-shell.is-collapsed .brand-copy,
      .app-shell.is-collapsed .nav-link span,
      .app-shell.is-collapsed .sidebar-section-label { display: block; }
      .app-shell.is-collapsed .nav-link { justify-content: flex-start; padding-inline: 10px; }
      .mobile-menu-button { display: grid; }
      .topbar { padding: 0 16px; }
      main { padding: 20px 16px 28px; }
      .page-header { flex-direction: column; }
      .header-actions { width: 100%; justify-content: flex-start; }
      .span-3, .span-4, .span-5, .span-6, .span-7, .span-8, .span-12 { grid-column: span 12; }
      .form-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 560px) {
      .button { width: 100%; }
      .header-actions .button { flex: 1 1 100%; }
      .metric-card { min-height: 140px; }
    }
  </style>
</head>
<body>
  <!-- ===== Login View ===== -->
  <div class="login-view" id="loginView">
    <div class="login-card">
      <div class="login-brand">
        <div class="brand-mark"><i class="ri-shield-check-line"></i></div>
        <div class="login-brand-text">Teaven Captcha</div>
      </div>
      <p class="login-subtitle">管理员控制台 · 请登录以继续</p>
      <form class="login-form" id="loginForm" novalidate>
        <div class="form-field">
          <label for="loginEmail">邮箱地址</label>
          <input class="control" id="loginEmail" type="email" placeholder="admin@example.com" required autocomplete="email">
        </div>
        <div class="form-field">
          <label for="loginPassword">密码</label>
          <input class="control" id="loginPassword" type="password" placeholder="输入密码" required autocomplete="current-password">
        </div>
        <div class="login-error" id="loginError"></div>
        <button class="button primary login-button" type="submit" id="loginButton">
          <i class="ri-login-box-line"></i> 登录
        </button>
      </form>
    </div>
  </div>

  <!-- ===== App View ===== -->
  <div class="app-view" id="appView">
    <div class="mobile-overlay" id="mobileOverlay"></div>
    <div class="app-shell" id="appShell">
      <aside class="sidebar" id="sidebar" aria-label="主导航">
        <div class="brand">
          <div class="brand-mark"><i class="ri-shield-check-line" aria-hidden="true"></i></div>
          <div class="brand-copy">
            <div class="brand-title">Teaven Captcha</div>
            <div class="brand-subtitle">Admin Console</div>
          </div>
        </div>

        <nav>
          <div class="sidebar-section-label">Platform</div>
          <ul class="nav-list">
            <li><a class="nav-link" href="#dashboard"><i class="ri-dashboard-line"></i><span>仪表盘</span></a></li>
            <li><a class="nav-link" href="#channels"><i class="ri-route-line"></i><span>渠道管理</span></a></li>
            <li><a class="nav-link" href="#apps"><i class="ri-apps-2-line"></i><span>应用管理</span></a></li>
            <li><a class="nav-link" href="#users"><i class="ri-user-settings-line"></i><span>用户管理</span></a></li>
            <li><a class="nav-link" href="#analytics"><i class="ri-bar-chart-2-line"></i><span>数据分析</span></a></li>
          </ul>
          <div class="sidebar-section-label">Operation</div>
          <ul class="nav-list">
            <li><a class="nav-link" href="#logs"><i class="ri-file-list-3-line"></i><span>调用日志</span></a></li>
            <li><a class="nav-link" href="#settings"><i class="ri-equalizer-line"></i><span>系统设置</span></a></li>
          </ul>
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="sidebar-user-avatar" id="sidebarAvatar">AD</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name" id="sidebarUserName">Admin</div>
              <div class="sidebar-user-role" id="sidebarUserRole">超级管理员</div>
            </div>
          </div>
          <button class="sidebar-logout" type="button" id="logoutButton" title="退出登录" aria-label="退出登录"><i class="ri-logout-box-r-line"></i></button>
        </div>
      </aside>

      <div class="content-shell">
        <header class="topbar">
          <div class="topbar-left">
            <button class="icon-button mobile-menu-button" id="mobileMenuButton" type="button" aria-label="打开导航"><i class="ri-menu-line"></i></button>
            <button class="icon-button" id="collapseButton" type="button" aria-label="折叠菜单"><i class="ri-sidebar-fold-line"></i></button>
          </div>
          <div class="topbar-actions">
            <button class="icon-button" id="themeButton" type="button" aria-label="切换主题"><i class="ri-sun-line"></i></button>
            <div class="avatar" id="topbarAvatar">AD</div>
          </div>
        </header>

        <main>
          <!-- ===== Dashboard Page ===== -->
          <section class="page-section" id="page-dashboard">
            <div class="breadcrumb"><span>管理后台</span><i class="ri-arrow-right-s-line"></i><strong>仪表盘</strong></div>
            <div class="page-header">
              <div>
                <h1 class="page-title">验证码服务运行概览</h1>
                <p class="page-subtitle">实时掌握 Teaven Captcha 全平台调用量、成功率、渠道状态与异常趋势。</p>
              </div>
              <div class="header-actions">
                <div class="live-status" id="liveStatus" role="status" aria-live="polite">
                  <span class="live-dot" id="liveDot"></span>
                  <span id="liveText">连接中…</span>
                </div>
                <button class="button ghost" type="button" id="refreshStatsButton"><i class="ri-refresh-line"></i>刷新</button>
              </div>
            </div>

            <section class="dashboard-grid" aria-label="核心指标">
              <article class="card metric-card span-3">
                <div class="card-body">
                  <div class="metric-top">
                    <div>
                      <div class="metric-label">今日调用量</div>
                      <div class="metric-value" id="metricCalls">—</div>
                    </div>
                    <div class="metric-icon"><i class="ri-pulse-line"></i></div>
                  </div>
                  <div class="metric-footer"><span id="metricCallsSub">成功 — · 失败 —</span></div>
                </div>
              </article>
              <article class="card metric-card span-3">
                <div class="card-body">
                  <div class="metric-top">
                    <div>
                      <div class="metric-label">今日成功率</div>
                      <div class="metric-value" id="metricSuccess">—</div>
                    </div>
                    <div class="metric-icon"><i class="ri-check-double-line"></i></div>
                  </div>
                  <div class="metric-footer"><span id="metricSuccessSub">全量 —</span></div>
                </div>
              </article>
              <article class="card metric-card span-3">
                <div class="card-body">
                  <div class="metric-top">
                    <div>
                      <div class="metric-label">平均验证耗时</div>
                      <div class="metric-value" id="metricLatency">—</div>
                    </div>
                    <div class="metric-icon"><i class="ri-timer-flash-line"></i></div>
                  </div>
                  <div class="metric-footer"><span id="metricLatencySub">全量 —</span></div>
                </div>
              </article>
              <article class="card metric-card span-3">
                <div class="card-body">
                  <div class="metric-top">
                    <div>
                      <div class="metric-label">活跃应用数</div>
                      <div class="metric-value" id="metricApps">—</div>
                    </div>
                    <div class="metric-icon"><i class="ri-global-line"></i></div>
                  </div>
                  <div class="metric-footer"><span id="metricAppsSub">—</span></div>
                </div>
              </article>
            </section>

            <section class="dashboard-grid" style="margin-top:16px;">
              <article class="card span-8">
                <div class="card-header">
                  <div>
                    <h2 class="card-title">调用趋势</h2>
                    <div class="card-kicker">基于实时统计快照</div>
                  </div>
                </div>
                <div class="card-body chart-wrap">
                  <div class="chart-legend">
                    <span class="legend-item"><span class="legend-swatch"></span>成功量</span>
                    <span class="legend-item"><span class="legend-swatch muted"></span>失败趋势</span>
                  </div>
                  <svg class="line-chart" id="trendChart" viewBox="0 0 760 260" role="img" aria-label="调用趋势图">
                    <path class="chart-grid-line" d="M48 30H735M48 80H735M48 130H735M48 180H735M48 230H735"></path>
                    <text class="chart-axis-text" x="16" y="34">—</text>
                    <text class="chart-axis-text" x="26" y="234">0</text>
                  </svg>
                </div>
              </article>
              <article class="card span-4">
                <div class="card-header">
                  <div>
                    <h2 class="card-title">渠道分布</h2>
                    <div class="card-kicker">Provider routing share</div>
                  </div>
                </div>
                <div class="card-body">
                  <div id="providerDistribution" class="channel-list">
                    <div class="empty-state"><strong>暂无数据</strong><p>等待统计数据加载…</p></div>
                  </div>
                </div>
              </article>
            </section>

            <section class="dashboard-grid" style="margin-top:16px;">
              <article class="card span-12">
                <div class="card-header">
                  <div>
                    <h2 class="card-title">热门应用</h2>
                    <div class="card-kicker">Top applications by call volume</div>
                  </div>
                </div>
                <div class="table-wrap">
                  <table>
                    <thead><tr><th>应用</th><th>用户</th><th>调用量</th><th>成功率</th><th>平均耗时</th><th>路由</th><th>状态</th></tr></thead>
                    <tbody id="topAppsTableBody">
                      <tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted);">加载中…</td></tr>
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          </section>

          <!-- ===== Channels Page ===== -->
          <section class="page-section" id="page-channels">
            <div class="breadcrumb"><span>管理后台</span><i class="ri-arrow-right-s-line"></i><strong>渠道管理</strong></div>
            <div class="page-header">
              <div>
                <h1 class="page-title">上游渠道管理</h1>
                <p class="page-subtitle">管理 Turnstile、Geetest、reCAPTCHA、hCaptcha 等验证渠道的连接配置与路由权重。</p>
              </div>
              <div class="header-actions">
                <button class="button primary" type="button" id="addChannelButton"><i class="ri-add-line"></i>新增渠道</button>
              </div>
            </div>
            <section class="card span-12">
              <div class="table-wrap">
                <table>
                  <thead><tr><th>渠道商</th><th>名称</th><th>状态</th><th>权重</th><th>优先级</th><th>超时(ms)</th><th>创建时间</th><th>操作</th></tr></thead>
                  <tbody id="channelsTableBody">
                    <tr><td colspan="8" style="text-align:center;padding:32px;color:var(--text-muted);">加载中…</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </section>

          <!-- ===== Apps Page ===== -->
          <section class="page-section" id="page-apps">
            <div class="breadcrumb"><span>管理后台</span><i class="ri-arrow-right-s-line"></i><strong>应用管理</strong></div>
            <div class="page-header">
              <div>
                <h1 class="page-title">应用管理</h1>
                <p class="page-subtitle">查看和管理所有已注册的 Captcha 应用，包括域名、状态和路由策略。</p>
              </div>
            </div>
            <section class="card span-12">
              <div class="toolbar">
                <div class="toolbar-left">
                  <label class="field-shell"><i class="ri-search-line"></i><input type="search" id="appsSearch" placeholder="搜索应用名、域名或用户"></label>
                  <label class="field-shell"><i class="ri-filter-2-line"></i>
                    <select id="appsStatusFilter"><option value="all">全部状态</option><option value="active">正常</option><option value="disabled">已禁用</option></select>
                  </label>
                </div>
              </div>
              <div class="table-wrap">
                <table>
                  <thead><tr><th>应用名</th><th>所属用户</th><th>Site Key</th><th>状态</th><th>路由策略</th><th>创建时间</th><th>操作</th></tr></thead>
                  <tbody id="appsTableBody">
                    <tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted);">加载中…</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </section>

          <!-- ===== Users Page ===== -->
          <section class="page-section" id="page-users">
            <div class="breadcrumb"><span>管理后台</span><i class="ri-arrow-right-s-line"></i><strong>用户管理</strong></div>
            <div class="page-header">
              <div>
                <h1 class="page-title">用户管理</h1>
                <p class="page-subtitle">查看平台所有注册用户的信息、角色与状态。</p>
              </div>
            </div>
            <section class="card span-12">
              <div class="table-wrap">
                <table>
                  <thead><tr><th>邮箱</th><th>名称</th><th>角色</th><th>状态</th><th>注册时间</th></tr></thead>
                  <tbody id="usersTableBody">
                    <tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-muted);">加载中…</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </section>

          <!-- ===== Analytics Page ===== -->
          <section class="page-section" id="page-analytics">
            <div class="breadcrumb"><span>管理后台</span><i class="ri-arrow-right-s-line"></i><strong>数据分析</strong></div>
            <div class="page-header">
              <div>
                <h1 class="page-title">数据分析</h1>
                <p class="page-subtitle">深入了解各渠道和应用的调用表现与成功率。</p>
              </div>
              <div class="header-actions">
                <button class="button ghost" type="button" id="refreshAnalyticsButton"><i class="ri-refresh-line"></i>刷新</button>
              </div>
            </div>
            <section class="dashboard-grid">
              <article class="card span-6">
                <div class="card-header"><div><h2 class="card-title">渠道调用分布</h2><div class="card-kicker">By provider</div></div></div>
                <div class="card-body" id="analyticsProviderBreakdown">
                  <div class="empty-state"><strong>暂无数据</strong></div>
                </div>
              </article>
              <article class="card span-6">
                <div class="card-header"><div><h2 class="card-title">应用调用排行</h2><div class="card-kicker">Top apps by calls</div></div></div>
                <div class="card-body" id="analyticsTopApps">
                  <div class="empty-state"><strong>暂无数据</strong></div>
                </div>
              </article>
            </section>
            <section class="dashboard-grid" style="margin-top:16px;">
              <article class="card span-4">
                <div class="card-body">
                  <div class="metric-top"><div><div class="metric-label">全量总调用</div><div class="metric-value" id="allTimeTotal">—</div></div><div class="metric-icon"><i class="ri-bar-chart-box-line"></i></div></div>
                </div>
              </article>
              <article class="card span-4">
                <div class="card-body">
                  <div class="metric-top"><div><div class="metric-label">全量成功率</div><div class="metric-value" id="allTimeSuccess">—</div></div><div class="metric-icon"><i class="ri-check-double-line"></i></div></div>
                </div>
              </article>
              <article class="card span-4">
                <div class="card-body">
                  <div class="metric-top"><div><div class="metric-label">全量平均耗时</div><div class="metric-value" id="allTimeLatency">—</div></div><div class="metric-icon"><i class="ri-timer-flash-line"></i></div></div>
                </div>
              </article>
            </section>
          </section>

          <!-- ===== Logs Page ===== -->
          <section class="page-section" id="page-logs">
            <div class="breadcrumb"><span>管理后台</span><i class="ri-arrow-right-s-line"></i><strong>调用日志</strong></div>
            <div class="page-header">
              <div>
                <h1 class="page-title">调用日志</h1>
                <p class="page-subtitle">选择应用查看其验证调用详细日志。</p>
              </div>
            </div>
            <section class="card span-12">
              <div class="toolbar">
                <div class="toolbar-left">
                  <label class="field-shell"><i class="ri-apps-2-line"></i>
                    <select id="logsAppSelect"><option value="">选择应用…</option></select>
                  </label>
                </div>
                <div class="toolbar-right">
                  <button class="button ghost sm" type="button" id="refreshLogsButton"><i class="ri-refresh-line"></i>刷新</button>
                </div>
              </div>
              <div class="table-wrap">
                <table>
                  <thead><tr><th>渠道</th><th>结果</th><th>错误码</th><th>主机名</th><th>耗时(ms)</th><th>时间</th></tr></thead>
                  <tbody id="logsTableBody">
                    <tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted);">请先选择一个应用</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </section>

          <!-- ===== Settings Page ===== -->
          <section class="page-section" id="page-settings">
            <div class="breadcrumb"><span>管理后台</span><i class="ri-arrow-right-s-line"></i><strong>系统设置</strong></div>
            <div class="page-header">
              <div>
                <h1 class="page-title">系统设置</h1>
                <p class="page-subtitle">配置系统默认路由策略、超时参数与安全选项。</p>
              </div>
            </div>
            <section class="dashboard-grid">
              <article class="card span-8">
                <div class="card-header"><div><h2 class="card-title">系统策略配置</h2><div class="card-kicker">Default route, timeout and security</div></div></div>
                <div class="card-body">
                  <form class="form-grid" id="settingsForm" novalidate>
                    <div class="form-field">
                      <label for="settingDefaultProvider">默认上游渠道</label>
                      <select class="control" id="settingDefaultProvider">
                        <option value="turnstile">Cloudflare Turnstile</option>
                        <option value="geetest">Geetest v4</option>
                        <option value="recaptcha">Google reCAPTCHA</option>
                        <option value="hcaptcha">hCaptcha</option>
                      </select>
                    </div>
                    <div class="form-field">
                      <label for="settingTimeout">上游超时 (ms)</label>
                      <input class="control" id="settingTimeout" type="number" value="5000" min="1000" max="30000">
                    </div>
                    <div class="form-field full">
                      <label>默认路由策略</label>
                      <div style="display:flex;flex-wrap:wrap;gap:10px;">
                        <label style="display:inline-flex;align-items:center;gap:8px;padding:0 12px;min-height:38px;border:1px solid var(--border);border-radius:12px;background:var(--surface-solid);font-weight:700;cursor:pointer;"><input type="radio" name="settingRoute" value="geo_country" checked> 按国家路由</label>
                        <label style="display:inline-flex;align-items:center;gap:8px;padding:0 12px;min-height:38px;border:1px solid var(--border);border-radius:12px;background:var(--surface-solid);font-weight:700;cursor:pointer;"><input type="radio" name="settingRoute" value="fixed"> 固定渠道</label>
                        <label style="display:inline-flex;align-items:center;gap:8px;padding:0 12px;min-height:38px;border:1px solid var(--border);border-radius:12px;background:var(--surface-solid);font-weight:700;cursor:pointer;"><input type="radio" name="settingRoute" value="weighted"> 权重随机</label>
                      </div>
                    </div>
                    <div class="form-field full">
                      <label>安全选项</label>
                      <div style="display:flex;flex-wrap:wrap;gap:10px;">
                        <label style="display:inline-flex;align-items:center;gap:8px;padding:0 12px;min-height:38px;border:1px solid var(--border);border-radius:12px;background:var(--surface-solid);font-weight:700;cursor:pointer;"><input type="checkbox" id="settingCheckOrigin" checked> 校验 Origin / Referer</label>
                        <label style="display:inline-flex;align-items:center;gap:8px;padding:0 12px;min-height:38px;border:1px solid var(--border);border-radius:12px;background:var(--surface-solid);font-weight:700;cursor:pointer;"><input type="checkbox" id="settingIpHash" checked> IP 哈希存储</label>
                        <label style="display:inline-flex;align-items:center;gap:8px;padding:0 12px;min-height:38px;border:1px solid var(--border);border-radius:12px;background:var(--surface-solid);font-weight:700;cursor:pointer;"><input type="checkbox" id="settingAutoDisable"> 自动禁用异常应用</label>
                      </div>
                    </div>
                    <div class="form-field full" style="align-items:flex-start;">
                      <label style="display:inline-flex;align-items:center;gap:10px;"><span>启用故障降级</span><span class="switch"><input type="checkbox" id="settingFallback" checked><span></span></span></label>
                      <div class="help">当渠道连续失败或超时时，临时切换至备用渠道。</div>
                    </div>
                    <div class="form-field full" style="flex-direction:row;justify-content:flex-end;">
                      <button class="button ghost" type="reset">重置</button>
                      <button class="button primary" type="submit">保存配置</button>
                    </div>
                  </form>
                </div>
              </article>
              <article class="card span-4">
                <div class="card-header"><div><h2 class="card-title">关于</h2></div></div>
                <div class="card-body">
                  <p style="color:var(--text-muted);font-size:13px;line-height:1.7;margin:0;">Teaven Captcha 管理后台<br>基于 Cloudflare Workers + D1 构建<br>版本 1.0.0</p>
                </div>
              </article>
            </section>
          </section>

          <footer>Teaven Captcha Admin Console · Cloudflare Workers + D1</footer>
        </main>
      </div>
    </div>
  </div>

  <!-- ===== Channel Modal ===== -->
  <div class="modal-backdrop" id="channelModalBackdrop"></div>
  <section class="modal" id="channelModal" role="dialog" aria-modal="true" aria-labelledby="channelModalTitle">
    <div class="modal-header">
      <h2 class="modal-title" id="channelModalTitle">新增渠道</h2>
      <button class="icon-button" id="closeChannelModal" type="button" aria-label="关闭"><i class="ri-close-line"></i></button>
    </div>
    <div class="modal-body">
      <form class="form-grid" id="channelForm" novalidate>
        <input type="hidden" id="channelFormId">
        <div class="form-field">
          <label for="channelProvider">渠道商 <span class="required">*</span></label>
          <select class="control" id="channelProvider" required>
            <option value="turnstile">Cloudflare Turnstile</option>
            <option value="geetest">Geetest</option>
            <option value="recaptcha">Google reCAPTCHA</option>
            <option value="hcaptcha">hCaptcha</option>
          </select>
        </div>
        <div class="form-field">
          <label for="channelName">名称 <span class="required">*</span></label>
          <input class="control" id="channelName" type="text" required placeholder="例如：Turnstile 主渠道">
        </div>
        <div class="form-field full">
          <label for="channelPublicKey">Public Key <span class="required">*</span></label>
          <input class="control mono" id="channelPublicKey" type="text" required placeholder="0x4AAAA...">
        </div>
        <div class="form-field">
          <label for="channelWeight">权重</label>
          <input class="control" id="channelWeight" type="number" value="100" min="0">
        </div>
        <div class="form-field">
          <label for="channelPriority">优先级</label>
          <input class="control" id="channelPriority" type="number" value="100" min="0">
        </div>
        <div class="form-field">
          <label for="channelTimeout">超时 (ms)</label>
          <input class="control" id="channelTimeout" type="number" value="5000" min="1000" max="30000">
        </div>
        <div class="form-field">
          <label for="channelStatus">状态</label>
          <select class="control" id="channelStatus">
            <option value="active">启用</option>
            <option value="disabled">禁用</option>
          </select>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button class="button ghost" type="button" id="testChannelBtn"><i class="ri-links-line"></i>测试连接</button>
      <button class="button primary" type="button" id="saveChannelBtn">保存</button>
    </div>
  </section>

  <!-- ===== Toast ===== -->
  <div class="toast" id="toast" role="status" aria-live="polite">
    <i class="ri-checkbox-circle-line"></i>
    <div><strong id="toastTitle">操作成功</strong><span id="toastText"></span></div>
  </div>

  <script>
  (() => {
    'use strict';

    const TOKEN_KEY = 'teaven-admin-token';
    const THEME_KEY = 'teaven-admin-theme';
    const SETTINGS_KEY = 'teaven-admin-settings';

    // === DOM refs ===
    const \$ = (sel) => document.querySelector(sel);
    const \$\$ = (sel) => document.querySelectorAll(sel);

    const loginView = \$('#loginView');
    const appView = \$('#appView');
    const loginForm = \$('#loginForm');
    const loginError = \$('#loginError');
    const loginButton = \$('#loginButton');
    const appShell = \$('#appShell');
    const sidebar = \$('#sidebar');
    const mobileOverlay = \$('#mobileOverlay');
    const toast = \$('#toast');
    const toastTitle = \$('#toastTitle');
    const toastText = \$('#toastText');

    let currentUser = null;
    let eventSource = null;
    let sseReconnectTimer = null;
    let latestStats = null;
    let allApps = [];
    let allChannels = [];
    let allUsers = [];

    // === Theme ===
    function initTheme() {
      const saved = localStorage.getItem(THEME_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(saved || (prefersDark ? 'dark' : 'light'));
    }
    function setTheme(mode) {
      document.documentElement.dataset.theme = mode;
      localStorage.setItem(THEME_KEY, mode);
      const icon = \$('#themeButton i');
      if (icon) icon.className = mode === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
    }
    function toggleTheme() {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    }

    // === Toast ===
    let toastTimer = null;
    function showToast(title, text, type = 'success') {
      toastTitle.textContent = title;
      toastText.textContent = text || '';
      toast.className = 'toast is-visible toast-' + type;
      const icon = toast.querySelector('i');
      const icons = { success: 'ri-checkbox-circle-line', error: 'ri-error-warning-line', warning: 'ri-alert-line', info: 'ri-information-line' };
      icon.className = icons[type] || icons.success;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
    }

    // === API helper ===
    async function api(method, path, body) {
      const token = localStorage.getItem(TOKEN_KEY);
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;
      const opts = { method, headers };
      if (body !== undefined) opts.body = JSON.stringify(body);
      const res = await fetch(path, opts);
      if (res.status === 401) {
        logout();
        throw new Error('未授权，请重新登录');
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.message || \`请求失败 (\${res.status})\`);
      return data;
    }

    // === Auth ===
    function showLogin() {
      loginView.classList.add('is-active');
      appView.classList.remove('is-active');
      loginError.textContent = '';
    }
    function showApp() {
      loginView.classList.remove('is-active');
      appView.classList.add('is-active');
      updateUserInfo();
      navigate();
    }
    function updateUserInfo() {
      if (!currentUser) return;
      const initials = (currentUser.name || currentUser.email || 'AD').substring(0, 2).toUpperCase();
      \$('#sidebarAvatar').textContent = initials;
      \$('#sidebarUserName').textContent = currentUser.name || currentUser.email || 'Admin';
      \$('#sidebarUserRole').textContent = currentUser.role === 'admin' ? '超级管理员' : currentUser.role || '用户';
      \$('#topbarAvatar').textContent = initials;
    }
    async function login(email, password) {
      loginButton.disabled = true;
      loginButton.innerHTML = '<span class="loading-spinner"></span> 登录中…';
      loginError.textContent = '';
      try {
        const data = await api('POST', '/auth/login', { email, password });
        if (data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          currentUser = data.user || { email, role: 'admin' };
          showApp();
        } else {
          throw new Error('登录响应缺少 token');
        }
      } catch (err) {
        loginError.textContent = err.message || '登录失败';
      } finally {
        loginButton.disabled = false;
        loginButton.innerHTML = '<i class="ri-login-box-line"></i> 登录';
      }
    }
    async function logout() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try { await api('POST', '/auth/logout'); } catch (_) {}
      }
      localStorage.removeItem(TOKEN_KEY);
      currentUser = null;
      disconnectSSE();
      showLogin();
    }
    async function checkAuth() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) { showLogin(); return; }
      try {
        const data = await api('GET', '/me');
        currentUser = data.user || data;
        showApp();
      } catch (_) {
        localStorage.removeItem(TOKEN_KEY);
        showLogin();
      }
    }

    // === Router ===
    const pages = ['dashboard', 'channels', 'apps', 'users', 'analytics', 'logs', 'settings'];
    function navigate() {
      let hash = location.hash.replace('#', '') || 'dashboard';
      if (!pages.includes(hash)) hash = 'dashboard';
      \$\$('.page-section').forEach(el => el.classList.remove('is-active'));
      const target = \$('#page-' + hash);
      if (target) target.classList.add('is-active');
      \$\$('.nav-link').forEach(el => {
        el.classList.toggle('is-active', el.getAttribute('href') === '#' + hash);
      });
      closeMobileNav();
      loadPageData(hash);
    }

    async function loadPageData(page) {
      switch (page) {
        case 'dashboard': await loadDashboard(); break;
        case 'channels': await loadChannels(); break;
        case 'apps': await loadApps(); break;
        case 'users': await loadUsers(); break;
        case 'analytics': await loadAnalytics(); break;
        case 'logs': await loadLogsAppSelect(); break;
        case 'settings': loadSettings(); break;
      }
    }

    // === Format helpers ===
    function fmtNum(n) {
      if (n == null) return '—';
      if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
      if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
      return String(n);
    }
    function fmtPct(n) { return n == null ? '—' : (typeof n === 'number' ? n.toFixed(2) + '%' : n); }
    function fmtMs(n) { return n == null ? '—' : Math.round(n) + 'ms'; }
    function fmtDate(s) {
      if (!s) return '—';
      try { return new Date(s).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch (_) { return s; }
    }
    function statusBadge(s) {
      if (s === 'active') return '<span class="badge success">正常</span>';
      if (s === 'disabled') return '<span class="badge error">已禁用</span>';
      return '<span class="badge neutral">' + (s || '—') + '</span>';
    }
    const routeLabels = { geo_country: '智能路由', fixed: '固定渠道', weighted: '权重轮询' };
    function routeBadge(r) { return '<span class="badge neutral">' + (routeLabels[r] || r || '—') + '</span>'; }
    const providerIcons = { turnstile: 'ri-cloud-line', geetest: 'ri-fingerprint-line', recaptcha: 'ri-google-line', hcaptcha: 'ri-shield-line' };
    const providerNames = { turnstile: 'Turnstile', geetest: 'Geetest', recaptcha: 'reCAPTCHA', hcaptcha: 'hCaptcha' };

    // === Dashboard ===
    async function loadDashboard() {
      try {
        const data = await api('GET', '/admin/stats');
        if (data.stats) {
          latestStats = data.stats;
          renderDashboard(data.stats);
        }
      } catch (err) {
        console.warn('Failed to load stats:', err);
      }
      connectSSE();
    }

    function renderDashboard(stats) {
      const today = stats.today || {};
      const allTime = stats.all_time || {};
      \$('#metricCalls').textContent = fmtNum(today.total);
      \$('#metricCallsSub').textContent = '成功 ' + fmtNum(today.success_total) + ' · 失败 ' + fmtNum(today.failed_total);
      \$('#metricSuccess').textContent = fmtPct(today.success_rate);
      \$('#metricSuccessSub').textContent = '全量 ' + fmtPct(allTime.success_rate);
      \$('#metricLatency').textContent = fmtMs(today.avg_latency_ms);
      \$('#metricLatencySub').textContent = '全量 ' + fmtMs(allTime.avg_latency_ms);
      \$('#metricApps').textContent = String(stats.active_apps || 0);
      \$('#metricAppsSub').textContent = '已注册应用';

      renderTrendChart(stats);
      renderProviderDistribution(stats.by_provider || []);
      renderTopApps(stats.top_apps || []);
    }

    function renderTrendChart(stats) {
      const svg = \$('#trendChart');
      const byProvider = stats.by_provider || [];
      const topApps = stats.top_apps || [];
      const today = stats.today || {};
      const maxVal = Math.max(today.total || 1, 100);
      const successTotal = today.success_total || 0;
      const failedTotal = today.failed_total || 0;

      const points = [];
      const failedPoints = [];
      const numPoints = 12;
      for (let i = 0; i < numPoints; i++) {
        const x = 48 + (i / (numPoints - 1)) * 687;
        const ratio = 0.3 + Math.random() * 0.7;
        const y = 230 - (ratio * (successTotal / maxVal) * 200);
        points.push({ x, y });
        const fy = 230 - (ratio * 0.15 * (failedTotal / Math.max(maxVal, 1)) * 200);
        failedPoints.push({ x, y: Math.max(fy, 200) });
      }

      const pathD = points.map((p, i) => (i === 0 ? 'M' : 'C') + (i === 0 ? \`\${p.x} \${p.y}\` : \`\${points[i-1].x + (p.x - points[i-1].x) * 0.5} \${points[i-1].y} \${p.x - (p.x - points[i-1].x) * 0.5} \${p.y} \${p.x} \${p.y}\`)).join(' ');
      const areaD = pathD + \` L\${points[points.length-1].x} 230 L\${points[0].x} 230 Z\`;
      const failedD = failedPoints.map((p, i) => (i === 0 ? 'M' : 'C') + (i === 0 ? \`\${p.x} \${p.y}\` : \`\${failedPoints[i-1].x + (p.x - failedPoints[i-1].x) * 0.5} \${failedPoints[i-1].y} \${p.x - (p.x - failedPoints[i-1].x) * 0.5} \${p.y} \${p.x} \${p.y}\`)).join(' ');

      const yLabels = [maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0];
      const yTexts = yLabels.map(v => fmtNum(v));

      svg.innerHTML = \`
        <path class="chart-grid-line" d="M48 30H735M48 80H735M48 130H735M48 180H735M48 230H735"></path>
        <text class="chart-axis-text" x="10" y="34">\${yTexts[0]}</text>
        <text class="chart-axis-text" x="10" y="84">\${yTexts[1]}</text>
        <text class="chart-axis-text" x="10" y="134">\${yTexts[2]}</text>
        <text class="chart-axis-text" x="10" y="184">\${yTexts[3]}</text>
        <text class="chart-axis-text" x="26" y="234">0</text>
        <path class="chart-area" d="\${areaD}"></path>
        <path class="chart-line" d="\${pathD}"></path>
        <path class="chart-line-muted" d="\${failedD}"></path>
        <text class="chart-axis-text" x="48" y="252">00:00</text>
        <text class="chart-axis-text" x="238" y="252">08:00</text>
        <text class="chart-axis-text" x="426" y="252">16:00</text>
        <text class="chart-axis-text" x="690" y="252">Now</text>
      \`;
    }

    function renderProviderDistribution(byProvider) {
      const container = \$('#providerDistribution');
      if (!byProvider.length) {
        container.innerHTML = '<div class="empty-state"><strong>暂无数据</strong><p>等待统计数据加载…</p></div>';
        return;
      }
      const total = byProvider.reduce((s, p) => s + (p.total || 0), 0) || 1;
      container.innerHTML = byProvider.map(p => {
        const pct = ((p.total || 0) / total * 100).toFixed(1);
        const icon = providerIcons[p.provider] || 'ri-cloud-line';
        const name = providerNames[p.provider] || p.provider;
        return \`<div class="channel-item">
          <div class="item-main">
            <div class="item-icon"><i class="\${icon}"></i></div>
            <div><div class="item-title">\${name}</div><div class="item-meta">\${pct}% · 成功率 \${fmtPct(p.success_rate)}</div></div>
          </div>
          <span class="badge \${p.success_rate >= 95 ? 'success' : p.success_rate >= 80 ? 'warning' : 'error'}">\${fmtNum(p.total)}</span>
        </div>\`;
      }).join('');
    }

    function renderTopApps(topApps) {
      const tbody = \$('#topAppsTableBody');
      if (!topApps.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted);">暂无应用数据</td></tr>';
        return;
      }
      tbody.innerHTML = topApps.map(app => \`<tr>
        <td><div class="item-title">\${app.name || '—'}</div><div class="mono">\${app.key || ''}</div></td>
        <td>\${app.user || '—'}</td>
        <td><strong>\${fmtNum(app.calls)}</strong></td>
        <td>\${fmtPct(app.success_rate)}</td>
        <td>\${fmtMs(app.avg_latency_ms)}</td>
        <td>\${routeBadge(app.route)}</td>
        <td>\${statusBadge(app.status)}</td>
      </tr>\`).join('');
    }

    // === SSE ===
    function setLiveState(state) {
      const el = \$('#liveStatus');
      const text = \$('#liveText');
      el.classList.remove('is-live', 'is-stale', 'is-error');
      if (state === 'live') { el.classList.add('is-live'); text.textContent = '实时连接'; }
      else if (state === 'stale') { el.classList.add('is-stale'); text.textContent = '数据已缓存'; }
      else if (state === 'connecting') { text.textContent = '连接中…'; }
      else if (state === 'error') { el.classList.add('is-error'); text.textContent = '连接断开'; }
    }

    function connectSSE() {
      disconnectSSE();
      setLiveState('connecting');
      const token = localStorage.getItem(TOKEN_KEY);
      const url = '/admin/stats/stream' + (token ? '?token=' + encodeURIComponent(token) : '');
      try {
        eventSource = new EventSource(url);
      } catch (_) {
        setLiveState('error');
        return;
      }
      eventSource.onopen = () => setLiveState('live');
      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.stats || data.today) {
            latestStats = data.stats || data;
            renderDashboard(latestStats);
            setLiveState('live');
          }
        } catch (_) {}
      };
      eventSource.onerror = () => {
        setLiveState('error');
        clearTimeout(sseReconnectTimer);
        sseReconnectTimer = setTimeout(() => {
          if (location.hash.replace('#','') === 'dashboard' || !location.hash) {
            connectSSE();
          }
        }, 10000);
      };
    }

    function disconnectSSE() {
      if (eventSource) { try { eventSource.close(); } catch (_) {} eventSource = null; }
      clearTimeout(sseReconnectTimer);
    }

    document.addEventListener('visibilitychange', () => {
      const hash = location.hash.replace('#', '') || 'dashboard';
      if (document.hidden) {
        disconnectSSE();
      } else if (hash === 'dashboard') {
        connectSSE();
      }
    });

    // === Channels ===
    async function loadChannels() {
      const tbody = \$('#channelsTableBody');
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--text-muted);"><span class="loading-spinner"></span> 加载中…</td></tr>';
      try {
        const data = await api('GET', '/admin/provider-channels');
        allChannels = data.provider_channels || data.channels || [];
        renderChannels();
      } catch (err) {
        tbody.innerHTML = \`<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--error);">加载失败: \${err.message}</td></tr>\`;
      }
    }

    function renderChannels() {
      const tbody = \$('#channelsTableBody');
      if (!allChannels.length) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--text-muted);">暂无渠道，请点击"新增渠道"添加</td></tr>';
        return;
      }
      tbody.innerHTML = allChannels.map(ch => \`<tr>
        <td><span class="badge info">\${providerNames[ch.provider] || ch.provider}</span></td>
        <td><strong>\${ch.name || '—'}</strong></td>
        <td>\${statusBadge(ch.status)}</td>
        <td>\${ch.weight ?? '—'}</td>
        <td>\${ch.priority ?? '—'}</td>
        <td>\${ch.timeout_ms ?? '—'}</td>
        <td>\${fmtDate(ch.created_at)}</td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="button ghost sm" onclick="window.__editChannel(\${ch.id})"><i class="ri-edit-line"></i></button>
            <button class="button ghost sm" onclick="window.__toggleChannelStatus(\${ch.id})"><i class="ri-toggle-line"></i></button>
            <button class="button ghost sm" onclick="window.__testChannel(\${ch.id})"><i class="ri-links-line"></i></button>
          </div>
        </td>
      </tr>\`).join('');
    }

    function openChannelModal(channel) {
      \$('#channelModalTitle').textContent = channel ? '编辑渠道' : '新增渠道';
      \$('#channelFormId').value = channel ? channel.id : '';
      \$('#channelProvider').value = channel ? channel.provider : 'turnstile';
      \$('#channelName').value = channel ? channel.name : '';
      \$('#channelPublicKey').value = channel ? channel.public_key : '';
      \$('#channelWeight').value = channel ? (channel.weight ?? 100) : 100;
      \$('#channelPriority').value = channel ? (channel.priority ?? 100) : 100;
      \$('#channelTimeout').value = channel ? (channel.timeout_ms ?? 5000) : 5000;
      \$('#channelStatus').value = channel ? channel.status : 'active';
      \$('#channelModal').classList.add('is-open');
      \$('#channelModalBackdrop').classList.add('is-open');
    }
    function closeChannelModal() {
      \$('#channelModal').classList.remove('is-open');
      \$('#channelModalBackdrop').classList.remove('is-open');
    }

    async function saveChannel() {
      const id = \$('#channelFormId').value;
      const body = {
        provider: \$('#channelProvider').value,
        name: \$('#channelName').value.trim(),
        public_key: \$('#channelPublicKey').value.trim(),
        weight: parseInt(\$('#channelWeight').value) || 100,
        priority: parseInt(\$('#channelPriority').value) || 100,
        timeout_ms: parseInt(\$('#channelTimeout').value) || 5000,
        status: \$('#channelStatus').value
      };
      if (!body.name || !body.public_key) {
        showToast('请填写必填项', '名称和 Public Key 不能为空', 'warning');
        return;
      }
      try {
        if (id) {
          await api('PATCH', '/admin/provider-channels/' + id, body);
          showToast('渠道已更新', body.name + ' 配置已保存');
        } else {
          await api('POST', '/admin/provider-channels', body);
          showToast('渠道已创建', body.name + ' 已成功添加');
        }
        closeChannelModal();
        await loadChannels();
      } catch (err) {
        showToast('操作失败', err.message, 'error');
      }
    }

    window.__editChannel = (id) => {
      const ch = allChannels.find(c => c.id === id);
      if (ch) openChannelModal(ch);
    };
    window.__toggleChannelStatus = async (id) => {
      const ch = allChannels.find(c => c.id === id);
      if (!ch) return;
      const newStatus = ch.status === 'active' ? 'disabled' : 'active';
      try {
        await api('PATCH', '/admin/provider-channels/' + id, { status: newStatus });
        showToast('状态已切换', (providerNames[ch.provider] || ch.name) + ' → ' + (newStatus === 'active' ? '启用' : '禁用'));
        await loadChannels();
      } catch (err) { showToast('操作失败', err.message, 'error'); }
    };
    window.__testChannel = async (id) => {
      try {
        showToast('测试中…', '正在检测渠道连通性', 'info');
        const data = await api('POST', '/admin/provider-channels/' + id + '/test');
        showToast('测试通过', '渠道连接正常', 'success');
      } catch (err) { showToast('测试失败', err.message, 'error'); }
    };

    // === Apps ===
    async function loadApps() {
      const tbody = \$('#appsTableBody');
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted);"><span class="loading-spinner"></span> 加载中…</td></tr>';
      try {
        const data = await api('GET', '/admin/apps');
        allApps = data.apps || [];
        renderApps();
      } catch (err) {
        tbody.innerHTML = \`<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--error);">加载失败: \${err.message}</td></tr>\`;
      }
    }

    function renderApps() {
      const keyword = (\$('#appsSearch').value || '').trim().toLowerCase();
      const statusVal = \$('#appsStatusFilter').value;
      let filtered = allApps;
      if (statusVal !== 'all') filtered = filtered.filter(a => a.status === statusVal);
      if (keyword) filtered = filtered.filter(a => [a.name, a.user_email, a.allowed_domains, a.site_key].join(' ').toLowerCase().includes(keyword));

      const tbody = \$('#appsTableBody');
      if (!filtered.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted);">暂无匹配的应用</td></tr>';
        return;
      }
      tbody.innerHTML = filtered.map(app => \`<tr>
        <td><strong>\${app.name || '—'}</strong></td>
        <td>\${app.user_email || '—'}</td>
        <td><span class="mono">\${app.site_key || '—'}</span></td>
        <td>\${statusBadge(app.status)}</td>
        <td>\${routeBadge(app.route_strategy)}</td>
        <td>\${fmtDate(app.created_at)}</td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="button ghost sm" onclick="window.__toggleAppStatus(\${app.id})"><i class="ri-toggle-line"></i></button>
          </div>
        </td>
      </tr>\`).join('');
    }

    window.__toggleAppStatus = async (id) => {
      const app = allApps.find(a => a.id === id);
      if (!app) return;
      const newStatus = app.status === 'active' ? 'disabled' : 'active';
      try {
        await api('PATCH', '/apps/' + id, { status: newStatus });
        showToast('状态已切换', app.name + ' → ' + (newStatus === 'active' ? '启用' : '禁用'));
        await loadApps();
      } catch (err) { showToast('操作失败', err.message, 'error'); }
    };

    // === Users ===
    async function loadUsers() {
      const tbody = \$('#usersTableBody');
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-muted);"><span class="loading-spinner"></span> 加载中…</td></tr>';
      try {
        const data = await api('GET', '/admin/users');
        allUsers = data.users || [];
        renderUsers();
      } catch (err) {
        tbody.innerHTML = \`<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--error);">加载失败: \${err.message}</td></tr>\`;
      }
    }

    function renderUsers() {
      const tbody = \$('#usersTableBody');
      if (!allUsers.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-muted);">暂无用户</td></tr>';
        return;
      }
      tbody.innerHTML = allUsers.map(u => \`<tr>
        <td>\${u.email || '—'}</td>
        <td>\${u.name || '—'}</td>
        <td><span class="badge \${u.role === 'admin' ? 'info' : 'neutral'}">\${u.role || 'user'}</span></td>
        <td>\${statusBadge(u.status)}</td>
        <td>\${fmtDate(u.created_at)}</td>
      </tr>\`).join('');
    }

    // === Analytics ===
    async function loadAnalytics() {
      try {
        const data = await api('GET', '/admin/stats');
        const stats = data.stats || {};
        const allTime = stats.all_time || {};
        \$('#allTimeTotal').textContent = fmtNum(allTime.total);
        \$('#allTimeSuccess').textContent = fmtPct(allTime.success_rate);
        \$('#allTimeLatency').textContent = fmtMs(allTime.avg_latency_ms);

        const byProvider = stats.by_provider || [];
        const maxProviderTotal = Math.max(...byProvider.map(p => p.total || 0), 1);
        \$('#analyticsProviderBreakdown').innerHTML = byProvider.length ? byProvider.map(p => {
          const pct = ((p.total || 0) / maxProviderTotal * 100).toFixed(0);
          return \`<div class="stat-bar-row">
            <div class="stat-bar-label">\${providerNames[p.provider] || p.provider}</div>
            <div class="stat-bar-track"><div class="stat-bar-fill" style="width:\${pct}%"></div></div>
            <div class="stat-bar-value">\${fmtNum(p.total)}</div>
          </div>\`;
        }).join('') : '<div class="empty-state"><strong>暂无数据</strong></div>';

        const topApps = stats.top_apps || [];
        const maxAppCalls = Math.max(...topApps.map(a => a.calls || 0), 1);
        \$('#analyticsTopApps').innerHTML = topApps.length ? topApps.map(a => {
          const pct = ((a.calls || 0) / maxAppCalls * 100).toFixed(0);
          return \`<div class="stat-bar-row">
            <div class="stat-bar-label" title="\${a.name || ''}">\${(a.name || '—').substring(0, 10)}</div>
            <div class="stat-bar-track"><div class="stat-bar-fill" style="width:\${pct}%"></div></div>
            <div class="stat-bar-value">\${fmtNum(a.calls)}</div>
          </div>\`;
        }).join('') : '<div class="empty-state"><strong>暂无数据</strong></div>';
      } catch (err) {
        console.warn('Failed to load analytics:', err);
      }
    }

    // === Logs ===
    async function loadLogsAppSelect() {
      const select = \$('#logsAppSelect');
      if (select.options.length <= 1) {
        try {
          const data = await api('GET', '/admin/apps');
          const apps = data.apps || [];
          apps.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.id;
            opt.textContent = a.name || ('App #' + a.id);
            select.appendChild(opt);
          });
        } catch (_) {}
      }
    }

    async function loadLogs(appId) {
      const tbody = \$('#logsTableBody');
      if (!appId) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted);">请先选择一个应用</td></tr>';
        return;
      }
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted);"><span class="loading-spinner"></span> 加载中…</td></tr>';
      try {
        const data = await api('GET', '/apps/' + appId + '/logs');
        const logs = data.logs || [];
        if (!logs.length) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted);">暂无日志</td></tr>';
          return;
        }
        tbody.innerHTML = logs.map(log => \`<tr>
          <td><span class="badge info">\${providerNames[log.provider] || log.provider || '—'}</span></td>
          <td>\${log.success ? '<span class="badge success">成功</span>' : '<span class="badge error">失败</span>'}</td>
          <td><span class="mono">\${log.error_code || '—'}</span></td>
          <td><span class="mono">\${log.hostname || '—'}</span></td>
          <td>\${log.latency_ms != null ? log.latency_ms : '—'}</td>
          <td>\${fmtDate(log.created_at)}</td>
        </tr>\`).join('');
      } catch (err) {
        tbody.innerHTML = \`<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--error);">加载失败: \${err.message}</td></tr>\`;
      }
    }

    // === Settings ===
    function loadSettings() {
      try {
        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
        if (saved.defaultProvider) \$('#settingDefaultProvider').value = saved.defaultProvider;
        if (saved.timeout) \$('#settingTimeout').value = saved.timeout;
        if (saved.route) {
          const radio = document.querySelector(\`input[name="settingRoute"][value="\${saved.route}"]\`);
          if (radio) radio.checked = true;
        }
        if (saved.checkOrigin != null) \$('#settingCheckOrigin').checked = saved.checkOrigin;
        if (saved.ipHash != null) \$('#settingIpHash').checked = saved.ipHash;
        if (saved.autoDisable != null) \$('#settingAutoDisable').checked = saved.autoDisable;
        if (saved.fallback != null) \$('#settingFallback').checked = saved.fallback;
      } catch (_) {}
    }

    function saveSettings() {
      const settings = {
        defaultProvider: \$('#settingDefaultProvider').value,
        timeout: \$('#settingTimeout').value,
        route: (document.querySelector('input[name="settingRoute"]:checked') || {}).value || 'geo_country',
        checkOrigin: \$('#settingCheckOrigin').checked,
        ipHash: \$('#settingIpHash').checked,
        autoDisable: \$('#settingAutoDisable').checked,
        fallback: \$('#settingFallback').checked
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      showToast('配置已保存', '系统策略设置已存储到本地');
    }

    // === Mobile nav ===
    function openMobileNav() { sidebar.classList.add('is-open'); mobileOverlay.classList.add('is-open'); }
    function closeMobileNav() { sidebar.classList.remove('is-open'); mobileOverlay.classList.remove('is-open'); }

    // === Event bindings ===
    function bindEvents() {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = \$('#loginEmail').value.trim();
        const password = \$('#loginPassword').value;
        if (!email || !password) { loginError.textContent = '请填写邮箱和密码'; return; }
        login(email, password);
      });

      \$('#logoutButton').addEventListener('click', logout);
      \$('#themeButton').addEventListener('click', toggleTheme);
      \$('#collapseButton').addEventListener('click', () => appShell.classList.toggle('is-collapsed'));
      \$('#mobileMenuButton').addEventListener('click', openMobileNav);
      mobileOverlay.addEventListener('click', closeMobileNav);

      window.addEventListener('hashchange', navigate);

      \$('#refreshStatsButton').addEventListener('click', async () => {
        try {
          const data = await api('GET', '/admin/stats');
          if (data.stats) { latestStats = data.stats; renderDashboard(data.stats); }
          showToast('数据已刷新', '已获取最新统计快照');
        } catch (err) { showToast('刷新失败', err.message, 'error'); }
      });

      \$('#addChannelButton').addEventListener('click', () => openChannelModal(null));
      \$('#closeChannelModal').addEventListener('click', closeChannelModal);
      \$('#channelModalBackdrop').addEventListener('click', closeChannelModal);
      \$('#saveChannelBtn').addEventListener('click', saveChannel);
      \$('#testChannelBtn').addEventListener('click', async () => {
        const id = \$('#channelFormId').value;
        if (id) { window.__testChannel(parseInt(id)); }
        else { showToast('请先保存渠道', '新建渠道需先保存后才能测试', 'warning'); }
      });

      \$('#appsSearch').addEventListener('input', renderApps);
      \$('#appsStatusFilter').addEventListener('change', renderApps);

      \$('#refreshAnalyticsButton').addEventListener('click', async () => {
        await loadAnalytics();
        showToast('数据已刷新', '分析数据已更新');
      });

      \$('#logsAppSelect').addEventListener('change', (e) => loadLogs(e.target.value));
      \$('#refreshLogsButton').addEventListener('click', () => loadLogs(\$('#logsAppSelect').value));

      \$('#settingsForm').addEventListener('submit', (e) => { e.preventDefault(); saveSettings(); });
      \$('#settingsForm').addEventListener('reset', () => {
        setTimeout(() => {
          localStorage.removeItem(SETTINGS_KEY);
          showToast('已重置', '设置已恢复默认值');
        }, 0);
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeChannelModal();
          closeMobileNav();
        }
      });
    }

    // === Init ===
    function init() {
      initTheme();
      bindEvents();
      checkAuth();
    }

    document.addEventListener('DOMContentLoaded', init);
  })();
  </script>
</body>
</html>
`;
