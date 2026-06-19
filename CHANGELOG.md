# Changelog

## 0.2.0 (2026-06-19)

### 新增
- 代理访问支持 HTTPS 目标站点（自动识别 URL 协议）
- 代理请求忽略 SSL 证书验证（适配自签名证书的内网服务）
- README 新增「与原版的区别」对比表
- README 新增「链接格式支持」说明
- README 新增「添加多个面板」说明
- README 新增「已知限制」章节

### 变更
- JS 面板组件修复 Shadow DOM 内 `ha-menu-button` 属性绑定问题（改用 JS 手动设置属性）
- 静态资源路径注册改为仅注册一次，避免多面板时报错
- 移除 `update_listener` 中的 `asyncio.sleep(1)`，选项更新更即时
- 移除 `config_flow.py` 中未使用的 `cv` 导入
- `package.json` 清理：移除 gitee 仓库引用、修正描述、更新版本号
- 删除过时的 Windows 批处理脚本 `build.cmd`，MDI 更新改为 npm script

### 修复
- 修复多面板场景下静态路径重复注册可能报错的问题
- 修复 Shadow DOM 内 HA 自定义元素属性无法正确传递的问题
- 修复 `http_proxy.py` 代理请求转发时未过滤 `transfer-encoding` 请求头的问题

## 0.1.0 (2026-06-19)

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
