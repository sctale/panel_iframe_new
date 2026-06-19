# 侧边栏面板 (Panel Iframe)

[![hacs_badge](https://img.shields.io/badge/Home-Assistant-%23049cdb)](https://www.home-assistant.io/)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/shaonianzhentan/panel_iframe)

在 Home Assistant 侧边栏添加自定义 iframe 面板，支持将任意网页嵌入到 HA 界面中。

## 致谢

本项目基于 **[@shaonianzhentan](https://github.com/shaonianzhentan)** 的原创工作开发，感谢原作者的贡献和付出！

## 功能特性

- 在 HA 侧边栏添加自定义网页面板
- 支持多种显示模式：默认、全屏、新页面、内置页面
- 支持代理访问，解决跨域问题
- 支持管理员可见设置
- 支持 WebSocket 代理
- 支持 HTTPS 环境下的安全提示
- 兼容 Home Assistant 2025.x - 2026.x

## 安装方式

### 通过 HACS 安装（推荐）

1. 在 HACS 中搜索「侧边栏面板」或「panel_iframe」
2. 点击安装
3. 重启 Home Assistant
4. 刷新页面

### 手动安装

1. 下载本仓库的 `custom_components/panel_iframe` 目录
2. 复制到你的 Home Assistant `custom_components/` 目录下
3. 重启 Home Assistant
4. 刷新页面

## 配置

安装完成后，在 **设置 → 设备与服务 → 添加集成** 中搜索 `侧边栏面板` 即可。

[![Add Integration](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start?domain=panel_iframe)

### 添加面板

1. 搜索并选择「侧边栏面板」
2. 输入面板名称（如：Node-RED）
3. 在选项中配置：
   - **图标**：侧边栏显示的图标（如 `mdi:nodejs`）
   - **链接**：要嵌入的网页地址
   - **显示模式**：
     - `默认` - 带 HA 顶部工具栏的 iframe 嵌入
     - `全屏` - 无工具栏的全屏 iframe
     - `新页面` - 在新标签页中打开
     - `内置页面` - 在 HA 内部导航
   - **管理员可见**：仅管理员可看到此面板
   - **代理访问**：通过 HA 服务器代理请求（解决跨域问题）

### 代理访问

启用代理访问后，可以通过 HA 服务器访问内网服务：

- 内网地址：`http://localhost:1880/node-red/`
- 代理地址：`http://HASS地址:8123/node-red/`

## 使用提示

- 长按侧边栏面板标题 `Home Assistant` 可隐藏菜单
- HTTPS 环境下无法嵌入 HTTP 页面（浏览器安全限制），插件会自动提示在新标签页打开
- 代理访问功能适用于内网服务，不懂请勿勾选

## 兼容性

| HA 版本 | 插件版本 | 状态 |
|---------|---------|------|
| 2025.1+ | 0.1.0 | 兼容 |

## 技术栈

- Python 3.12+
- Home Assistant Custom Integration
- Web Components (Custom Elements v1)
- aiohttp (HTTP/WebSocket 代理)

## 许可证

MIT License - 详见 [LICENSE](LICENSE)
