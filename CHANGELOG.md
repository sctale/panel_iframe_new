# Changelog

## 2026.6.1 (2026-06-19)

### 新增
- 添加 `integration_type: "service"` 到 manifest.json（HA 2026 必填项）
- 添加 `panel_custom` 到 manifest.json 依赖项
- 添加 `issue_tracker` 到 manifest.json
- 添加中文翻译文件 (zh-CN.json)
- HTTPS 环境下嵌入 HTTP 页面时显示友好提示和新标签页链接

### 变更
- manifest.json `quality_scale` 从 `internal` 改为 `bronze`（`internal` 仅适用于核心集成）
- manifest.json `documentation` 从本地路径改为 GitHub 仓库 URL
- 最低 HA 版本要求从 2024.7.0 提升至 2025.1.0
- JS 面板组件从依赖 `ha-panel-lovelace` LitElement 继承改为独立 HTMLElement + Shadow DOM（更稳定，不受 HA 内部变更影响）
- manifest.py 从使用 `homeassistant.util.json.load_json` 改为标准 `json` 模块（避免 HA 内部 API 变更影响）
- 代码风格优化：添加文档字符串、类型注解、移除未使用的变量

### 修复
- 修复 config_flow.py 中未使用的 `errors` 变量
- 修复 manifest.py 中路径拼接使用 f-string 的问题（改用 `os.path.join`）

## 2026.4.13

- 初始版本
